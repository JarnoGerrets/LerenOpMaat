namespace LOM.API.Services.Interfaces
{
    public interface IVirusScanner
    {
       Task<(bool isSafe, string? virusName)> ScanFileAsync(byte[] fileBytes, string fileName);
    }
}
