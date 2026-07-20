using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Model;
using WebApplication1.Helpers;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentLoginController : ControllerBase
    {
        private readonly Appcontext _context;

        public StudentLoginController(Appcontext context)
        {
            _context = context;
        }

        // Student Login
        [HttpPost("signin")]
        public async Task<IActionResult> SignIn([FromBody] StudentLoginRequest request)
        {
            if (request == null ||
                string.IsNullOrWhiteSpace(request.Username) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new
                {
                    message = "Username and Password are required."
                });
            }

            var user = await _context.StudentLogins
                .FirstOrDefaultAsync(x => x.Username == request.Username);

            if (user == null)
            {
                return Unauthorized(new
                {
                    message = "Invalid Username"
                });
            }

            bool isValid = PasswordHelper.VerifyPassword(request.Password, user.Password);

            if (!isValid)
            {
                return Unauthorized(new
                {
                    message = "Invalid Password"
                });
            }

            return Ok(new
            {
                message = "Login Successful",
                username = user.Username,
                studentName = user.StudentName,
                firstLogin = user.IsFirstLogin
            });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Username))
            {
                return BadRequest(new
                {
                    message = "Username is required."
                });
            }

            var user = await _context.StudentLogins
                .FirstOrDefaultAsync(x => x.Username == request.Username);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "Student not found."
                });
            }

            string temporaryPassword = "Welcome@123";
            user.Password = PasswordHelper.HashPassword(temporaryPassword);
            user.IsFirstLogin = true;
            _context.StudentLogins.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Temporary password has been set.",
                temporaryPassword
            });
        }

        // Change Password
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            if (request == null ||
                string.IsNullOrWhiteSpace(request.Username) ||
                string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return BadRequest(new
                {
                    message = "Username and New Password are required."
                });
            }

            var user = await _context.StudentLogins
                .FirstOrDefaultAsync(x => x.Username == request.Username);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "Student not found."
                });
            }

            user.Password = PasswordHelper.HashPassword(request.NewPassword);
            user.IsFirstLogin = false;

            _context.StudentLogins.Update(user);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Password Changed Successfully"
            });
        }
    }

    // Login Request DTO
    public class StudentLoginRequest
    {
        public string Username { get; set; }

        public string Password { get; set; }
    }

    // Forgot Password DTO
    public class ForgotPasswordRequest
    {
        public string Username { get; set; }
    }

    // Change Password DTO
    public class ChangePasswordRequest
    {
        public string Username { get; set; }

        public string NewPassword { get; set; }
    }
}