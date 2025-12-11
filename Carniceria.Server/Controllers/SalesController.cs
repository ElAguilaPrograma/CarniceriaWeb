using Carniceria.Server.Services;
using DataBase_Carniceria;
using DataBase_Carniceria.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using System.IdentityModel.Tokens.Jwt;

namespace Carniceria.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly CarniceriaContext _context;
        private readonly IProductsService _productsService;
        private readonly IUsersService _usersService;

        public SalesController(CarniceriaContext context, IProductsService productsService, IUsersService usersService)
        {
            _context = context;
            _productsService = productsService;
            _usersService = usersService;
        }

        [HttpPost("createsale/{branchId}")]
        public async Task<IActionResult> CreateSale(int branchId, [FromBody] SaleRequest saleRequest)
        {
            try
            {
                var branchExist = await _context.Branches.AnyAsync(b => b.BranchId == branchId);
                if (!branchExist) return NotFound("No se encontro la sucursal");

                if (saleRequest.SaleDetails == null || !saleRequest.SaleDetails.Any())
                    return BadRequest("La venta debe tener al menos un producto");

                var userId = _usersService.GetCurrentUserId();

                var sale = new Sale
                {
                    BranchId = branchId,
                    UserId = userId,
                    Date = DateTime.UtcNow,
                    IsComplete = false,
                    SaleDetails = new List<SaleDetail>()
                };

                foreach (var item in saleRequest.SaleDetails)
                {
                    var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductId == item.ProductId);

                    if (product == null) return NotFound($"Producto con ID: {item.ProductId} no encontrado");

                    var saleDetail = new SaleDetail();

                    if (item.OrderId != null)
                    {
                        saleDetail.OrderId = item.OrderId;
                    }
                    else
                    {
                        saleDetail.OrderId = null;
                    }

                        saleDetail = new SaleDetail
                        {
                            ProductId = product.ProductId,
                            Price = product.Price,
                            WeightOrQuantity = item.WeightOrQuantity,
                            Total = item.WeightOrQuantity * product.Price
                        };

                    sale.SaleDetails.Add(saleDetail);
                }

                sale.IsComplete = true;

                _context.Sales.Add(sale);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Venta creada correctamente",
                    sale.SaleId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al crear la orden: {ex.Message}");
            }
        }

        [HttpGet("get-sales-with-details/{branchId}")]
        public async Task<IActionResult> GetSalesWithDetails(int branchId)
        {
            try
            {
                var branchExist = await _context.Branches.AnyAsync(b => b.BranchId == branchId);
                if (!branchExist)
                    return NotFound("No se encontro la sucursal");

                var sales = await _context.Sales
                    .Where(s => s.BranchId == branchId)
                    .Include(s => s.SaleDetails)
                        .ThenInclude(d => d.Product)
                    .Select(s => new
                    {
                        saleId = s.SaleId,
                        branchId = branchId,
                        userId = s.UserId,
                        date = s.Date,
                        isComplete = s.IsComplete,
                        totalSale = s.SaleDetails.Sum(d => d.Total),
                        itemsCount = s.SaleDetails.Count,
                        details = s.SaleDetails.Select(d => new
                        {
                            saleDetailId = d.SaleDetailsId,
                            productId = d.ProductId,
                            productCode = d.Product.Code,
                            productName = d.Product.Name,
                            categoryName = d.Product.Category.Name,
                            unitName = d.Product.Unit.Name,
                            price = d.Price,
                            orderId = d.OrderId,
                            total = d.Total
                        }).ToList()
                    })
                    .ToListAsync();

                return Ok(new
                {
                    Message = "Ventas recuperadas exitosamente",
                    count = sales.Count,
                    data = sales
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al recuperar las ventas");
            }
        }
        

    }
}
