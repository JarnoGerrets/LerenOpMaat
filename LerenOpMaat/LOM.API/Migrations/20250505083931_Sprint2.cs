using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace LOM.API.Migrations
{
    /// <inheritdoc />
    public partial class Sprint2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Semesters_Modules_ModuleId",
                table: "Semesters");

            migrationBuilder.RenameColumn(
                name: "SemesterNumber",
                table: "Semesters",
                newName: "Periode");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Modules",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Modules",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Periode",
                table: "Modules",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Requirement",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ModuleId = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Value = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Requirement", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Requirement_Modules_ModuleId",
                        column: x => x.ModuleId,
                        principalTable: "Modules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 1,
                column: "StartDate",
                value: new DateTime(2025, 5, 5, 10, 39, 30, 578, DateTimeKind.Local).AddTicks(494));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 2,
                column: "StartDate",
                value: new DateTime(2026, 5, 5, 10, 39, 30, 578, DateTimeKind.Local).AddTicks(558));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 3,
                column: "StartDate",
                value: new DateTime(2027, 5, 5, 10, 39, 30, 578, DateTimeKind.Local).AddTicks(562));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 4,
                column: "StartDate",
                value: new DateTime(2024, 5, 5, 10, 39, 30, 578, DateTimeKind.Local).AddTicks(564));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 5,
                column: "StartDate",
                value: new DateTime(2023, 5, 5, 10, 39, 30, 578, DateTimeKind.Local).AddTicks(567));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 6,
                column: "StartDate",
                value: new DateTime(2022, 5, 5, 10, 39, 30, 578, DateTimeKind.Local).AddTicks(569));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 7,
                column: "StartDate",
                value: new DateTime(2021, 5, 5, 10, 39, 30, 578, DateTimeKind.Local).AddTicks(571));

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Code", "IsActive", "Niveau", "Periode" },
                values: new object[] { "IP.01", true, 1, 1 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Code", "IsActive", "Periode" },
                values: new object[] { "WDB.02", true, 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Code", "IsActive", "Niveau", "Periode" },
                values: new object[] { "DSA.03", true, 3, 1 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Code", "IsActive", "Niveau", "Periode" },
                values: new object[] { "DBMS.04", true, 1, 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Code", "IsActive", "Periode" },
                values: new object[] { "IP.05", true, 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "Code", "IsActive", "Niveau", "Periode" },
                values: new object[] { "WDB.06", true, 3, 1 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "Code", "IsActive", "Niveau", "Periode" },
                values: new object[] { "DSA.07", true, 1, 1 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "Code", "IsActive", "Periode" },
                values: new object[] { "DBMS.08", true, 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "Code", "IsActive", "Niveau", "Periode" },
                values: new object[] { "IP.09", true, 3, 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "Code", "IsActive", "Niveau", "Periode" },
                values: new object[] { "WDB.10", true, 1, 1 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "Code", "IsActive", "Periode" },
                values: new object[] { "DSA.11", true, 1 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "Code", "IsActive", "Niveau", "Periode" },
                values: new object[] { "DBMS.12", true, 3, 1 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "Code", "IsActive", "Niveau", "Periode" },
                values: new object[] { "DSA.13", true, 1, 1 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "Code", "IsActive", "Periode" },
                values: new object[] { "DBMS.14", true, 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "Code", "IsActive", "Niveau", "Periode" },
                values: new object[] { "DBMS.15", true, 3, 1 });

            migrationBuilder.InsertData(
                table: "Requirement",
                columns: new[] { "Id", "ModuleId", "Type", "Value" },
                values: new object[,]
                {
                    { 1, 1, 0, "50" },
                    { 2, 2, 2, "9" },
                    { 3, 3, 1, "120" },
                    { 4, 4, 2, "2" },
                    { 5, 5, 0, "50" },
                    { 6, 5, 2, "3" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Requirement_ModuleId",
                table: "Requirement",
                column: "ModuleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Semesters_Modules_ModuleId",
                table: "Semesters",
                column: "ModuleId",
                principalTable: "Modules",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Semesters_Modules_ModuleId",
                table: "Semesters");

            migrationBuilder.DropTable(
                name: "Requirement");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Modules");

            migrationBuilder.DropColumn(
                name: "Periode",
                table: "Modules");

            migrationBuilder.RenameColumn(
                name: "Periode",
                table: "Semesters",
                newName: "SemesterNumber");

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Description",
                keyValue: null,
                column: "Description",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Modules",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 1,
                column: "StartDate",
                value: new DateTime(2025, 5, 1, 10, 47, 31, 737, DateTimeKind.Local).AddTicks(7116));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 2,
                column: "StartDate",
                value: new DateTime(2026, 5, 1, 10, 47, 31, 737, DateTimeKind.Local).AddTicks(7173));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 3,
                column: "StartDate",
                value: new DateTime(2027, 5, 1, 10, 47, 31, 737, DateTimeKind.Local).AddTicks(7177));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 4,
                column: "StartDate",
                value: new DateTime(2024, 5, 1, 10, 47, 31, 737, DateTimeKind.Local).AddTicks(7180));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 5,
                column: "StartDate",
                value: new DateTime(2023, 5, 1, 10, 47, 31, 737, DateTimeKind.Local).AddTicks(7182));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 6,
                column: "StartDate",
                value: new DateTime(2022, 5, 1, 10, 47, 31, 737, DateTimeKind.Local).AddTicks(7184));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 7,
                column: "StartDate",
                value: new DateTime(2021, 5, 1, 10, 47, 31, 737, DateTimeKind.Local).AddTicks(7186));

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Code", "Niveau" },
                values: new object[] { "TMP.01.DT", 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 2,
                column: "Code",
                value: "TMP.01.DT");

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Code", "Niveau" },
                values: new object[] { "TMP.01.DT", 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Code", "Niveau" },
                values: new object[] { "TMP.01.DT", 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 5,
                column: "Code",
                value: "TMP.01.DT");

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "Code", "Niveau" },
                values: new object[] { "TMP.01.DT", 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "Code", "Niveau" },
                values: new object[] { "TMP.01.DT", 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 8,
                column: "Code",
                value: "TMP.01.DT");

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "Code", "Niveau" },
                values: new object[] { "TMP.01.DT", 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "Code", "Niveau" },
                values: new object[] { "TMP.01.DT", 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 11,
                column: "Code",
                value: "TMP.01.DT");

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "Code", "Niveau" },
                values: new object[] { "TMP.01.DT", 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "Code", "Niveau" },
                values: new object[] { "TMP.01.DT", 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 14,
                column: "Code",
                value: "TMP.01.DT");

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "Code", "Niveau" },
                values: new object[] { "TMP.01.DT", 2 });

            migrationBuilder.AddForeignKey(
                name: "FK_Semesters_Modules_ModuleId",
                table: "Semesters",
                column: "ModuleId",
                principalTable: "Modules",
                principalColumn: "Id");
        }
    }
}
