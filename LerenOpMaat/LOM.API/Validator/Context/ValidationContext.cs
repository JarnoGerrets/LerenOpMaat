using LOM.API.Models;

public class ValidationContext
{
    public int UserId { get; }
    public List<ModuleProgress> ModuleProgresses { get; }
    public Dictionary<int, Module> Modules { get; }
    
    public ValidationContext(int userId, List<ModuleProgress> progresses, Dictionary<int, Module> modules)
    {
        UserId = userId;
        ModuleProgresses = progresses;
        Modules = modules;
    }
}