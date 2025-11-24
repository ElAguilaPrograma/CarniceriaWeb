using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataBase_Carniceria.DTOs.Products
{
    public class NewProductRequest
    {
        public string Name { get; set; } = null!;
        public decimal Price { get; set; } 
        public decimal Stock { get; set; }
        public string Code { get; set; } = null!;
        public int CategoryId { get; set; }
        public int UnitId { get; set; }
        public bool Active { get; set; }

    }
}
