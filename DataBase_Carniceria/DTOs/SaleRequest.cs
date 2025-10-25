using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataBase_Carniceria.DTOs
{
    public class SaleRequest
    {
        public DateTime Date { get; set; } = DateTime.Now;
        public decimal Total { get; set; }
    }
}
