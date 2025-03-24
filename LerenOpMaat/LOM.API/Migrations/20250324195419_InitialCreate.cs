using System;
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
            migrationBuilder.CreateTable(
                name: "Cohorts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    StartDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cohorts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Modules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Modules", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Cohorts",
                columns: new[] { "Id", "IsActive", "StartDate" },
                values: new object[,]
                {
                    { 1, true, new DateTime(2025, 3, 24, 20, 54, 18, 941, DateTimeKind.Local).AddTicks(1036) },
                    { 2, true, new DateTime(2026, 3, 24, 20, 54, 18, 941, DateTimeKind.Local).AddTicks(1089) },
                    { 3, false, new DateTime(2027, 3, 24, 20, 54, 18, 941, DateTimeKind.Local).AddTicks(1093) },
                    { 4, true, new DateTime(2024, 3, 24, 20, 54, 18, 941, DateTimeKind.Local).AddTicks(1095) },
                    { 5, true, new DateTime(2023, 3, 24, 20, 54, 18, 941, DateTimeKind.Local).AddTicks(1097) },
                    { 6, true, new DateTime(2022, 3, 24, 20, 54, 18, 941, DateTimeKind.Local).AddTicks(1100) },
                    { 7, true, new DateTime(2021, 3, 24, 20, 54, 18, 941, DateTimeKind.Local).AddTicks(1102) }
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
