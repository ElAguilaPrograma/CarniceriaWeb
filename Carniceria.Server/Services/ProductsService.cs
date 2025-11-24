using DataBase_Carniceria;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using System.Threading.Tasks;

namespace Carniceria.Server.Services
{

    public interface IProductsService
    {
        Product CalculetePriceMeat(Product product, decimal weight);
        string GenerateRandomCode();
    }

    public class ProductsService: IProductsService
    {
        private readonly CarniceriaContext _context;

        public ProductsService(CarniceriaContext context)
        {
            _context = context;
        }

        public string GenerateRandomCode()
        {
            Random random = new Random();

            int code = random.Next(1000, 10000);
            string codeStr = code.ToString();
            return codeStr;
        }

        public Product CalculetePriceMeat(Product product, decimal weight)
        {
            var priceByKg = product.Price;

            var result = (weight * priceByKg)/1;
            var newCode = GenerateRandomCode();
            product.Price = result;
            product.Code = newCode;
            return product;
        }

    }
}
