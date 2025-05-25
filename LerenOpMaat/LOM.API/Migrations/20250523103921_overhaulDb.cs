using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace LOM.API.Migrations
{
    /// <inheritdoc />
    public partial class overhaulDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 46);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 47);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 48);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 49);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 50);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 51);

            migrationBuilder.CreateTable(
                name: "ModuleProgresses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ModuleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ModuleProgresses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ModuleProgresses_Modules_ModuleId",
                        column: x => x.ModuleId,
                        principalTable: "Modules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ModuleProgresses_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "CompletedEvls",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ModuleProgressId = table.Column<int>(type: "int", nullable: false),
                    ModuleEvlId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompletedEvls", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CompletedEvls_ModuleEVLs_ModuleEvlId",
                        column: x => x.ModuleEvlId,
                        principalTable: "ModuleEVLs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CompletedEvls_ModuleProgresses_ModuleProgressId",
                        column: x => x.ModuleProgressId,
                        principalTable: "ModuleProgresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 1,
                column: "StartDate",
                value: new DateTime(2025, 5, 23, 12, 39, 20, 398, DateTimeKind.Local).AddTicks(2086));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 2,
                column: "StartDate",
                value: new DateTime(2026, 5, 23, 12, 39, 20, 398, DateTimeKind.Local).AddTicks(2161));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 3,
                column: "StartDate",
                value: new DateTime(2027, 5, 23, 12, 39, 20, 398, DateTimeKind.Local).AddTicks(2167));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 4,
                column: "StartDate",
                value: new DateTime(2024, 5, 23, 12, 39, 20, 398, DateTimeKind.Local).AddTicks(2170));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 5,
                column: "StartDate",
                value: new DateTime(2023, 5, 23, 12, 39, 20, 398, DateTimeKind.Local).AddTicks(2176));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 6,
                column: "StartDate",
                value: new DateTime(2022, 5, 23, 12, 39, 20, 398, DateTimeKind.Local).AddTicks(2179));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 7,
                column: "StartDate",
                value: new DateTime(2021, 5, 23, 12, 39, 20, 398, DateTimeKind.Local).AddTicks(2182));

            migrationBuilder.UpdateData(
                table: "GraduateProfiles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ColorCode",
                value: "#F16682A0");

            migrationBuilder.UpdateData(
                table: "GraduateProfiles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ColorCode",
                value: "#F5A61AA0");

            migrationBuilder.UpdateData(
                table: "GraduateProfiles",
                keyColumn: "Id",
                keyValue: 3,
                column: "ColorCode",
                value: "#4594D3A0");

            migrationBuilder.InsertData(
                table: "ModuleProgresses",
                columns: new[] { "Id", "ModuleId", "UserId" },
                values: new object[,]
                {
                    { 1, 1, 1 },
                    { 2, 1, 2 }
                });

            migrationBuilder.InsertData(
                table: "CompletedEvls",
                columns: new[] { "Id", "ModuleEvlId", "ModuleProgressId" },
                values: new object[,]
                {
                    { 1, 1, 1 },
                    { 2, 2, 1 },
                    { 3, 3, 2 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_CompletedEvls_ModuleEvlId",
                table: "CompletedEvls",
                column: "ModuleEvlId");

            migrationBuilder.CreateIndex(
                name: "IX_CompletedEvls_ModuleProgressId",
                table: "CompletedEvls",
                column: "ModuleProgressId");

            migrationBuilder.CreateIndex(
                name: "IX_ModuleProgresses_ModuleId",
                table: "ModuleProgresses",
                column: "ModuleId");

            migrationBuilder.CreateIndex(
                name: "IX_ModuleProgresses_UserId",
                table: "ModuleProgresses",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CompletedEvls");

            migrationBuilder.DropTable(
                name: "ModuleProgresses");

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

            migrationBuilder.UpdateData(
                table: "GraduateProfiles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ColorCode",
                value: "#F16682");

            migrationBuilder.UpdateData(
                table: "GraduateProfiles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ColorCode",
                value: "#F5A61A");

            migrationBuilder.UpdateData(
                table: "GraduateProfiles",
                keyColumn: "Id",
                keyValue: 3,
                column: "ColorCode",
                value: "#4594D3");

            migrationBuilder.InsertData(
                table: "ModuleEVLs",
                columns: new[] { "Id", "Ec", "ModuleId", "Name" },
                values: new object[,]
                {
                    { 46, 10, 16, "EVL 1" },
                    { 47, 10, 16, "EVL 2" },
                    { 48, 10, 16, "EVL 3" },
                    { 49, 10, 17, "EVL 1" },
                    { 50, 10, 17, "EVL 2" },
                    { 51, 10, 17, "EVL 3" }
                });
        }
    }
}
