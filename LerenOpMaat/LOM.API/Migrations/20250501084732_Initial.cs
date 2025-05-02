using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace LOM.API.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
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
                name: "LearningRoutes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LearningRoutes", x => x.Id);
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
                    Code = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Ec = table.Column<int>(type: "int", nullable: false),
                    Niveau = table.Column<int>(type: "int", nullable: false),
                    Category = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Modules", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    FirstName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LastName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StartYear = table.Column<int>(type: "int", nullable: false),
                    LearningRouteId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                    table.ForeignKey(
                        name: "FK_User_LearningRoutes_LearningRouteId",
                        column: x => x.LearningRouteId,
                        principalTable: "LearningRoutes",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Semesters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Year = table.Column<int>(type: "int", nullable: false),
                    SemesterNumber = table.Column<byte>(type: "tinyint unsigned", nullable: false),
                    LearningRouteId = table.Column<int>(type: "int", nullable: false),
                    ModuleId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Semesters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Semesters_LearningRoutes_LearningRouteId",
                        column: x => x.LearningRouteId,
                        principalTable: "LearningRoutes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Semesters_Modules_ModuleId",
                        column: x => x.ModuleId,
                        principalTable: "Modules",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Cohorts",
                columns: new[] { "Id", "IsActive", "StartDate" },
                values: new object[,]
                {
                    { 1, true, new DateTime(2025, 5, 1, 10, 47, 31, 737, DateTimeKind.Local).AddTicks(7116) },
                    { 2, true, new DateTime(2026, 5, 1, 10, 47, 31, 737, DateTimeKind.Local).AddTicks(7173) },
                    { 3, false, new DateTime(2027, 5, 1, 10, 47, 31, 737, DateTimeKind.Local).AddTicks(7177) },
                    { 4, true, new DateTime(2024, 5, 1, 10, 47, 31, 737, DateTimeKind.Local).AddTicks(7180) },
                    { 5, true, new DateTime(2023, 5, 1, 10, 47, 31, 737, DateTimeKind.Local).AddTicks(7182) },
                    { 6, true, new DateTime(2022, 5, 1, 10, 47, 31, 737, DateTimeKind.Local).AddTicks(7184) },
                    { 7, true, new DateTime(2021, 5, 1, 10, 47, 31, 737, DateTimeKind.Local).AddTicks(7186) }
                });

            migrationBuilder.InsertData(
                table: "LearningRoutes",
                column: "Id",
                value: 1);

            migrationBuilder.InsertData(
                table: "Modules",
                columns: new[] { "Id", "Category", "Code", "Description", "Ec", "Name", "Niveau" },
                values: new object[,]
                {
                    { 1, "SE", "TMP.01.DT", "Introduction to Programming", 30, "Introduction to Programming", 2 },
                    { 2, "BIM", "TMP.01.DT", "Web Development Basics", 30, "Web Development Basics", 2 },
                    { 3, "IDNS", "TMP.01.DT", "Data Structures and Algorithms", 30, "Data Structures and Algorithms", 2 },
                    { 4, "SE", "TMP.01.DT", "Database Management Systems", 30, "Database Management Systems", 2 },
                    { 5, "BIM", "TMP.01.DT", "Introduction to Programming", 30, "Introduction to Programming", 2 },
                    { 6, "IDNS", "TMP.01.DT", "Web Development Basics", 30, "Web Development Basics", 2 },
                    { 7, "SE", "TMP.01.DT", "Data Structures and Algorithms", 30, "Data Structures and Algorithms", 2 },
                    { 8, "BIM", "TMP.01.DT", "Database Management Systems", 30, "Database Management Systems", 2 },
                    { 9, "IDNS", "TMP.01.DT", "Introduction to Programming", 30, "Introduction to Programming", 2 },
                    { 10, "SE", "TMP.01.DT", "Web Development Basics", 30, "Web Development Basics", 2 },
                    { 11, "BIM", "TMP.01.DT", "Data Structures and Algorithms", 30, "Data Structures and Algorithms", 2 },
                    { 12, "IDNS", "TMP.01.DT", "Database Management Systems", 30, "Database Management Systems", 2 },
                    { 13, "SE", "TMP.01.DT", "Data Structures and Algorithms", 30, "Data Structures and Algorithms", 2 },
                    { 14, "BIM", "TMP.01.DT", "Database Management Systems", 30, "Database Management Systems", 2 },
                    { 15, "IDNS", "TMP.01.DT", "Database Management Systems", 30, "Database Management Systems", 2 }
                });

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "FirstName", "LastName", "LearningRouteId", "StartYear" },
                values: new object[] { 2, "Robin", "Hood", null, 0 });

            migrationBuilder.InsertData(
                table: "Semesters",
                columns: new[] { "Id", "LearningRouteId", "ModuleId", "SemesterNumber", "Year" },
                values: new object[,]
                {
                    { 1, 1, 1, (byte)1, 1 },
                    { 2, 1, 2, (byte)2, 1 },
                    { 3, 1, 3, (byte)1, 2 },
                    { 4, 1, 4, (byte)2, 2 },
                    { 5, 1, 5, (byte)1, 3 },
                    { 6, 1, 6, (byte)2, 3 },
                    { 7, 1, 7, (byte)1, 4 },
                    { 8, 1, 8, (byte)2, 4 }
                });

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "FirstName", "LastName", "LearningRouteId", "StartYear" },
                values: new object[] { 1, "Jhon", "Doe", 1, 2023 });

            migrationBuilder.CreateIndex(
                name: "IX_Semesters_LearningRouteId",
                table: "Semesters",
                column: "LearningRouteId");

            migrationBuilder.CreateIndex(
                name: "IX_Semesters_ModuleId",
                table: "Semesters",
                column: "ModuleId");

            migrationBuilder.CreateIndex(
                name: "IX_User_LearningRouteId",
                table: "User",
                column: "LearningRouteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Cohorts");

            migrationBuilder.DropTable(
                name: "Semesters");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "Modules");

            migrationBuilder.DropTable(
                name: "LearningRoutes");
        }
    }
}
