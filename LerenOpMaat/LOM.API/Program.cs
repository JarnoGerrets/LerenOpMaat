using LOM.API.DAL;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
builder.Services.AddCors(options =>
{
	options.AddPolicy("AppCorsPolicy", policy =>
	{
		policy.WithOrigins(allowedOrigins ?? [])
			  .AllowAnyHeader()
			  .AllowAnyMethod();
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
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {/
    app.UseSwagger();
    app.UseSwaggerUI();
// }

app.UseHttpsRedirection();
app.UseCors("AppCorsPolicy");
app.UseAuthorization();
app.MapControllers();

app.Run();
