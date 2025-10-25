using Carniceria.Server.Services;
using DataBase_Carniceria;
using DataBase_Carniceria.DTOs.Branches;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Carniceria.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BranchesController : ControllerBase
    {
        private readonly CarniceriaContext _context;
        private readonly IConfiguration _configuration;
        private readonly IUsersService _usersService;

        public BranchesController(CarniceriaContext context, IConfiguration configuration, IUsersService usersService)
        {
            _context = context;
            _configuration = configuration;
            _usersService = usersService;
        }

        [HttpGet("showbranches")]
        public async Task<IActionResult> ShowBranches()
        {
            try
            {
                var userId = _usersService.GetCurrentUserId();

                var branches = await _context.Branches
                    .Where(b => b.UserId == userId) // Solo las sucursales del usuario
                    .ToListAsync();

                return Ok(branches);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener las sucursales: {ex.Message}");
            } 
        }

        [HttpPost("createbranches")]
        public async Task<IActionResult> CreateBranches([FromBody] BranchRequest request)
        {
            try
            {
                var userId = _usersService.GetCurrentUserId();
                Console.WriteLine($"User obtenido del token: {userId}");

                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
                if (user == null)
                {
                    return Unauthorized(new { message = "Usuario no encontrado o no autorizado"});
                }

                var branch = new Branch
                {
                    Name = request.Name,
                    Address = request.Address,
                    Phone = request.Phone,
                    UserId = userId,
                };

                _context.Branches.Add(branch);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Sucursal creada con exito",
                    branchId = branch.BranchId
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al crear la tarea: {ex.Message}");
            }
        }

        [HttpPut("updatebranch/{branchId}")]
        public async Task<IActionResult> UpdateBranch(int branchId, [FromBody] BranchUpdateRequest request)
        {
            try
            {
                var userId = _usersService.GetCurrentUserId();

                var branch = await _context.Branches.FirstOrDefaultAsync(b => b.BranchId == branchId && b.UserId == userId);

                if (branch == null)
                {
                    return NotFound("Tarea no encontrada");
                }

                branch.Name = request.Name;
                branch.Address = request.Address;
                branch.Phone = request.Phone;

                _context.Update(branch);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Tarea actualizada con exito",
                    branchId = branch.BranchId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Errror al actualizar la tarea: {ex.Message}");
            }
        }

        [HttpDelete("deletebranch/{branchId}")]
        public async Task<IActionResult> DeleteBranch(int branchId)
        {
            try
            {
                var userId = _usersService.GetCurrentUserId();

                var branch = await _context.Branches.FirstOrDefaultAsync(b => b.BranchId == branchId && b.UserId == userId);

                if (branch == null)
                {
                    return NotFound(new
                    {
                        message = "Sucursal no encontrada"
                    });
                }

                _context.Branches.Remove(branch);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Sucursal eliminada correctamente"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al eliminar la sucursal {ex.Message}");
            }
        }
    }
}
