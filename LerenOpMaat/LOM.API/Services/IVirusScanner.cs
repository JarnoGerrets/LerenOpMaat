namespace LOM.API.Services
{
    public interface IVirusScanner
    {
       Task<(bool isSafe, string? virusName)> ScanFileAsync(byte[] fileBytes, string fileName);
    }
}
