using System;
using System.Collections.Generic;

namespace DataBase_Carniceria;

public partial class Order
{
    public int OrderId { get; set; }

    public int BranchId { get; set; }

    public int UserId { get; set; }

    public string Name { get; set; } = null!;

    public DateTime RegistrationDate { get; set; }

    public bool IsComplete { get; set; }

    public virtual Branch Branch { get; set; } = null!;

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();

    public virtual ICollection<SaleDetail> SaleDetails { get; set; } = new List<SaleDetail>();

    public virtual User User { get; set; } = null!;
}
