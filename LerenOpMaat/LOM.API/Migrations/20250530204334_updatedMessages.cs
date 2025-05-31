using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LOM.API.Migrations
{
    /// <inheritdoc />
    public partial class updatedMessages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRead",
                table: "Messages",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

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
                columns: new[] { "DateTime", "IsRead" },
                values: new object[] { new DateTime(2025, 5, 30, 22, 43, 33, 406, DateTimeKind.Local).AddTicks(1410), false });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateTime", "IsRead" },
                values: new object[] { new DateTime(2025, 5, 30, 22, 43, 33, 406, DateTimeKind.Local).AddTicks(1432), false });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateTime", "IsRead" },
                values: new object[] { new DateTime(2025, 5, 30, 22, 43, 33, 406, DateTimeKind.Local).AddTicks(1434), false });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "DateTime", "IsRead" },
                values: new object[] { new DateTime(2025, 5, 30, 22, 43, 33, 406, DateTimeKind.Local).AddTicks(1436), false });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRead",
                table: "Messages");

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 1,
                column: "StartDate",
                value: new DateTime(2025, 5, 30, 11, 22, 53, 800, DateTimeKind.Local).AddTicks(5705));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 2,
                column: "StartDate",
                value: new DateTime(2026, 5, 30, 11, 22, 53, 800, DateTimeKind.Local).AddTicks(5775));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 3,
                column: "StartDate",
                value: new DateTime(2027, 5, 30, 11, 22, 53, 800, DateTimeKind.Local).AddTicks(5782));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 4,
                column: "StartDate",
                value: new DateTime(2024, 5, 30, 11, 22, 53, 800, DateTimeKind.Local).AddTicks(5786));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 5,
                column: "StartDate",
                value: new DateTime(2023, 5, 30, 11, 22, 53, 800, DateTimeKind.Local).AddTicks(5789));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 6,
                column: "StartDate",
                value: new DateTime(2022, 5, 30, 11, 22, 53, 800, DateTimeKind.Local).AddTicks(5793));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 7,
                column: "StartDate",
                value: new DateTime(2021, 5, 30, 11, 22, 53, 800, DateTimeKind.Local).AddTicks(5796));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "DateTime",
                value: new DateTime(2025, 5, 30, 11, 22, 54, 390, DateTimeKind.Local).AddTicks(2145));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "DateTime",
                value: new DateTime(2025, 5, 30, 11, 22, 54, 390, DateTimeKind.Local).AddTicks(2186));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "DateTime",
                value: new DateTime(2025, 5, 30, 11, 22, 54, 390, DateTimeKind.Local).AddTicks(2191));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 4,
                column: "DateTime",
                value: new DateTime(2025, 5, 30, 11, 22, 54, 390, DateTimeKind.Local).AddTicks(2195));
        }
    }
}
