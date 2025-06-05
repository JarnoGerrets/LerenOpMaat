using VirusTotalNet;
using System.Security.Cryptography;
using VirusTotalNet.ResponseCodes;

namespace LOM.API.Services
{
    public class VirusScanner : IVirusScanner
    {
        private readonly VirusTotal _virusTotal;

        public VirusScanner(IConfiguration config)
        {
            var apiKey = config["VirusTotal:ApiKey"];

            if (string.IsNullOrWhiteSpace(apiKey) || apiKey.Length < 64)
            {
                throw new InvalidOperationException("VirusTotal API key ontbreekt of is ongeldig.");
            }

            _virusTotal = new VirusTotal(apiKey);
        }

        public async Task<(bool isSafe, string? virusName)> ScanFileAsync(byte[] fileBytes, string fileName)
        {
            try
            {
                var scanResult = await _virusTotal.ScanFileAsync(new MemoryStream(fileBytes), fileName);

                var report = await _virusTotal.GetFileReportAsync(scanResult.SHA256);

                if (report.ResponseCode == FileReportResponseCode.Present)
                {
                    bool isSafe = report.Positives == 0;
                    return (isSafe, isSafe ? null : "Threat found in single report check");
                }

                return (true, "No verdict yet (not present in VT database)");
            }
            catch (Exception ex)
            {
                return (false, $"Virus scan error: {ex.Message}");
            }
        }


        private string CalculateSHA256(byte[] file)
        {
            using var sha256 = SHA256.Create();
            return BitConverter.ToString(sha256.ComputeHash(file)).Replace("-", "").ToLowerInvariant();
        }
    }
}
