using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataBase_Carniceria.DTOs
{
    public class OrdersRequest
    {
        public int BranchId { get; set; }
        public string Name { get; set; } = "";
        public List<OrderDetailDto> Details { get; set; } = new();
    }

    public class OrderDetailDto
    {
        public int ProductId { get; set; }
        public decimal WeightOrQuantity { get; set; }
    }
}
