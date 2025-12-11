using System;
using System.Collections.Generic;

namespace DataBase_Carniceria;

public partial class SaleDetail
{
    public int SaleDetailsId { get; set; }

    public int SaleId { get; set; }

    public int ProductId { get; set; }

    public int? OrderId { get; set; }

    public decimal Total { get; set; }

    public decimal? WeightOrQuantity { get; set; }

    public decimal? Price { get; set; }

    public virtual Order? Order { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual Sale Sale { get; set; } = null!;
}
