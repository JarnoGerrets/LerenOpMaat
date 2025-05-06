using LOM.API.DAL;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configure Sentry
builder.WebHost.UseSentry((Action<Sentry.AspNetCore.SentryAspNetCoreOptions>)(options =>
{
	options.Dsn = builder.Configuration["Sentry:Dsn"];
	options.TracesSampleRate = 1.0;
	options.Environment = builder.Environment.EnvironmentName;
	options.MinimumBreadcrumbLevel = LogLevel.Information;
	options.MinimumEventLevel = LogLevel.Warning;
	options.MaxBreadcrumbs = 100;
	options.AttachStacktrace = true;
	options.SendDefaultPii = true;
	options.Debug = builder.Environment.IsDevelopment();
}));

// Add CORS services
builder.Services.AddCors(options =>
{
	options.AddPolicy("CorsPolicy",
		policy => policy
			.SetIsOriginAllowedToAllowWildcardSubdomains()
			.WithOrigins(
				"https://lom.robhutten.nl",
				"https://lerenopmaat.info",
				"http://localhost:3000", // Add local development
				"http://localhost:5173"  // Add Vite default port
			)
			.AllowAnyMethod()
			.AllowCredentials()
			.AllowAnyHeader()
			.Build()
	);
});

// Add services to the container.
builder.Services.AddControllers();
// builder.Services.AddDbContext<LOMContext>(options => options.UseSqlite(builder.Configuration.GetConnectionString("Local-LOM-DB")));
builder.Services.AddDbContext<LOMContext>(options =>
	options.UseMySql(
			builder.Configuration.GetConnectionString("ExternMySql"),
			ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("ExternMySql"))
		)
		.LogTo(Console.WriteLine, LogLevel.Information)
);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure forwarded headers first
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
	ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost
});

// Global exception handling
app.Use(async (context, next) =>
{
	try
	{
		await next();
	}
	catch (Exception ex)
	{
		// Capture the exception in Sentry
		SentrySdk.CaptureException(ex, scope =>
		{
			scope.SetTag("endpoint", context.Request.Path);
			scope.SetTag("method", context.Request.Method);
			scope.SetExtra("query_string", context.Request.QueryString.ToString());
			scope.SetExtra("headers", context.Request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString()));
			
			// Add user information if available
			if (context.User?.Identity?.IsAuthenticated == true)
			{
				scope.User = new Sentry.User
				{
					Id = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value,
					Username = context.User.Identity.Name
				};
			}
		});

		// Re-throw the exception to maintain the original behavior
		throw;
	}
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

// Enable CORS before other middleware
app.UseCors("CorsPolicy");

// app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.UseStaticFiles();
app.MapFallbackToFile("index.html");

app.Run();
