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
                name: "Oers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Base64PDF = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UploadDate = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Oers", x => x.Id);
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
                    Description = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Ec = table.Column<int>(type: "int", nullable: false),
                    Niveau = table.Column<int>(type: "int", nullable: false),
                    Periode = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    GraduateProfileId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Modules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Modules_GraduateProfiles_GraduateProfileId",
                        column: x => x.GraduateProfileId,
                        principalTable: "GraduateProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
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

            migrationBuilder.CreateTable(
                name: "Semesters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Year = table.Column<int>(type: "int", nullable: false),
                    Periode = table.Column<byte>(type: "tinyint unsigned", nullable: false),
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
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Cohorts",
                columns: new[] { "Id", "IsActive", "StartDate" },
                values: new object[,]
                {
                    { 1, true, new DateTime(2025, 5, 7, 7, 34, 25, 275, DateTimeKind.Local).AddTicks(9519) },
                    { 2, true, new DateTime(2026, 5, 7, 7, 34, 25, 275, DateTimeKind.Local).AddTicks(9586) },
                    { 3, false, new DateTime(2027, 5, 7, 7, 34, 25, 275, DateTimeKind.Local).AddTicks(9590) },
                    { 4, true, new DateTime(2024, 5, 7, 7, 34, 25, 275, DateTimeKind.Local).AddTicks(9593) },
                    { 5, true, new DateTime(2023, 5, 7, 7, 34, 25, 275, DateTimeKind.Local).AddTicks(9596) },
                    { 6, true, new DateTime(2022, 5, 7, 7, 34, 25, 275, DateTimeKind.Local).AddTicks(9598) },
                    { 7, true, new DateTime(2021, 5, 7, 7, 34, 25, 275, DateTimeKind.Local).AddTicks(9600) }
                });

            migrationBuilder.InsertData(
                table: "GraduateProfiles",
                columns: new[] { "Id", "ColorCode", "Name" },
                values: new object[,]
                {
                    { 1, "#F16682", "BIM" },
                    { 2, "#F5A61A", "SE" },
                    { 3, "#4594D3", "IDNS" }
                });

            migrationBuilder.InsertData(
                table: "LearningRoutes",
                column: "Id",
                value: 1);

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "FirstName", "LastName", "LearningRouteId", "StartYear" },
                values: new object[] { 2, "Robin", "Hood", null, 0 });

            migrationBuilder.InsertData(
                table: "Modules",
                columns: new[] { "Id", "Code", "Description", "Ec", "GraduateProfileId", "IsActive", "Name", "Niveau", "Periode" },
                values: new object[,]
                {
                    { 1, "IP.01", "Introduction to Programming", 30, 3, true, "Introduction to Programming", 1, 1 },
                    { 2, "WDB.02", "Web Development Basics", 30, 1, true, "Web Development Basics", 2, 2 },
                    { 3, "DSA.03", "Data Structures and Algorithms", 30, 2, true, "Data Structures and Algorithms", 3, 1 },
                    { 4, "DBMS.04", "Database Management Systems", 30, 3, true, "Database Management Systems", 1, 2 },
                    { 5, "IP.05", "Introduction to Programming", 30, 1, true, "Introduction to Programming", 2, 2 },
                    { 6, "WDB.06", "Web Development Basics", 30, 2, true, "Web Development Basics", 3, 1 },
                    { 7, "DSA.07", "Data Structures and Algorithms", 30, 3, true, "Data Structures and Algorithms", 1, 1 },
                    { 8, "DBMS.08", "Database Management Systems", 30, 1, true, "Database Management Systems", 2, 2 },
                    { 9, "IP.09", "Introduction to Programming", 30, 2, true, "Introduction to Programming", 3, 2 },
                    { 10, "WDB.10", "Web Development Basics", 30, 3, true, "Web Development Basics", 1, 1 },
                    { 11, "DSA.11", "Data Structures and Algorithms", 30, 1, true, "Data Structures and Algorithms", 2, 1 },
                    { 12, "DBMS.12", "Database Management Systems", 30, 2, true, "Database Management Systems", 3, 1 },
                    { 13, "DSA.13", "Data Structures and Algorithms", 30, 3, true, "Data Structures and Algorithms", 1, 1 },
                    { 14, "DBMS.14", "Database Management Systems", 30, 1, true, "Database Management Systems", 2, 2 },
                    { 15, "DBMS.15", "Database Management Systems", 30, 2, true, "Database Management Systems", 3, 1 }
                });

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "FirstName", "LastName", "LearningRouteId", "StartYear" },
                values: new object[] { 1, "Jhon", "Doe", 1, 2023 });

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

            migrationBuilder.InsertData(
                table: "Semesters",
                columns: new[] { "Id", "LearningRouteId", "ModuleId", "Periode", "Year" },
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

            migrationBuilder.CreateIndex(
                name: "IX_Modules_GraduateProfileId",
                table: "Modules",
                column: "GraduateProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_Requirements_ModuleId",
                table: "Requirements",
                column: "ModuleId");

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
                name: "Oers");

            migrationBuilder.DropTable(
                name: "Requirements");

            migrationBuilder.DropTable(
                name: "Semesters");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "Modules");

            migrationBuilder.DropTable(
                name: "LearningRoutes");

            migrationBuilder.DropTable(
                name: "GraduateProfiles");
        }
    }
}
