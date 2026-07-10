using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Model;

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

        [HttpPost]
        public async Task<ActionResult<Student>> PostStudent(Student student)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var sameRoll = await _context.Students.AnyAsync(s => s.RollNumber == student.RollNumber);
            if (sameRoll)
            {
                return Conflict(new { message = "A student with this roll number already exists." });
            }

            var sameName = await _context.Students.AnyAsync(s => s.StudentName == student.StudentName && s.RollNumber == student.RollNumber);
            if (sameName)
            {
                return Conflict(new { message = "A student with the same name and roll number already exists." });
            }

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStudents), new { id = student.Id }, student);
        }
    }
}
