using System;
using System.Collections.Generic;

namespace DataBase_Carniceria;

public partial class MeasurementUnit
{
    public int UnitId { get; set; }

    public string Name { get; set; } = null!;

    public string Abbreviation { get; set; } = null!;

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
