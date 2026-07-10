using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Model
{
    public class Student
    {
        public int Id { get; set; }

        [Required]
        public string StudentName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string RollNumber { get; set; }

        [Required]
        public string Department { get; set; }

        [Required]
        public string PhoneNumber { get; set; }
    }
}
