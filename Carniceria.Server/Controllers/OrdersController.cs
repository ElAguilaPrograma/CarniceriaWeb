using Carniceria.Server.Services;
using DataBase_Carniceria;
using DataBase_Carniceria.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Carniceria.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly CarniceriaContext _context;
        private readonly IUsersService _usersService;
        public OrdersController(CarniceriaContext context, IUsersService usersService)
        {
            _context = context;
            _usersService = usersService;
        }

        [HttpPost("createorder/{branchId}")]
        public async Task<IActionResult> CreateOrder([FromBody] OrdersRequest ordersRequest, int branchId)
        {
            try
            {
                var branchExist = await _context.Branches.AnyAsync(b => b.BranchId == branchId);
                if (!branchExist) return NotFound("Sucursal no encontrada");

                if (ordersRequest.Details == null || !ordersRequest.Details.Any())
                    return BadRequest("La orden debe tener al menos un producto");

                var userId = _usersService.GetCurrentUserId();

                var order = new Order
                {
                    BranchId = branchId,
                    UserId = userId,
                    Name = ordersRequest.Name,
                    RegistrationDate = DateTime.UtcNow,
                    IsComplete = false,
                    OrderDetails = new List<OrderDetail>()
                };

                foreach (var item in ordersRequest.Details)
                {
                    var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductId == item.ProductId);

                    if (product == null) return NotFound($"Producto con ID {item.ProductId} no encontrado");

                    var detail = new OrderDetail
                    {
                        ProductId = product.ProductId,
                        WeightOrQuantity = item.WeightOrQuantity,
                        Price = product.Price
                        // Sub total se calcula en SQL como columna calculda price * weightOrQuantity
                    };

                    order.OrderDetails.Add(detail);
                }

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Orden creada correctamente",
                    OrderId = order.OrderId,
                    Total = order.OrderDetails.Sum(d => d.Price * d.WeightOrQuantity)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al crear la orden: {ex.Message}");
            }
        }

        [HttpGet("get-orders-with-details/{branchId}")]
        public async Task<IActionResult> GetOrdersWithDetails(int branchId)
        {
            try
            {
                var branchExists = await _context.Branches.AnyAsync(b => b.BranchId == branchId);
                if (!branchExists)
                    return NotFound("Sucursal no encontrada.");

                var orders = await _context.Orders
                    .Where(o => o.BranchId == branchId && o.IsComplete == false)
                    .Include(o => o.OrderDetails)
                        .ThenInclude(d => d.Product)
                    .Select(o => new
                    {
                        o.OrderId,
                        o.Name,
                        o.RegistrationDate,
                        o.IsComplete,
                        Total = o.OrderDetails.Sum(d => d.Price * d.WeightOrQuantity),

                        Details = o.OrderDetails.Select(d => new
                        {
                            d.OrderDetailId,
                            d.ProductId,
                            ProductName = d.Product.Name,
                            UnitPrice = d.Price,
                            d.WeightOrQuantity,
                            Subtotal = d.Price * d.WeightOrQuantity
                        })
                    })
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener órdenes: {ex.Message}");
            }
        }

        [HttpPut("complete-order/{orderId}")]
        public async Task<IActionResult> CompleteOrder(int orderId)
        {
            try
            {
                var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId);
                if (order == null)
                    return NotFound("Orden no encontrada");

                order.IsComplete = true;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Orden completada correctamente",
                    order.OrderId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al completar la orden: {ex.Message}");
            }
        }

    }
}
