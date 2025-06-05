using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Hosting;
using Microsoft.VisualStudio.TestPlatform.TestHost;
namespace LOM.API.Tests.TestHelpers
{
    public class CustomWebApplicationFactory : WebApplicationFactory<Program>
    {
        protected override IHost CreateHost(IHostBuilder builder)
        {
            return base.CreateHost(builder);
        }

        private string GetProjectPath(string projectName)
        {
            var currentDir = Directory.GetCurrentDirectory();

            while (currentDir != null && !Directory.Exists(Path.Combine(currentDir, projectName)))
            {
                currentDir = Directory.GetParent(currentDir)?.FullName;
            }

            if (currentDir == null)
                throw new InvalidOperationException($"Project directory '{projectName}' not found.");

            return Path.Combine(currentDir, projectName);
        }
    }
}
