using System;
using System.Collections.Generic;

namespace DataBase_Carniceria;

public partial class Product
{
    public int ProductId { get; set; }

    public int BranchId { get; set; }

    public int CategoryId { get; set; }

    public int UnitId { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public decimal Price { get; set; }

    public decimal Stock { get; set; }

    public DateTime RegistrationDate { get; set; }

    public bool Active { get; set; }

    public virtual Branch Branch { get; set; } = null!;

    public virtual Category Category { get; set; } = null!;

    public virtual ICollection<SalesDetail> SalesDetails { get; set; } = new List<SalesDetail>();

    public virtual MeasurementUnit Unit { get; set; } = null!;
}
