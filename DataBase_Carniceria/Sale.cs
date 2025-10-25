using System;
using System.Collections.Generic;

namespace DataBase_Carniceria;

public partial class Sale
{
    public int SaleId { get; set; }

    public int BranchId { get; set; }

    public int CustomerId { get; set; }

    public DateTime Date { get; set; }

    public decimal Total { get; set; }

    public virtual Branch Branch { get; set; } = null!;

    public virtual Customer Customer { get; set; } = null!;

    public virtual ICollection<SalesDetail> SalesDetails { get; set; } = new List<SalesDetail>();
}
