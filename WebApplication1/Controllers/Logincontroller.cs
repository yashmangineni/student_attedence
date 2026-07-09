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

        [HttpPost("signin")]
        public async Task<IActionResult> SignIn([FromBody] LoginRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { message = "Email and password are required." });
            }

            var user = await AppCon.logins.FirstOrDefaultAsync(u => u.email == request.Email);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            // Verify password
            bool isValid = PasswordHelper.VerifyPassword(request.Password, user.password);
            if (!isValid)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            return Ok(new { 
                message = "Login successful!", 
                user = new { id = user.Id, name = user.name, email = user.email } 
            });
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
