using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LOM.API.Migrations
{
    /// <inheritdoc />
    public partial class demo_issues_sprint_2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Periode",
                table: "Semesters",
                newName: "Period");

            migrationBuilder.RenameColumn(
                name: "Periode",
                table: "Modules",
                newName: "Period");

            migrationBuilder.RenameColumn(
                name: "Niveau",
                table: "Modules",
                newName: "Level");

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 1,
                column: "StartDate",
                value: new DateTime(2025, 5, 7, 18, 33, 18, 669, DateTimeKind.Local).AddTicks(9887));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 2,
                column: "StartDate",
                value: new DateTime(2026, 5, 7, 18, 33, 18, 669, DateTimeKind.Local).AddTicks(9946));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 3,
                column: "StartDate",
                value: new DateTime(2027, 5, 7, 18, 33, 18, 669, DateTimeKind.Local).AddTicks(9952));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 4,
                column: "StartDate",
                value: new DateTime(2024, 5, 7, 18, 33, 18, 669, DateTimeKind.Local).AddTicks(9954));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 5,
                column: "StartDate",
                value: new DateTime(2023, 5, 7, 18, 33, 18, 669, DateTimeKind.Local).AddTicks(9956));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 6,
                column: "StartDate",
                value: new DateTime(2022, 5, 7, 18, 33, 18, 669, DateTimeKind.Local).AddTicks(9959));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 7,
                column: "StartDate",
                value: new DateTime(2021, 5, 7, 18, 33, 18, 669, DateTimeKind.Local).AddTicks(9961));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Period",
                table: "Semesters",
                newName: "Periode");

            migrationBuilder.RenameColumn(
                name: "Period",
                table: "Modules",
                newName: "Periode");

            migrationBuilder.RenameColumn(
                name: "Level",
                table: "Modules",
                newName: "Niveau");

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 1,
                column: "StartDate",
                value: new DateTime(2025, 5, 7, 7, 34, 25, 275, DateTimeKind.Local).AddTicks(9519));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 2,
                column: "StartDate",
                value: new DateTime(2026, 5, 7, 7, 34, 25, 275, DateTimeKind.Local).AddTicks(9586));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 3,
                column: "StartDate",
                value: new DateTime(2027, 5, 7, 7, 34, 25, 275, DateTimeKind.Local).AddTicks(9590));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 4,
                column: "StartDate",
                value: new DateTime(2024, 5, 7, 7, 34, 25, 275, DateTimeKind.Local).AddTicks(9593));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 5,
                column: "StartDate",
                value: new DateTime(2023, 5, 7, 7, 34, 25, 275, DateTimeKind.Local).AddTicks(9596));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 6,
                column: "StartDate",
                value: new DateTime(2022, 5, 7, 7, 34, 25, 275, DateTimeKind.Local).AddTicks(9598));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 7,
                column: "StartDate",
                value: new DateTime(2021, 5, 7, 7, 34, 25, 275, DateTimeKind.Local).AddTicks(9600));
        }
    }
}
