using Carniceria.Server.Services;
using DataBase_Carniceria;
using DataBase_Carniceria.DTOs.Products;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore;

namespace Carniceria.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly CarniceriaContext _context;
        private readonly IUsersService _usersService;
        private readonly IProductsService _productsService;

        public ProductsController(CarniceriaContext context, IUsersService usersService, IProductsService productsService)
        {
            _context = context;
            _usersService = usersService;
            _productsService = productsService;
        }

        [HttpGet("products-by-branch/{branchId}")]
        public async Task<IActionResult> GetProductsByBranch(int branchId)
        {
            var products = await _context.Products
                .Where(p => p.BranchId == branchId)
                .ToListAsync();

            return Ok(products);
        }

        [HttpPost("createproducts-by-branch/{branchId}")]
        public async Task<IActionResult> CreateProductsByBranch(int branchId, [FromBody] NewProductRequest request)
        {
            try
            {
                // Verificar que la sucursal exista
                var branchExists = await _context.Branches.AnyAsync(b => b.BranchId == branchId);
                if (!branchExists)
                {
                    return BadRequest(new { message = "La sucursal no existe" });
                }

                //Crear un nuevo producto
                var newProduct = new Product
                {
                    Code = _productsService.GenerateRandomCode().ToString(),
                    Name = request.Name,
                    Price = request.Price,
                    Stock = request.Stock,
                    CategoryId = request.CategoryId,
                    UnitId = request.UnitId,
                    BranchId = branchId,
                    Active = request.Active
                };

                _context.Add(newProduct);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Productos añadidos con exito",
                    productId = newProduct.ProductId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al crear el producto {ex.Message}");
            }
        }

        [HttpPut("updateproducts-by-branch/{branchId}/{productId}")]
        public async Task<IActionResult> UpdateProducts(int branchId, int productId, [FromBody] UpdateProductsRequest request)
        {
            try
            {
                var branchExists = await _context.Branches.AnyAsync(b => b.BranchId == branchId);
                if (!branchExists)
                {
                    return BadRequest(new { message = "La sucursal no existe" });
                }

                var product = await _context.Products
                    .FirstOrDefaultAsync(p => p.ProductId == productId && p.BranchId == branchId);

                if (product == null)
                {
                    return NotFound("Producto no encontrado");
                }

                //Actualizar información
                product.Code = request.Code;
                product.Name = request.Name;
                product.Price = request.Price;
                product.Stock = request.Stock;
                product.CategoryId = request.CategoryId;
                product.UnitId = request.UnitId;
                product.Active = request.Active;

                _context.Update(product);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Producto actualizado con exito",
                    productId = product.ProductId
                }); 

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al actualizar el producyo {ex.Message}");
            }
        }

        [HttpDelete("deleteproduct-by-branch/{branchId}/{productId}")]
        public async Task<IActionResult> DeleteProducts(int branchId, int productId)
        {
            try
            {
                var branchExists = await _context.Branches.AnyAsync(b => b.BranchId == branchId);
                if (!branchExists)
                {
                    return BadRequest(new { message = "La sucursal no existe" });
                }

                var product = await _context.Products
                    .FirstOrDefaultAsync(p => p.ProductId == productId && p.BranchId == branchId);

                if (product == null)
                {
                    return NotFound("Producto no encontrado");
                }

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Producto eliminado con exito" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al borrar el producto {ex.Message}");
            }
        }
    }
}
