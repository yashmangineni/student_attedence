using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Model;
using WebApplication1.Helpers;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("Logincontroller")]
    public class Logincontroller : ControllerBase
    {
        private readonly Appcontext AppCon;

        public Logincontroller(Appcontext app)
        {
            AppCon = app;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] login model)
        {
            if (model == null)
            {
                return BadRequest(new { message = "Request body cannot be null." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (model.password != model.cpassword)
            {
                return BadRequest(new { message = "Passwords do not match." });
            }

            // Check if email already exists
            var existingUser = await AppCon.logins.FirstOrDefaultAsync(u => u.email == model.email);
            if (existingUser != null)
            {
                return BadRequest(new { message = "Email is already registered." });
            }

            // Hash the password
            string hashedPassword = PasswordHelper.HashPassword(model.password);

            var newUser = new login
            {
                name = model.name,
                email = model.email,
                password = hashedPassword
            };

            AppCon.logins.Add(newUser);
            await AppCon.SaveChangesAsync();

            return Ok(new { message = "Registration successful!" });
        }

    //     [HttpPost("signin")]
    //     public async Task<IActionResult> SignIn([FromBody] LoginRequest request)
    //     {
    //         if (request == null || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
    //         {
    //             return BadRequest(new { message = "Email and password are required." });
    //         }

    //         var user = await AppCon.logins.FirstOrDefaultAsync(u => u.email == request.Email);
    //         if (user == null)
    //         {
    //             return Unauthorized(new { message = "Invalid email or password." });
    //         }

    //         // Verify password
    //         bool isValid = PasswordHelper.VerifyPassword(request.Password, user.password);
    //         if (!isValid)
    //         {
    //             return Unauthorized(new { message = "Invalid email or password." });
    //         }

    //         return Ok(new { 
    //             message = "Login successful!", 
    //             user = new { id = user.Id, name = user.name, email = user.email } 
    //         });
    //     }
    // }
    [HttpPost("signin")]
public async Task<IActionResult> SignIn([FromBody] LoginRequest request)
{
    if (request == null ||
        string.IsNullOrWhiteSpace(request.UserNameOrEmail) ||
        string.IsNullOrWhiteSpace(request.Password))
    {
        return BadRequest(new
        {
            message = "Username/Email and Password are required."
        });
    }

    // ===========================
    // Teacher Login
    // ===========================
    var normalizedInput = request.UserNameOrEmail.ToLower();
    var teacher = await AppCon.logins
        .FirstOrDefaultAsync(x => x.email.ToLower() == normalizedInput || x.name.ToLower() == normalizedInput);

    if (teacher != null)
    {
        bool isTeacherPasswordValid =
            PasswordHelper.VerifyPassword(request.Password, teacher.password);

        if (!isTeacherPasswordValid)
        {
            return Unauthorized(new
            {
                message = "Invalid password."
            });
        }

        return Ok(new
        {
            role = "Teacher",
            message = "Teacher Login Successful",
            user = new
            {
                id = teacher.Id,
                name = teacher.name,
                email = teacher.email
            }
        });
    }

    // ===========================
    // Student Login
    // ===========================
    var student = await AppCon.StudentLogins
        .FirstOrDefaultAsync(x => x.Username == request.UserNameOrEmail);

    if (student != null)
    {
        bool isStudentPasswordValid =
            PasswordHelper.VerifyPassword(request.Password, student.Password);

        if (!isStudentPasswordValid)
        {
            return Unauthorized(new
            {
                message = "Invalid password."
            });
        }

        return Ok(new
        {
            role = "Student",
            message = "Student Login Successful",
            user = new
            {
                studentId = student.StudentId,
                studentName = student.StudentName,
                username = student.Username
            },
            firstLogin = student.IsFirstLogin
        });
    }

    return Unauthorized(new
    {
        message = "Invalid Username/Email or Password."
    });
}
    }

    public class LoginRequest
{
    public string UserNameOrEmail { get; set; }
    public string Password { get; set; }
}
}
