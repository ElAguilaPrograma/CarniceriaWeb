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
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly CarniceriaContext _context;
        private readonly IProductsService _productsService;

        public SalesController(CarniceriaContext context, IProductsService productsService)
        {
            _context = context;
            _productsService = productsService;
        }

        [HttpGet("showsales-by-branch/{branchId}")]
        public async Task<IActionResult> ShowSales(int branchId)
        {
            try
            {
                var branchExist = await _context.Branches.AnyAsync(b => b.BranchId == branchId);
                if (!branchExist)
                {
                    return NotFound("No se encontro la sucursal");
                }

                var sales = await _context.Sales
                    .Where(s => s.BranchId == branchId)
                    .ToListAsync();

                return Ok(sales);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al mostrar las ventas {ex.Message}");
            }
        }

        [HttpPost("return-product-details-by-id/{branchId}/{productId}")]
        public async Task<IActionResult> ReturnProductsDetails(int branchId, int productId)
        {
            try
            {
                var branchExist = await _context.Branches.AnyAsync(b => b.BranchId == branchId);
                if (!branchExist)
                {
                    return NotFound("No se encontro la sucursal");
                }

                var productExist = await _context.Products.AnyAsync(p => p.ProductId == productId);
                if (!productExist)
                {
                    return NotFound("No se encontro el id del produto: " + productId);
                }

                var productDetails = await _context.Products
                    .Where(p => p.ProductId == productId)
                    .ToListAsync();

                return Ok(productDetails);

            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error al regresar los detalles del producto " +  ex.Message);
            }
        }

        [HttpPost("calculate-total/{productsCostList}")]
        public IActionResult CalculateTotal(List<decimal> productsCostList)
        {
            try
            {
                if (productsCostList.Count == 0)
                {
                    return BadRequest("No hay producta para generar la venta");
                }

                var total = productsCostList.Sum();
                return Ok(total);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "No se pudo calcular el total de los productos " + ex.Message);
            }
        }

        [HttpPost("calculatechange/{total}/{pay}")]
        public IActionResult CalculateChange(decimal total, decimal pay) 
        {
            try
            {
                if (total == 0 || total < 0) return BadRequest("Total no es un numero valido");
                if (pay < 0) return BadRequest("No se puede pagar con valores negativos");
                else if (pay == total) return Ok("No hay cambio, pago exacto");

                var change = pay - total;
                return Ok(change);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "No se pudo procesar el cambio" + ex.Message);
            }
        }

        // Falta poder recibir ver los productos que se vendieron XDD
        [HttpPost("createnewsale-by-branch/{branchid}/{customerId}/{total}")]
        public async Task<IActionResult> CreateSaleByBranch(int branchId, int customerId, decimal total)
        {
            try
            {
                var branchExist = await _context.Branches.AnyAsync(b => b.BranchId == branchId);
                if (!branchExist)
                {
                    return NotFound("No se encontro la sucursal");
                }

                var customerExist = await _context.Customers.AnyAsync(c => c.CustomerId == customerId);
                if (!customerExist)
                {
                    return NotFound("No se encontro al cliente");
                }

                var newSale = new Sale
                {
                    BranchId = branchId,
                    CustomerId = customerId,
                    Date = DateTime.Now,
                    Total = total
                };

                _context.Sales.Add(newSale);
                await _context.SaveChangesAsync();

                return Ok("Venta creada con exito");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "No se pudo generar la venta" + ex.Message);
            }
        }

        [HttpPut("updatesale-by-branch/{branchId}/{saleId}")]
        public async Task<IActionResult> UpdateSale(int branchId, int saleId, [FromBody] SaleRequest request)
        {
            try
            {
                var branchExist = await _context.Branches.AnyAsync(b => b.BranchId == branchId);
                if (!branchExist) return NotFound("No se encontro la sucursal");

                var sale = await _context.Sales
                    .FirstOrDefaultAsync(s => s.SaleId == saleId && s.BranchId == branchId);
                if (sale == null) return NotFound("No se encontro la venta que busca ");

                sale.Total = request.Total;

                _context.Update(sale);
                await _context.SaveChangesAsync();

                return Ok("Venta actualizada con exito");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "No se pudo actualizar la venta " + ex.Message);
            }
        }

        [HttpDelete("deletesale-by-branch/{branchId}/{saleId}")]
        public async Task<IActionResult> DeleteSale(int branchId, int saleId)
        {
            try
            {
                var branchExist = await _context.Branches.AnyAsync(b => b.BranchId == branchId);
                if (!branchExist) return NotFound("No se encontro la sucursal");

                var sale = await _context.Sales
                    .FirstOrDefaultAsync(s => s.SaleId == saleId && s.BranchId == branchId);
                if (sale == null) return NotFound("No se encontro la venta");

                _context.Remove(sale);
                await _context.SaveChangesAsync();
                return Ok("Venta eliminada con exito");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "No se pudo eliminar la venta" + ex.Message);
            }
        }

        [HttpGet("getprice-of-meat/{productId}/{branchId}/{weight}")]
        public async Task<IActionResult> GetPriceOfMeat(int productId, int branchId, decimal weight)
        {
            try
            {
                var branchExist = await _context.Branches.AnyAsync(b => b.BranchId == branchId);
                if (!branchExist)
                {
                    return NotFound("No se encontro la sucursal");
                }

                var productExist = await _context.Products.AnyAsync(p => p.ProductId == productId && p.BranchId == branchId);
                if (!productExist)
                {
                    return NotFound("No se encontro el producto");
                }

                var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductId == productId && p.BranchId == branchId);
                
                var result = _productsService.CalculetePriceMeat(product, weight);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "No se pudo calcular el precio de la carne " + ex.Message);
            }
        }

    }
}
