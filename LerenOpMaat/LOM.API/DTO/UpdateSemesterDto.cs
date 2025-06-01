using LOM.API.Models;

public class UpdateSemestersDto
{
    public int UserId { get; set; }
    public List<Semester> Semesters { get; set; }
}