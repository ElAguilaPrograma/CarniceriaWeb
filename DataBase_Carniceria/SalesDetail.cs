using System;
using System.Collections.Generic;

namespace DataBase_Carniceria;

public partial class SalesDetail
{
    public int DetailId { get; set; }

    public int SaleId { get; set; }

    public int ProductId { get; set; }

    public decimal Amount { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal Subtotal { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual Sale Sale { get; set; } = null!;
}
