using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace LOM.API.Migrations
{
    /// <inheritdoc />
    public partial class RoleId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "CompletedEvls",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "CompletedEvls",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "CompletedEvls",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 30);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 31);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 32);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 33);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 34);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 35);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 36);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 37);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 38);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 39);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 40);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 41);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 42);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 43);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 44);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 45);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "ModuleEVLs",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "ModuleProgresses",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "ModuleProgresses",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.AddColumn<int>(
                name: "RoleId",
                table: "User",
                type: "int",
                nullable: false,
                defaultValue: 0);

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

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 1,
                column: "StartDate",
                value: new DateTime(2025, 5, 25, 13, 14, 24, 868, DateTimeKind.Local).AddTicks(6529));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 2,
                column: "StartDate",
                value: new DateTime(2026, 5, 25, 13, 14, 24, 868, DateTimeKind.Local).AddTicks(6575));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 3,
                column: "StartDate",
                value: new DateTime(2027, 5, 25, 13, 14, 24, 868, DateTimeKind.Local).AddTicks(6579));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 4,
                column: "StartDate",
                value: new DateTime(2024, 5, 25, 13, 14, 24, 868, DateTimeKind.Local).AddTicks(6580));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 5,
                column: "StartDate",
                value: new DateTime(2023, 5, 25, 13, 14, 24, 868, DateTimeKind.Local).AddTicks(6582));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 6,
                column: "StartDate",
                value: new DateTime(2022, 5, 25, 13, 14, 24, 868, DateTimeKind.Local).AddTicks(6583));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 7,
                column: "StartDate",
                value: new DateTime(2021, 5, 25, 13, 14, 24, 868, DateTimeKind.Local).AddTicks(6585));

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
                table: "Roles",
                columns: new[] { "Id", "RoleName" },
                values: new object[,]
                {
                    { 1, "Teacher" },
                    { 2, "Student" }
                });

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: 1,
                column: "RoleId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "User",
                keyColumn: "Id",
                keyValue: 2,
                column: "RoleId",
                value: 2);

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "ExternalID", "FirstName", "LastName", "LearningRouteId", "RoleId", "StartYear" },
                values: new object[] { 3, "Test54321", "Begeleider", "Begeleider", null, 1, 0 });

            migrationBuilder.InsertData(
                table: "Conversations",
                columns: new[] { "Id", "LearningRouteId", "StudentId", "TeacherId" },
                values: new object[] { 1, 1, 1, 3 });

            migrationBuilder.InsertData(
                table: "Messages",
                columns: new[] { "Id", "Commentary", "ConversationId", "DateTime", "UserId" },
                values: new object[,]
                {
                    { 1, "Hoi, mag ik een feedback krijgen op mijn leerroute?", 1, new DateTime(2025, 5, 25, 13, 14, 24, 868, DateTimeKind.Local).AddTicks(7892), 1 },
                    { 2, "Ik zou semester 2 van het jaar 2 aanpassen naar iets anders.", 1, new DateTime(2025, 5, 25, 13, 14, 24, 868, DateTimeKind.Local).AddTicks(7897), 3 },
                    { 3, "Hoi, Ik heb het aangepast", 1, new DateTime(2025, 5, 25, 13, 14, 24, 868, DateTimeKind.Local).AddTicks(7898), 1 },
                    { 4, "Leerroute ziet er goed uit!", 1, new DateTime(2025, 5, 25, 13, 14, 24, 868, DateTimeKind.Local).AddTicks(7900), 3 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_User_RoleId",
                table: "User",
                column: "RoleId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_User_Roles_RoleId",
                table: "User",
                column: "RoleId",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_User_Roles_RoleId",
                table: "User");

            migrationBuilder.DropTable(
                name: "Messages");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Conversations");

            migrationBuilder.DropIndex(
                name: "IX_User_RoleId",
                table: "User");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DropColumn(
                name: "RoleId",
                table: "User");

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
                table: "CompletedEvls",
                columns: new[] { "Id", "ModuleEvlId", "ModuleProgressId" },
                values: new object[,]
                {
                    { 1, 1, 1 },
                    { 2, 2, 1 },
                    { 3, 3, 2 }
                });
        }
    }
}
