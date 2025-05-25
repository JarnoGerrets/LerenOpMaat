namespace LOM.API.Validator.ValidationResults
{
    public class ValidationResult : IValidationResult
    {
        public bool IsValid { get; set; }
        public string Message { get; set; }
        public int? ViolatingModuleId { get; set; }

        public ValidationResult(bool isValid, string message, int? violatingModuleId = null)
        {
            IsValid = isValid;
            Message = message;
            ViolatingModuleId = violatingModuleId;
        }
    }
}
