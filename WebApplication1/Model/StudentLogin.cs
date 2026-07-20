using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Model
{
    public class StudentLogin
    {
        public int Id { get; set; }

        public int StudentId { get; set; }
    
        [Required]
        public string StudentName { get; set; }
        
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        public bool IsFirstLogin { get; set; } = true;
    }
}