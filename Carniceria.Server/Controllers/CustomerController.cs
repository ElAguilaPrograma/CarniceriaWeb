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
    public class CustomerController : ControllerBase
    {
        private readonly CarniceriaContext _context;

        public CustomerController(CarniceriaContext context)
        {
            _context = context;
        }

        [HttpGet("annonimus-customer/{branchId}")]
        public async Task<IActionResult> AnnonimusCustomer(int branchId)
        {
            try
            {
                var branchExist = await _context.Branches.AnyAsync(b => b.BranchId == branchId);

                if (!branchExist)
                {
                    return BadRequest("La sucursal no existe");
                }

                var annonimus = await _context.Customers
                    .FirstOrDefaultAsync(c => c.Name == "Annonimus" && c.BranchId == branchId);

                if (annonimus == null)
                {
                    var newAnnonimus = new Customer
                    {
                        BranchId = branchId,
                        Name = "Annonimus",
                        Phone = "No Phone",
                        Address = "No Address"
                    };

                    _context.Customers.Add(newAnnonimus);
                    await _context.SaveChangesAsync();

                    return Ok(newAnnonimus);
                }

                return Ok(annonimus);

            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error al recuperar al cliente anonimo " + ex.Message);
            }
        }

        [HttpGet("showcustomers-by-branch/{branchId}")]
        public async Task<IActionResult> ShowCustomers(int branchId)
        {
            try
            {
                var branchExist = await _context.Branches.AnyAsync(b => b.BranchId == branchId);
                if (!branchExist)
                {
                    return NotFound("No se encontro la sucursal");
                }

                var customers = await _context.Customers
                    .Where(c => c.BranchId == branchId)
                    .ToListAsync();

                return Ok(customers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "No se pudo mostrar la lista de clieentas" + ex.Message);
            }
        }

        [HttpPost("createcustomer-by-branch/{branchId}")]
        public async Task<IActionResult> CreateCustomer(int branchId, [FromBody] CustomerRequest request)
        {
            try
            {
                var branchExist = await _context.Branches.AnyAsync(b => b.BranchId == branchId);
                if (!branchExist)
                {
                    return NotFound("No se encontro la sucursal");
                }

                var newCustomer = new Customer
                {
                    BranchId = branchId,
                    Name = request.Name,
                    Phone = request.Phone,
                    Address = request.Address,
                };

                _context.Customers.Add(newCustomer);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Cliente creado con exito", customerId = newCustomer.CustomerId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error al crear al cliente " + ex.Message);
            }
        }

        [HttpPut("updatecustomer-by-branch/{branchId}/{customerId}")]
        public async Task<IActionResult> UpdateCustomer (int branchId, int customerId, [FromBody] CustomerRequest request)
        {
            try
            {
                var branchExist = await _context.Branches.AnyAsync(b => b.BranchId == branchId);
                if (!branchExist)
                {
                    return NotFound("No se encontro la sucursal");
                }

                var customer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.BranchId == branchId && c.CustomerId == customerId);

                if (customer == null)
                {
                    return NotFound("No se encontro el cliente");
                }

                customer.Name = request.Name;
                customer.Phone = request.Phone;
                customer.Address = request.Address;
                customer.BranchId = branchId;

                _context.Update(customer);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Cliente actualizado con exito",
                    customerId = customer.CustomerId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"No se pudo actualizar el cliente {ex.Message}");
            }
        }

        [HttpDelete("deletecustomer-by-branch/{branchId}/{customerId}")]
        public async Task<IActionResult> DeleteCustomer(int branchId, int customerId)
        {
            try
            {
                var branchExist = await _context.Branches.AnyAsync(b => b.BranchId == branchId);
                if (!branchExist)
                {
                    return NotFound("No se encontro la sucursal");
                }

                var customer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.BranchId == branchId && c.CustomerId == customerId);

                if (customer == null)
                {
                    return NotFound("No se encontro el cliente");
                }

                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();

                return Ok("Cliente borrado con exito");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"No se pudo borrar la tarea {ex.Message}");
            }
        }
    }
}
