using VirusTotalNet;
using VirusTotalNet.ResponseCodes;
using LOM.API.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;

namespace LOM.API.Services
{
    public class VirusScanner : IVirusScanner
    {
        private readonly VirusTotal _virusTotal;

        public VirusScanner(IConfiguration config)
        {
            var apiKey = config["VirusTotal:ApiKey"];
            _virusTotal = new VirusTotal(apiKey);
        }

        public async Task<(bool isSafe, string? virusName)> ScanFileAsync(byte[] fileBytes, string fileName)
        {
            var sha256 = CalculateSHA256(fileBytes);

            var existingScan = await _virusTotal.GetFileReportAsync(sha256);
            if (existingScan.ResponseCode == FileReportResponseCode.Present)
            {
                return (existingScan.Positives == 0, existingScan.Positives > 0 ? "Known threat detected" : null);
            }

            var scanResult = await _virusTotal.ScanFileAsync(new MemoryStream(fileBytes), fileName);
            int maxAttempts = 5;
            int delayMs = 2000;

            for (int attempt = 0; attempt < maxAttempts; attempt++)
            {
                var finalReport = await _virusTotal.GetFileReportAsync(scanResult.SHA256);
                if (finalReport.ResponseCode == FileReportResponseCode.Present)
                {
                    return (finalReport.Positives == 0, finalReport.Positives > 0 ? "Threat found after scan" : null);
                }
                await Task.Delay(delayMs);
            }

            // Als geen resultaat beschikbaar is na retries, ga uit van onveilig
            return (false, "Scan timeout or failed");
        }

        private string CalculateSHA256(byte[] file)
        {
            using var sha256 = SHA256.Create();
            return BitConverter.ToString(sha256.ComputeHash(file)).Replace("-", "").ToLowerInvariant();
        }
    }
}
