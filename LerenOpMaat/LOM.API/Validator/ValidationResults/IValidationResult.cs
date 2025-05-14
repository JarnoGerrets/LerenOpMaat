namespace LOM.API.Validator.ValidationResults
{
    public interface IValidationResult
    {
        bool IsValid { get; set; }
        string Message { get; set; }
        int? ViolatingModuleId {get; set; }
    }
}
