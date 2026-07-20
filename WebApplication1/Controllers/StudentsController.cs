using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Model;
using WebApplication1.Helpers;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentsController : ControllerBase
    {
        private readonly Appcontext _context;

        public StudentsController(Appcontext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
            return await _context.Students.ToListAsync();
        }

        // [HttpPost]
        // public async Task<ActionResult<Student>> PostStudent(Student student)
        // {
        //     if (!ModelState.IsValid)
        //     {
        //         return BadRequest(ModelState);
        //     }

        //     var sameRoll = await _context.Students.AnyAsync(s => s.RollNumber == student.RollNumber);
        //     if (sameRoll)
        //     {
        //         return Conflict(new { message = "A student with this roll number already exists." });
        //     }

        //     var sameName = await _context.Students.AnyAsync(s => s.StudentName == student.StudentName && s.RollNumber == student.RollNumber);
        //     if (sameName)
        //     {
        //         return Conflict(new { message = "A student with the same name and roll number already exists." });
        //     }

        //     _context.Students.Add(student);
        //     await _context.SaveChangesAsync();

        //     return CreatedAtAction(nameof(GetStudents), new { id = student.Id }, student);
        // }

        [HttpPost]
public async Task<IActionResult> PostStudent(Student student)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    var sameRoll = await _context.Students
        .AnyAsync(s => s.RollNumber == student.RollNumber);

    if (sameRoll)
    {
        return Conflict(new
        {
            message = "A student with this roll number already exists."
        });
    }

    _context.Students.Add(student);
    await _context.SaveChangesAsync();

    // Generate Username
    string baseName = student.StudentName
        .Replace(" ", "")
        .ToLower();

    int count = await _context.StudentLogins
        .CountAsync(x => x.Username.StartsWith(baseName));

    string username = $"{baseName}{count + 1:D2}";

    // Temporary Password
    string tempPassword = "Welcome@123";

    StudentLogin login = new StudentLogin
    {
        StudentId = student.Id,
        StudentName = student.StudentName,
        Username = username,
        Password = PasswordHelper.HashPassword(tempPassword),
        IsFirstLogin = true
    };

    _context.StudentLogins.Add(login);

    await _context.SaveChangesAsync();

    return Ok(new
    {
        message = "Student Registered Successfully!",
        username = username,
        password = tempPassword
    });
}
        // GET: single student details[view]
        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            return student == null ? NotFound(new { message = "Student not found." }) : student;
        }

        // GET: student details by username
        [HttpGet("by-username/{username}")]
        public async Task<IActionResult> GetStudentByUsername(string username)
        {
            var login = await _context.StudentLogins
                .FirstOrDefaultAsync(x => x.Username == username);

            if (login == null)
            {
                return NotFound(new { message = "Student not found." });
            }

            var student = await _context.Students.FindAsync(login.StudentId);
            if (student == null)
            {
                return NotFound(new { message = "Student not found." });
            }

            return Ok(new
            {
                student,
                username = login.Username,
                firstLogin = login.IsFirstLogin
            });
        }

        //update student details[edit]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, Student student)
        {
            
            if (id != student.Id)
            {
                return BadRequest(new
                {
                    message = "Student Id mismatch."
                });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingStudent = await _context.Students.FindAsync(id);

            if (existingStudent == null)
            {
                return NotFound(new
                {
                    message = "Student not found."
                });
            }

            // Check if another student already has the same Roll Number
            bool rollExists = await _context.Students.AnyAsync(s =>
                s.RollNumber == student.RollNumber &&
                s.Id != id);

            if (rollExists)
            {
                return Conflict(new
                {
                    message = "Another student already has this roll number."
                });
            }

            existingStudent.StudentName = student.StudentName;
            existingStudent.Email = student.Email;
            existingStudent.RollNumber = student.RollNumber;
            existingStudent.Department = student.Department;
            existingStudent.PhoneNumber = student.PhoneNumber;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Student updated successfully."
            });
        }

        //delete student[delete]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound(new
                {
                    message = "Student not found."
                });
            }

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Student deleted successfully."
            });
        }
    }
}