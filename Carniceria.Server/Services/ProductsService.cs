using DataBase_Carniceria;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Carniceria.Server.Services
{

    public interface IProductsService
    {
        int GenerateRandomCode();
    }

    public class ProductsService: IProductsService
    {
        private readonly CarniceriaContext _context;

        public ProductsService(CarniceriaContext context)
        {
            _context = context;
        }

        public int GenerateRandomCode()
        {
            Random random = new Random();

            int code = random.Next(1000, 10000);

            return code;
        }

    }
}
