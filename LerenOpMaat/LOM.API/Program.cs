using LOM.API.DAL;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add CORS services
builder.Services.AddCors(options =>
{
	var corsSettings = builder.Configuration.GetSection("Cors");
	options.AddPolicy("AppCorsPolicy", policy =>
	{
		policy.WithOrigins(corsSettings["AllowedOrigins"].Split(','))
			  .WithMethods(corsSettings["AllowedMethods"].Split(','))
			  .WithHeaders(corsSettings["AllowedHeaders"].Split(','))
			  .AllowCredentials();
	});
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
		.EnableSensitiveDataLogging()
		.EnableDetailedErrors()
);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
	ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

// Enable CORS before other middleware
app.UseCors("AppCorsPolicy");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.UseStaticFiles();
app.MapFallbackToFile("index.html");

app.Run();
