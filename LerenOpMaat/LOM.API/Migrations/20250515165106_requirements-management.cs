using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace LOM.API.Migrations
{
    /// <inheritdoc />
    public partial class requirementsmanagement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.InsertData(
                table: "Modules",
                columns: new[] { "Id", "Code", "Description", "Ec", "GraduateProfileId", "IsActive", "Level", "Name", "Period" },
                values: new object[,]
                {
                    { 16, "A.01", "Afstuderen", 30, 2, true, 3, "Afstuderen", 2 },
                    { 17, "MDO.01", "Multidisciplinaire Opdracht", 30, 2, true, 3, "Multidisciplinaire Opdracht", 2 }
                });

            migrationBuilder.InsertData(
                table: "Requirements",
                columns: new[] { "Id", "ModuleId", "Type", "Value" },
                values: new object[,]
                {
                    { 7, 16, 2, "17" },
                    { 8, 16, 0, "60" },
                    { 9, 16, 4, "2" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Requirements",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Requirements",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Requirements",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 1,
                column: "StartDate",
                value: new DateTime(2025, 5, 12, 15, 59, 25, 108, DateTimeKind.Local).AddTicks(6370));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 2,
                column: "StartDate",
                value: new DateTime(2026, 5, 12, 15, 59, 25, 108, DateTimeKind.Local).AddTicks(6453));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 3,
                column: "StartDate",
                value: new DateTime(2027, 5, 12, 15, 59, 25, 108, DateTimeKind.Local).AddTicks(6459));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 4,
                column: "StartDate",
                value: new DateTime(2024, 5, 12, 15, 59, 25, 108, DateTimeKind.Local).AddTicks(6461));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 5,
                column: "StartDate",
                value: new DateTime(2023, 5, 12, 15, 59, 25, 108, DateTimeKind.Local).AddTicks(6465));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 6,
                column: "StartDate",
                value: new DateTime(2022, 5, 12, 15, 59, 25, 108, DateTimeKind.Local).AddTicks(6467));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 7,
                column: "StartDate",
                value: new DateTime(2021, 5, 12, 15, 59, 25, 108, DateTimeKind.Local).AddTicks(6469));
        }
    }
}
