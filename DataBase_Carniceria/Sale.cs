using System;
using System.Collections.Generic;

namespace DataBase_Carniceria;

public partial class Sale
{
    public int SaleId { get; set; }

    public int BranchId { get; set; }

    public DateTime Date { get; set; }

    public int UserId { get; set; }

    public bool IsComplete { get; set; }

    public virtual Branch Branch { get; set; } = null!;

    public virtual ICollection<SaleDetail> SaleDetails { get; set; } = new List<SaleDetail>();
}
