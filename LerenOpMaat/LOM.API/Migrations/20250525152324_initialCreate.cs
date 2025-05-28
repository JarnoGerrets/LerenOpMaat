using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace LOM.API.Migrations
{
    /// <inheritdoc />
    public partial class initialCreate : Migration
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
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    RoleName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
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
                    Level = table.Column<int>(type: "int", nullable: false),
                    Period = table.Column<int>(type: "int", nullable: false),
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
                    ExternalID = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FirstName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LastName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StartYear = table.Column<int>(type: "int", nullable: false),
                    LearningRouteId = table.Column<int>(type: "int", nullable: true),
                    RoleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                    table.ForeignKey(
                        name: "FK_User_LearningRoutes_LearningRouteId",
                        column: x => x.LearningRouteId,
                        principalTable: "LearningRoutes",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_User_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

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
                    Period = table.Column<byte>(type: "tinyint unsigned", nullable: false),
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

            migrationBuilder.CreateTable(
                name: "Conversations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    LearningRouteId = table.Column<int>(type: "int", nullable: false),
                    TeacherId = table.Column<int>(type: "int", nullable: false),
                    StudentId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Conversations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Conversations_LearningRoutes_LearningRouteId",
                        column: x => x.LearningRouteId,
                        principalTable: "LearningRoutes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Conversations_User_StudentId",
                        column: x => x.StudentId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Conversations_User_TeacherId",
                        column: x => x.TeacherId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

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
                name: "Messages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    DateTime = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Commentary = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ConversationId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Messages_Conversations_ConversationId",
                        column: x => x.ConversationId,
                        principalTable: "Conversations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Messages_User_UserId",
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

            migrationBuilder.InsertData(
                table: "Cohorts",
                columns: new[] { "Id", "IsActive", "StartDate" },
                values: new object[,]
                {
                    { 1, true, new DateTime(2025, 5, 25, 17, 23, 24, 373, DateTimeKind.Local).AddTicks(4435) },
                    { 2, true, new DateTime(2026, 5, 25, 17, 23, 24, 373, DateTimeKind.Local).AddTicks(4487) },
                    { 3, false, new DateTime(2027, 5, 25, 17, 23, 24, 373, DateTimeKind.Local).AddTicks(4495) },
                    { 4, true, new DateTime(2024, 5, 25, 17, 23, 24, 373, DateTimeKind.Local).AddTicks(4498) },
                    { 5, true, new DateTime(2023, 5, 25, 17, 23, 24, 373, DateTimeKind.Local).AddTicks(4500) },
                    { 6, true, new DateTime(2022, 5, 25, 17, 23, 24, 373, DateTimeKind.Local).AddTicks(4502) },
                    { 7, true, new DateTime(2021, 5, 25, 17, 23, 24, 373, DateTimeKind.Local).AddTicks(4504) }
                });

            migrationBuilder.InsertData(
                table: "GraduateProfiles",
                columns: new[] { "Id", "ColorCode", "Name" },
                values: new object[,]
                {
                    { 1, "#F16682A0", "BIM" },
                    { 2, "#F5A61AA0", "SE" },
                    { 3, "#4594D3A0", "IDNS" }
                });

            migrationBuilder.InsertData(
                table: "LearningRoutes",
                column: "Id",
                value: 1);

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "RoleName" },
                values: new object[,]
                {
                    { 1, "Teacher" },
                    { 2, "Student" }
                });

            migrationBuilder.InsertData(
                table: "Modules",
                columns: new[] { "Id", "Code", "Description", "Ec", "GraduateProfileId", "IsActive", "Level", "Name", "Period" },
                values: new object[,]
                {
                    { 1, "IP.01", "Introduction to Programming", 30, 3, true, 1, "Introduction to Programming", 1 },
                    { 2, "WDB.02", "Web Development Basics", 30, 1, true, 2, "Web Development Basics", 2 },
                    { 3, "DSA.03", "Data Structures and Algorithms", 30, 2, true, 3, "Data Structures and Algorithms", 1 },
                    { 4, "DBMS.04", "Database Management Systems", 30, 3, true, 1, "Database Management Systems", 2 },
                    { 5, "IP.05", "Introduction to Programming", 30, 1, true, 2, "Introduction to Programming", 2 },
                    { 6, "WDB.06", "Web Development Basics", 30, 2, true, 3, "Web Development Basics", 1 },
                    { 7, "DSA.07", "Data Structures and Algorithms", 30, 3, true, 1, "Data Structures and Algorithms", 1 },
                    { 8, "DBMS.08", "Database Management Systems", 30, 1, true, 2, "Database Management Systems", 2 },
                    { 9, "IP.09", "Introduction to Programming", 30, 2, true, 3, "Introduction to Programming", 2 },
                    { 10, "WDB.10", "Web Development Basics", 30, 3, true, 1, "Web Development Basics", 1 },
                    { 11, "DSA.11", "Data Structures and Algorithms", 30, 1, true, 2, "Data Structures and Algorithms", 1 },
                    { 12, "DBMS.12", "Database Management Systems", 30, 2, true, 3, "Database Management Systems", 1 },
                    { 13, "DSA.13", "Data Structures and Algorithms", 30, 3, true, 1, "Data Structures and Algorithms", 1 },
                    { 14, "DBMS.14", "Database Management Systems", 30, 1, true, 2, "Database Management Systems", 2 },
                    { 15, "DBMS.15", "Database Management Systems", 30, 2, true, 3, "Database Management Systems", 1 },
                    { 16, "A.01", "Afstuderen", 30, 2, true, 3, "Afstuderen", 2 },
                    { 17, "MDO.01", "Multidisciplinaire Opdracht", 30, 2, true, 3, "Multidisciplinaire Opdracht", 2 }
                });

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "ExternalID", "FirstName", "LastName", "LearningRouteId", "RoleId", "StartYear" },
                values: new object[,]
                {
                    { 1, "TEST123", "Jhon", "Doe", 1, 2, 2023 },
                    { 2, "TEST345", "Robin", "Hood", null, 2, 0 },
                    { 3, "Test54321", "Begeleider", "Begeleider", null, 1, 0 }
                });

            migrationBuilder.InsertData(
                table: "Conversations",
                columns: new[] { "Id", "LearningRouteId", "StudentId", "TeacherId" },
                values: new object[] { 1, 1, 1, 3 });

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
                    { 45, 10, 15, "EVL 3" }
                });

            migrationBuilder.InsertData(
                table: "ModuleProgresses",
                columns: new[] { "Id", "ModuleId", "UserId" },
                values: new object[,]
                {
                    { 1, 1, 1 },
                    { 2, 1, 2 }
                });

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
                    { 6, 5, 2, "3" },
                    { 7, 16, 2, "17" },
                    { 8, 16, 0, "60" },
                    { 9, 16, 4, "2" }
                });

            migrationBuilder.InsertData(
                table: "Semesters",
                columns: new[] { "Id", "LearningRouteId", "ModuleId", "Period", "Year" },
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
                table: "CompletedEvls",
                columns: new[] { "Id", "ModuleEvlId", "ModuleProgressId" },
                values: new object[,]
                {
                    { 1, 1, 1 },
                    { 2, 2, 1 },
                    { 3, 3, 2 }
                });

            migrationBuilder.InsertData(
                table: "Messages",
                columns: new[] { "Id", "Commentary", "ConversationId", "DateTime", "UserId" },
                values: new object[,]
                {
                    { 1, "Hoi, mag ik een feedback krijgen op mijn leerroute?", 1, new DateTime(2025, 5, 25, 17, 23, 24, 373, DateTimeKind.Local).AddTicks(6474), 1 },
                    { 2, "Ik zou semester 2 van het jaar 2 aanpassen naar iets anders.", 1, new DateTime(2025, 5, 25, 17, 23, 24, 373, DateTimeKind.Local).AddTicks(6479), 3 },
                    { 3, "Hoi, Ik heb het aangepast", 1, new DateTime(2025, 5, 25, 17, 23, 24, 373, DateTimeKind.Local).AddTicks(6482), 1 },
                    { 4, "Leerroute ziet er goed uit!", 1, new DateTime(2025, 5, 25, 17, 23, 24, 373, DateTimeKind.Local).AddTicks(6484), 3 }
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
                name: "IX_Conversations_LearningRouteId",
                table: "Conversations",
                column: "LearningRouteId");

            migrationBuilder.CreateIndex(
                name: "IX_Conversations_StudentId",
                table: "Conversations",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Conversations_TeacherId",
                table: "Conversations",
                column: "TeacherId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_ConversationId",
                table: "Messages",
                column: "ConversationId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_UserId",
                table: "Messages",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ModuleEVLs_ModuleId",
                table: "ModuleEVLs",
                column: "ModuleId");

            migrationBuilder.CreateIndex(
                name: "IX_ModuleProgresses_ModuleId",
                table: "ModuleProgresses",
                column: "ModuleId");

            migrationBuilder.CreateIndex(
                name: "IX_ModuleProgresses_UserId",
                table: "ModuleProgresses",
                column: "UserId");

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

            migrationBuilder.CreateIndex(
                name: "IX_User_RoleId",
                table: "User",
                column: "RoleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Cohorts");

            migrationBuilder.DropTable(
                name: "CompletedEvls");

            migrationBuilder.DropTable(
                name: "Messages");

            migrationBuilder.DropTable(
                name: "Oers");

            migrationBuilder.DropTable(
                name: "Requirements");

            migrationBuilder.DropTable(
                name: "Semesters");

            migrationBuilder.DropTable(
                name: "ModuleEVLs");

            migrationBuilder.DropTable(
                name: "ModuleProgresses");

            migrationBuilder.DropTable(
                name: "Conversations");

            migrationBuilder.DropTable(
                name: "Modules");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "GraduateProfiles");

            migrationBuilder.DropTable(
                name: "LearningRoutes");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}
