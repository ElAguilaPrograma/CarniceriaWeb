using DataBase_Carniceria;
using DataBase_Carniceria.DTOs.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Carniceria.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly CarniceriaContext _context;
        private readonly IConfiguration _config;
        private readonly IPasswordHasher<User> _passwordHasher;

        public AuthenticationController(CarniceriaContext carniceriaContext, IConfiguration configuration, IPasswordHasher<User> passwordHasher)
        {
            _context = carniceriaContext;
            _config = configuration;
            _passwordHasher = passwordHasher;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email)){
                return BadRequest("El email ya esta registrado");
            }

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                Password = request.Password
            };

            //Hashear la contraseña
            user.Password = _passwordHasher.HashPassword(user, request.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Success = true,
                Message = "Usuario creado con exito",
                user.UserId
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
            {
                return Unauthorized(new
                {
                    message = "Email o contraseña incorrectos"
                });
            }

            var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.Password, request.Password);

            if (verificationResult != PasswordVerificationResult.Success)
            {
                return Unauthorized(new
                {
                    message = "Contraseña incorrecta"
                });
            }

            var token = GenereteJwtToken(user);

            return Ok( new {
                Success = true,
                token
            });
        }

        //Generar el JWT
        private string GenereteJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                //Los roles se manejan aqui yisus del futuro
                new Claim("role", "user")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                //Aqui se maneja el tiempo de expiracion del token
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
