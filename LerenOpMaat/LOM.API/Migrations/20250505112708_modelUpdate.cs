using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace LOM.API.Migrations
{
    /// <inheritdoc />
    public partial class modelUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Semesters_Modules_ModuleId",
                table: "Semesters");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "Modules");

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

            migrationBuilder.AddColumn<int>(
                name: "GraduateProfileId",
                table: "Modules",
                type: "int",
                nullable: false,
                defaultValue: 0);

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

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "LearningRoutes",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "GraduateProfiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ColorCode = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GraduateProfiles", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Requirements",
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
                    table.PrimaryKey("PK_Requirements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Requirements_Modules_ModuleId",
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
                value: new DateTime(2025, 5, 5, 13, 27, 7, 543, DateTimeKind.Local).AddTicks(3865));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 2,
                column: "StartDate",
                value: new DateTime(2026, 5, 5, 13, 27, 7, 543, DateTimeKind.Local).AddTicks(3938));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 3,
                column: "StartDate",
                value: new DateTime(2027, 5, 5, 13, 27, 7, 543, DateTimeKind.Local).AddTicks(3945));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 4,
                column: "StartDate",
                value: new DateTime(2024, 5, 5, 13, 27, 7, 543, DateTimeKind.Local).AddTicks(3946));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 5,
                column: "StartDate",
                value: new DateTime(2023, 5, 5, 13, 27, 7, 543, DateTimeKind.Local).AddTicks(3949));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 6,
                column: "StartDate",
                value: new DateTime(2022, 5, 5, 13, 27, 7, 543, DateTimeKind.Local).AddTicks(3951));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 7,
                column: "StartDate",
                value: new DateTime(2021, 5, 5, 13, 27, 7, 543, DateTimeKind.Local).AddTicks(3952));

            migrationBuilder.InsertData(
                table: "GraduateProfiles",
                columns: new[] { "Id", "ColorCode", "Name" },
                values: new object[,]
                {
                    { 1, "#F16682", "BIM" },
                    { 2, "#F5A61A", "SE" },
                    { 3, "#4594D3", "IDNS" }
                });

            migrationBuilder.UpdateData(
                table: "LearningRoutes",
                keyColumn: "Id",
                keyValue: 1,
                column: "Name",
                value: "Test Route");

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Code", "GraduateProfileId", "IsActive", "Niveau", "Periode" },
                values: new object[] { "IP.01", 3, true, 1, 1 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Code", "GraduateProfileId", "IsActive", "Periode" },
                values: new object[] { "WDB.02", 1, true, 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Code", "GraduateProfileId", "IsActive", "Niveau", "Periode" },
                values: new object[] { "DSA.03", 2, true, 3, 1 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Code", "GraduateProfileId", "IsActive", "Niveau", "Periode" },
                values: new object[] { "DBMS.04", 3, true, 1, 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Code", "GraduateProfileId", "IsActive", "Periode" },
                values: new object[] { "IP.05", 1, true, 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "Code", "GraduateProfileId", "IsActive", "Niveau", "Periode" },
                values: new object[] { "WDB.06", 2, true, 3, 1 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "Code", "GraduateProfileId", "IsActive", "Niveau", "Periode" },
                values: new object[] { "DSA.07", 3, true, 1, 1 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "Code", "GraduateProfileId", "IsActive", "Periode" },
                values: new object[] { "DBMS.08", 1, true, 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "Code", "GraduateProfileId", "IsActive", "Niveau", "Periode" },
                values: new object[] { "IP.09", 2, true, 3, 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "Code", "GraduateProfileId", "IsActive", "Niveau", "Periode" },
                values: new object[] { "WDB.10", 3, true, 1, 1 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "Code", "GraduateProfileId", "IsActive", "Periode" },
                values: new object[] { "DSA.11", 1, true, 1 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "Code", "GraduateProfileId", "IsActive", "Niveau", "Periode" },
                values: new object[] { "DBMS.12", 2, true, 3, 1 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "Code", "GraduateProfileId", "IsActive", "Niveau", "Periode" },
                values: new object[] { "DSA.13", 3, true, 1, 1 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "Code", "GraduateProfileId", "IsActive", "Periode" },
                values: new object[] { "DBMS.14", 1, true, 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "Code", "GraduateProfileId", "IsActive", "Niveau", "Periode" },
                values: new object[] { "DBMS.15", 2, true, 3, 1 });

            migrationBuilder.InsertData(
                table: "Requirements",
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
                name: "IX_Modules_GraduateProfileId",
                table: "Modules",
                column: "GraduateProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_Requirements_ModuleId",
                table: "Requirements",
                column: "ModuleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Modules_GraduateProfiles_GraduateProfileId",
                table: "Modules",
                column: "GraduateProfileId",
                principalTable: "GraduateProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

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
                name: "FK_Modules_GraduateProfiles_GraduateProfileId",
                table: "Modules");

            migrationBuilder.DropForeignKey(
                name: "FK_Semesters_Modules_ModuleId",
                table: "Semesters");

            migrationBuilder.DropTable(
                name: "GraduateProfiles");

            migrationBuilder.DropTable(
                name: "Requirements");

            migrationBuilder.DropIndex(
                name: "IX_Modules_GraduateProfileId",
                table: "Modules");

            migrationBuilder.DropColumn(
                name: "GraduateProfileId",
                table: "Modules");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Modules");

            migrationBuilder.DropColumn(
                name: "Periode",
                table: "Modules");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "LearningRoutes");

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

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Modules",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

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
                columns: new[] { "Category", "Code", "Niveau" },
                values: new object[] { "SE", "TMP.01.DT", 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Category", "Code" },
                values: new object[] { "BIM", "TMP.01.DT" });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Category", "Code", "Niveau" },
                values: new object[] { "IDNS", "TMP.01.DT", 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Category", "Code", "Niveau" },
                values: new object[] { "SE", "TMP.01.DT", 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Category", "Code" },
                values: new object[] { "BIM", "TMP.01.DT" });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "Category", "Code", "Niveau" },
                values: new object[] { "IDNS", "TMP.01.DT", 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "Category", "Code", "Niveau" },
                values: new object[] { "SE", "TMP.01.DT", 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "Category", "Code" },
                values: new object[] { "BIM", "TMP.01.DT" });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "Category", "Code", "Niveau" },
                values: new object[] { "IDNS", "TMP.01.DT", 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "Category", "Code", "Niveau" },
                values: new object[] { "SE", "TMP.01.DT", 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "Category", "Code" },
                values: new object[] { "BIM", "TMP.01.DT" });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "Category", "Code", "Niveau" },
                values: new object[] { "IDNS", "TMP.01.DT", 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "Category", "Code", "Niveau" },
                values: new object[] { "SE", "TMP.01.DT", 2 });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "Category", "Code" },
                values: new object[] { "BIM", "TMP.01.DT" });

            migrationBuilder.UpdateData(
                table: "Modules",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "Category", "Code", "Niveau" },
                values: new object[] { "IDNS", "TMP.01.DT", 2 });

            migrationBuilder.AddForeignKey(
                name: "FK_Semesters_Modules_ModuleId",
                table: "Semesters",
                column: "ModuleId",
                principalTable: "Modules",
                principalColumn: "Id");
        }
    }
}
