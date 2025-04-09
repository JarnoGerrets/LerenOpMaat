using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace LOM.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Cohorts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    StartDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cohorts", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Modules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Modules", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Cohorts",
                columns: new[] { "Id", "IsActive", "StartDate" },
                values: new object[,]
                {
                    { 1, true, new DateTime(2025, 4, 8, 20, 21, 14, 394, DateTimeKind.Local).AddTicks(6059) },
                    { 2, true, new DateTime(2026, 4, 8, 20, 21, 14, 394, DateTimeKind.Local).AddTicks(6104) },
                    { 3, false, new DateTime(2027, 4, 8, 20, 21, 14, 394, DateTimeKind.Local).AddTicks(6108) },
                    { 4, true, new DateTime(2024, 4, 8, 20, 21, 14, 394, DateTimeKind.Local).AddTicks(6110) },
                    { 5, true, new DateTime(2023, 4, 8, 20, 21, 14, 394, DateTimeKind.Local).AddTicks(6112) },
                    { 6, true, new DateTime(2022, 4, 8, 20, 21, 14, 394, DateTimeKind.Local).AddTicks(6113) },
                    { 7, true, new DateTime(2021, 4, 8, 20, 21, 14, 394, DateTimeKind.Local).AddTicks(6115) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Cohorts");

            migrationBuilder.DropTable(
                name: "Modules");
        }
    }
}
