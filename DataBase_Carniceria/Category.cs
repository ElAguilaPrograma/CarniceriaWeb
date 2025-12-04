using System;
using System.Collections.Generic;

namespace DataBase_Carniceria;

public partial class Category
{
    public int CategoryId { get; set; }

    public int? BranchId { get; set; }

    public string Name { get; set; } = null!;

    public virtual Branch Branch { get; set; } = null!;

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
