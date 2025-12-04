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
    }

    public class ProductsService: IProductsService
    {
        private readonly CarniceriaContext _context;

        public ProductsService(CarniceriaContext context)
        {
            _context = context;
        }

        public Product CalculetePriceMeat(Product product, decimal weight)
        {
            var priceByKg = product.Price;

            var result = (weight * priceByKg)/1;
            product.Price = result;

            return product;
        }

    }
}
