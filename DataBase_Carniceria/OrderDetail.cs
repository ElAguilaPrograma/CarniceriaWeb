using System;
using System.Collections.Generic;

namespace DataBase_Carniceria;

public partial class OrderDetail
{
    public int OrderDetailId { get; set; }

    public int OrderId { get; set; }

    public int ProductId { get; set; }

    public decimal WeightOrQuantity { get; set; }

    public decimal Price { get; set; }

    public decimal? Subtotal { get; set; }

    public virtual Order Order { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
