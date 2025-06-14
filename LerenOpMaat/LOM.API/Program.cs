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
using System.Threading.RateLimiting;
using LOM.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Configure Sentry first to catch every exception
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

builder.WebHost.ConfigureKestrel(options =>
{
	options.AddServerHeader = false;
});

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
			  .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
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

    options.SignedOutCallbackPath = "/signout-callback-oidc";
    options.Events.OnSignedOutCallbackRedirect = context =>
    {
        context.Response.Redirect("/");
        context.HandleResponse();
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
builder.Services.AddRateLimiter(options =>
{
    options.AddPolicy("ValidateLimiter", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.User.Identity?.Name ?? context.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
            factory: key => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 75,
                Window = TimeSpan.FromMinutes(1),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0
            }));
    options.AddPolicy("PostLimiter", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.User.Identity?.Name ?? context.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
            factory: key => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 25,
                Window = TimeSpan.FromMinutes(1),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0
            }));
    options.AddPolicy("GetLimiter", context =>
        RateLimitPartition.GetFixedWindowLimiter(
        partitionKey: context.User.Identity?.Name ?? context.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
        factory: key => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 350,
            Window = TimeSpan.FromMinutes(1),
            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            QueueLimit = 0
        }));
    options.AddPolicy("LoginLimiter", context =>
        RateLimitPartition.GetFixedWindowLimiter(
        partitionKey: context.User.Identity?.Name ?? context.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
        factory: key => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 10,
            Window = TimeSpan.FromMinutes(1),
            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            QueueLimit = 0
        }));
    options.AddPolicy("DeleteLimiter", context =>
        RateLimitPartition.GetFixedWindowLimiter(
        partitionKey: context.User.Identity?.Name ?? context.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
        factory: key => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 50,
            Window = TimeSpan.FromMinutes(1),
            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            QueueLimit = 0
        }));
    options.AddPolicy("MessageLimiter", context =>
        RateLimitPartition.GetFixedWindowLimiter(
        partitionKey: context.User.Identity?.Name ?? context.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
        factory: key => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 100,
            Window = TimeSpan.FromMinutes(1),
            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            QueueLimit = 0
        }));
});

builder.Services.AddScoped<ISemesterValidationService, SemesterValidationService>();
builder.Services.AddScoped<IVirusScanner, VirusScanner>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSession(options =>
    {
        // options.Cookie.Name = "__Host-.AspNetCore.Session";
        options.Cookie.HttpOnly = true;
        options.Cookie.IsEssential = true;
    }
);
builder.Services.AddDistributedMemoryCache();
builder.Services.ConfigureApplicationCookie(options =>
{
    options.LogoutPath = "/api/account/logout";
});
var app = builder.Build();
app.MapGet("/debug/student", () => "Student reached");
// Middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseRateLimiter();
app.UseSession();
app.Use(async (context, next) =>
{
	context.Response.Headers["X-Content-Type-Options"] = "nosniff";
	await next();
});
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});
app.UseCookiePolicy(
    new CookiePolicyOptions {
        Secure = CookieSecurePolicy.Always
    }
);

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {/
app.UseSwagger();
app.UseSwaggerUI();
// }

app.UseHsts();
app.UseHttpsRedirection();
app.UseCors("AppCorsPolicy");
app.UseMiddleware<HttpMethodRestrictionMiddleware>();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseStaticFiles();
app.MapFallbackToFile("index.html");
app.UseMiddleware<SecurityHeadersMiddleware>();
app.Run();
public partial class Program { }