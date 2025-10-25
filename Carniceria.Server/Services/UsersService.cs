using DataBase_Carniceria;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;

namespace Carniceria.Server.Services
{
    public interface IUsersService
    {
        string GetCurrentUserEmail();
        int GetCurrentUserId();
    }

    public class UserService: IUsersService
    {
        private readonly CarniceriaContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserService(CarniceriaContext carniceriaContext, IHttpContextAccessor httpContextAccessor)
        {
            _context = carniceriaContext;
            _httpContextAccessor = httpContextAccessor;
        }

        public int GetCurrentUserId()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            var userIdClaim = user?.FindFirst(ClaimTypes.NameIdentifier) ?? user?.FindFirst(JwtRegisteredClaimNames.Sub);

            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out var userId))
            {
                return userId;
            }

            throw new UnauthorizedAccessException("Usuario no autenticado");
        }

        public string GetCurrentUserEmail()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            return user?.FindFirst(ClaimTypes.Email)?.Value ??
                user?.FindFirst(JwtRegisteredClaimNames.Email)?.Value;
        }
    }
}
