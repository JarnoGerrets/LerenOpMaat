using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;
using LOM.API.DAL;
using LOM.API.DTO;
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
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
		options.JsonSerializerOptions.PropertyNamingPolicy = null; // Preserve PascalCase
		options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.TypeInfoResolver = new DefaultJsonTypeInfoResolver
        {
            Modifiers =
            {
                ti =>
                {
                    if (ti.Type == typeof(RequirementDto))
                    {
                        ti.PolymorphismOptions = new JsonPolymorphismOptions
                        {
                            TypeDiscriminatorPropertyName = "$type",
                            IgnoreUnrecognizedTypeDiscriminators = true,
                            DerivedTypes =
                            {
                                new JsonDerivedType(typeof(ModuleRequirementDto), "module"),
                                new JsonDerivedType(typeof(EcRequirementDto), "ec")
                            }
                        };
                    }
                }
            }
        };
    });
builder.Services.AddDbContext<LOMContext>(options => options.UseSqlite(builder.Configuration.GetConnectionString("Local-LOM-DB")));
//builder.Services.AddDbContext<LOMContext>(options =>
//	options.UseMySql(
//			builder.Configuration.GetConnectionString("ExternMySql"),
//			ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("ExternMySql"))
//		)
//		.LogTo(Console.WriteLine, LogLevel.Information)
//		.EnableSensitiveDataLogging()
//		.EnableDetailedErrors()
//);

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
app.UseStaticFiles();
app.MapFallbackToFile("index.html");

app.Run();
