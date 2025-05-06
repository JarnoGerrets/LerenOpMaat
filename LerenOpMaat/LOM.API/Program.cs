using LOM.API.DAL;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

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
