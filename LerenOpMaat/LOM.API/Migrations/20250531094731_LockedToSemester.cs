using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LOM.API.Migrations
{
    /// <inheritdoc />
    public partial class LockedToSemester : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Locked",
                table: "Semesters",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 1,
                column: "StartDate",
                value: new DateTime(2025, 5, 31, 11, 47, 30, 667, DateTimeKind.Local).AddTicks(3024));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 2,
                column: "StartDate",
                value: new DateTime(2026, 5, 31, 11, 47, 30, 667, DateTimeKind.Local).AddTicks(3084));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 3,
                column: "StartDate",
                value: new DateTime(2027, 5, 31, 11, 47, 30, 667, DateTimeKind.Local).AddTicks(3088));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 4,
                column: "StartDate",
                value: new DateTime(2024, 5, 31, 11, 47, 30, 667, DateTimeKind.Local).AddTicks(3090));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 5,
                column: "StartDate",
                value: new DateTime(2023, 5, 31, 11, 47, 30, 667, DateTimeKind.Local).AddTicks(3093));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 6,
                column: "StartDate",
                value: new DateTime(2022, 5, 31, 11, 47, 30, 667, DateTimeKind.Local).AddTicks(3094));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 7,
                column: "StartDate",
                value: new DateTime(2021, 5, 31, 11, 47, 30, 667, DateTimeKind.Local).AddTicks(3096));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "DateTime",
                value: new DateTime(2025, 5, 31, 11, 47, 30, 676, DateTimeKind.Local).AddTicks(3138));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "DateTime",
                value: new DateTime(2025, 5, 31, 11, 47, 30, 676, DateTimeKind.Local).AddTicks(3188));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "DateTime",
                value: new DateTime(2025, 5, 31, 11, 47, 30, 676, DateTimeKind.Local).AddTicks(3191));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 4,
                column: "DateTime",
                value: new DateTime(2025, 5, 31, 11, 47, 30, 676, DateTimeKind.Local).AddTicks(3193));

            migrationBuilder.UpdateData(
                table: "Semesters",
                keyColumn: "Id",
                keyValue: 1,
                column: "Locked",
                value: false);

            migrationBuilder.UpdateData(
                table: "Semesters",
                keyColumn: "Id",
                keyValue: 2,
                column: "Locked",
                value: false);

            migrationBuilder.UpdateData(
                table: "Semesters",
                keyColumn: "Id",
                keyValue: 3,
                column: "Locked",
                value: false);

            migrationBuilder.UpdateData(
                table: "Semesters",
                keyColumn: "Id",
                keyValue: 4,
                column: "Locked",
                value: false);

            migrationBuilder.UpdateData(
                table: "Semesters",
                keyColumn: "Id",
                keyValue: 5,
                column: "Locked",
                value: false);

            migrationBuilder.UpdateData(
                table: "Semesters",
                keyColumn: "Id",
                keyValue: 6,
                column: "Locked",
                value: false);

            migrationBuilder.UpdateData(
                table: "Semesters",
                keyColumn: "Id",
                keyValue: 7,
                column: "Locked",
                value: false);

            migrationBuilder.UpdateData(
                table: "Semesters",
                keyColumn: "Id",
                keyValue: 8,
                column: "Locked",
                value: false);

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: 1,
                column: "FirstName",
                value: "John");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Locked",
                table: "Semesters");

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 1,
                column: "StartDate",
                value: new DateTime(2025, 5, 30, 22, 43, 33, 396, DateTimeKind.Local).AddTicks(6229));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 2,
                column: "StartDate",
                value: new DateTime(2026, 5, 30, 22, 43, 33, 396, DateTimeKind.Local).AddTicks(6269));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 3,
                column: "StartDate",
                value: new DateTime(2027, 5, 30, 22, 43, 33, 396, DateTimeKind.Local).AddTicks(6274));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 4,
                column: "StartDate",
                value: new DateTime(2024, 5, 30, 22, 43, 33, 396, DateTimeKind.Local).AddTicks(6275));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 5,
                column: "StartDate",
                value: new DateTime(2023, 5, 30, 22, 43, 33, 396, DateTimeKind.Local).AddTicks(6278));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 6,
                column: "StartDate",
                value: new DateTime(2022, 5, 30, 22, 43, 33, 396, DateTimeKind.Local).AddTicks(6279));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 7,
                column: "StartDate",
                value: new DateTime(2021, 5, 30, 22, 43, 33, 396, DateTimeKind.Local).AddTicks(6281));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "DateTime",
                value: new DateTime(2025, 5, 30, 22, 43, 33, 406, DateTimeKind.Local).AddTicks(1410));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "DateTime",
                value: new DateTime(2025, 5, 30, 22, 43, 33, 406, DateTimeKind.Local).AddTicks(1432));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "DateTime",
                value: new DateTime(2025, 5, 30, 22, 43, 33, 406, DateTimeKind.Local).AddTicks(1434));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 4,
                column: "DateTime",
                value: new DateTime(2025, 5, 30, 22, 43, 33, 406, DateTimeKind.Local).AddTicks(1436));

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: 1,
                column: "FirstName",
                value: "Jhon");
        }
    }
}
