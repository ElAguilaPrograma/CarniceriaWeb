using DataBase_Carniceria;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Carniceria.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MeasurementUnitController : ControllerBase
    {
        private readonly CarniceriaContext _context;
        public MeasurementUnitController(CarniceriaContext context)
        {
            _context = context;
        }

        [HttpGet("showmeasurementunit-by-branch/{branchId}")]
        public async Task<IActionResult> ShowMeasurementUnit(int branchId)
        {
            var measutementUnits = await _context.MeasurementUnits.ToListAsync();

            return Ok(measutementUnits);
        }
    }
}
