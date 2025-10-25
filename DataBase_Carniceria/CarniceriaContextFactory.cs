using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataBase_Carniceria
{
    //Le indica a las migraciones como crear el contexto en tiempo de ejecución
    public class ToDoContextFactory : IDesignTimeDbContextFactory<CarniceriaContext>
    {
        public CarniceriaContext CreateDbContext(string[] args)
        {
            var path = Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory()).FullName, "Carniceria.Server");

            var configuration = new ConfigurationBuilder()
                .SetBasePath(path)
                .AddJsonFile("appsettings.Development.json")
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<CarniceriaContext>();
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            optionsBuilder.UseSqlServer(connectionString);

            return new CarniceriaContext(optionsBuilder.Options);
        }
    }
}
