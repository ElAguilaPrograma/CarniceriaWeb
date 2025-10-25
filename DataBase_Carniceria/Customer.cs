using System;
using System.Collections.Generic;

namespace DataBase_Carniceria;

public partial class Customer
{
    public int CustomerId { get; set; }

    public int BranchId { get; set; }

    public string? Name { get; set; }

    public string? Phone { get; set; }

    public string? Address { get; set; }

    public virtual Branch Branch { get; set; } = null!;

    public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();
}
