using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataBase_Carniceria.Migrations
{
    /// <inheritdoc />
    public partial class AbbreviationOnMeasurementUnit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Abbreviation",
                table: "MeasurementUnits",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Abbreviation",
                table: "MeasurementUnits");
        }
    }
}
