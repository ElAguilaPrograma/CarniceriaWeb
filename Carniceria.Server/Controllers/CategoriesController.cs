using DataBase_Carniceria;
using DataBase_Carniceria.DTOs.Categories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Carniceria.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly CarniceriaContext _context;

        public CategoriesController(CarniceriaContext context)
        {
            _context = context;
        }

        [HttpGet("showcategories-by-branch/{branchId}")]
        public async Task<IActionResult> ShowCategoriesByBranch(int branchId)
        {
            var categories = await _context.Categories
                .Where(c => c.BranchId == branchId)
                .ToListAsync();

            return Ok(categories);
        }

        [HttpPost("createcategories-by-branch/{branchId}")]
        public async Task<IActionResult> CreateCategoriesByBranch(int branchId, [FromBody] CategoryRequest request)
        {
            try
            {
                var branchExist = await _context.Branches.AnyAsync(b => b.BranchId == branchId);
                if (!branchExist)
                {
                    return BadRequest(new { message = "La sucursal no exite" });
                }

                var newCategory = new Category
                {
                    BranchId = branchId,
                    Name = request.Name
                };

                _context.Categories.Add(newCategory);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Categoria creada con exito",
                    categotyId = newCategory.CategoryId
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al crear la categoria: {ex.Message}");
            }
        }

        [HttpDelete("deletecategory-by-branch/{branchId}/{categoryId}")]
        public async Task<IActionResult> DeleteProducts(int branchId, int categoryId)
        {
            try
            {
                var branchExist = await _context.Branches.AnyAsync(b => b.BranchId == branchId);
                if (!branchExist)
                {
                    return BadRequest(new { message = "La sucursal no existe" });
                }

                var category = await _context.Categories
                    .FirstOrDefaultAsync(c => c.CategoryId == categoryId && c.BranchId == branchId);

                if (category == null)
                {
                    return NotFound("Categoria no encontrada");
                }

                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();

                return Ok("Producto eliminado correctamente");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al borrar la categoria {ex.Message}");
            }
        }
    }
}
