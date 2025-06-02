using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;
using LOM.API.DAL;
using LOM.API.DTO;
using Microsoft.Identity.Web;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using LOM.API.Middleware;
using LOM.API.Validator;
using LOM.API.Validator.ValidationService;

var builder = WebApplication.CreateBuilder(args);
IEnumerable<string>? initialScopes = builder.Configuration.GetSection("DownstreamApis:MicrosoftGraph:Scopes").Get<IEnumerable<string>>();

builder.Services.AddMicrosoftIdentityWebAppAuthentication(builder.Configuration, "AzureAd")
    .EnableTokenAcquisitionToCallDownstreamApi(initialScopes)
        .AddInMemoryTokenCaches();
builder.Services.AddDownstreamApis(builder.Configuration.GetSection("DownstreamApis"));

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AppCorsPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins ?? [])
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
// Configure OpenID Connect to handle API requests without redirecting to the login page
builder.Services.Configure<OpenIdConnectOptions>(OpenIdConnectDefaults.AuthenticationScheme, options =>
{
    options.Events.OnRedirectToIdentityProvider = context =>
    {
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode = 401;
            context.HandleResponse();
        }

        return Task.CompletedTask;
    };
});


// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null; // Preserve PascalCase
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
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
                                new JsonDerivedType(typeof(EcRequirementDto), "ec"),
                                new JsonDerivedType(typeof(NumericRequirementDto), "numeric")
                           }
                       };
                   }
               }
           }
        };
    });

//builder.Services.AddDbContext<LOMContext>(options => options.UseSqlite(builder.Configuration.GetConnectionString("Local-LOM-DB")));
builder.Services.AddDbContext<LOMContext>(options =>
    options.UseMySql(
            builder.Configuration.GetConnectionString("ExternMySql"),
            ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("ExternMySql"))
        )
        .LogTo(Console.WriteLine, LogLevel.Information)
        .EnableSensitiveDataLogging()
        .EnableDetailedErrors()
);
builder.Services.AddScoped<SemesterValidationService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSession();
builder.Services.AddDistributedMemoryCache();

var app = builder.Build();

// Middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseSession();
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
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseStaticFiles();
app.MapFallbackToFile("index.html");

app.Run();
