using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace LOM.API.Migrations
{
    /// <inheritdoc />
    public partial class newDbUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ModuleEVLs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ModuleId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Ec = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ModuleEVLs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ModuleEVLs_Modules_ModuleId",
                        column: x => x.ModuleId,
                        principalTable: "Modules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 1,
                column: "StartDate",
                value: new DateTime(2025, 5, 22, 16, 36, 39, 218, DateTimeKind.Local).AddTicks(4171));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 2,
                column: "StartDate",
                value: new DateTime(2026, 5, 22, 16, 36, 39, 218, DateTimeKind.Local).AddTicks(4224));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 3,
                column: "StartDate",
                value: new DateTime(2027, 5, 22, 16, 36, 39, 218, DateTimeKind.Local).AddTicks(4228));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 4,
                column: "StartDate",
                value: new DateTime(2024, 5, 22, 16, 36, 39, 218, DateTimeKind.Local).AddTicks(4231));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 5,
                column: "StartDate",
                value: new DateTime(2023, 5, 22, 16, 36, 39, 218, DateTimeKind.Local).AddTicks(4234));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 6,
                column: "StartDate",
                value: new DateTime(2022, 5, 22, 16, 36, 39, 218, DateTimeKind.Local).AddTicks(4236));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 7,
                column: "StartDate",
                value: new DateTime(2021, 5, 22, 16, 36, 39, 218, DateTimeKind.Local).AddTicks(4238));

            migrationBuilder.InsertData(
                table: "ModuleEVLs",
                columns: new[] { "Id", "Ec", "ModuleId", "Name" },
                values: new object[,]
                {
                    { 1, 10, 1, "EVL 1" },
                    { 2, 10, 1, "EVL 2" },
                    { 3, 10, 1, "EVL 3" },
                    { 4, 10, 2, "EVL 1" },
                    { 5, 10, 2, "EVL 2" },
                    { 6, 10, 2, "EVL 3" },
                    { 7, 10, 3, "EVL 1" },
                    { 8, 10, 3, "EVL 2" },
                    { 9, 10, 3, "EVL 3" },
                    { 10, 10, 4, "EVL 1" },
                    { 11, 10, 4, "EVL 2" },
                    { 12, 10, 4, "EVL 3" },
                    { 13, 10, 5, "EVL 1" },
                    { 14, 10, 5, "EVL 2" },
                    { 15, 10, 5, "EVL 3" },
                    { 16, 10, 6, "EVL 1" },
                    { 17, 10, 6, "EVL 2" },
                    { 18, 10, 6, "EVL 3" },
                    { 19, 10, 7, "EVL 1" },
                    { 20, 10, 7, "EVL 2" },
                    { 21, 10, 7, "EVL 3" },
                    { 22, 10, 8, "EVL 1" },
                    { 23, 10, 8, "EVL 2" },
                    { 24, 10, 8, "EVL 3" },
                    { 25, 10, 9, "EVL 1" },
                    { 26, 10, 9, "EVL 2" },
                    { 27, 10, 9, "EVL 3" },
                    { 28, 10, 10, "EVL 1" },
                    { 29, 10, 10, "EVL 2" },
                    { 30, 10, 10, "EVL 3" },
                    { 31, 10, 11, "EVL 1" },
                    { 32, 10, 11, "EVL 2" },
                    { 33, 10, 11, "EVL 3" },
                    { 34, 10, 12, "EVL 1" },
                    { 35, 10, 12, "EVL 2" },
                    { 36, 10, 12, "EVL 3" },
                    { 37, 10, 13, "EVL 1" },
                    { 38, 10, 13, "EVL 2" },
                    { 39, 10, 13, "EVL 3" },
                    { 40, 10, 14, "EVL 1" },
                    { 41, 10, 14, "EVL 2" },
                    { 42, 10, 14, "EVL 3" },
                    { 43, 10, 15, "EVL 1" },
                    { 44, 10, 15, "EVL 2" },
                    { 45, 10, 15, "EVL 3" },
                    { 46, 10, 16, "EVL 1" },
                    { 47, 10, 16, "EVL 2" },
                    { 48, 10, 16, "EVL 3" },
                    { 49, 10, 17, "EVL 1" },
                    { 50, 10, 17, "EVL 2" },
                    { 51, 10, 17, "EVL 3" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ModuleEVLs_ModuleId",
                table: "ModuleEVLs",
                column: "ModuleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ModuleEVLs");

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 1,
                column: "StartDate",
                value: new DateTime(2025, 5, 15, 18, 51, 5, 297, DateTimeKind.Local).AddTicks(4544));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 2,
                column: "StartDate",
                value: new DateTime(2026, 5, 15, 18, 51, 5, 297, DateTimeKind.Local).AddTicks(4608));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 3,
                column: "StartDate",
                value: new DateTime(2027, 5, 15, 18, 51, 5, 297, DateTimeKind.Local).AddTicks(4611));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 4,
                column: "StartDate",
                value: new DateTime(2024, 5, 15, 18, 51, 5, 297, DateTimeKind.Local).AddTicks(4613));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 5,
                column: "StartDate",
                value: new DateTime(2023, 5, 15, 18, 51, 5, 297, DateTimeKind.Local).AddTicks(4616));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 6,
                column: "StartDate",
                value: new DateTime(2022, 5, 15, 18, 51, 5, 297, DateTimeKind.Local).AddTicks(4618));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 7,
                column: "StartDate",
                value: new DateTime(2021, 5, 15, 18, 51, 5, 297, DateTimeKind.Local).AddTicks(4620));
        }
    }
}
