using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LOM.API.Migrations
{
    /// <inheritdoc />
    public partial class tabelrleationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Conversations_User_TeacherId",
                table: "Conversations");

            migrationBuilder.DropForeignKey(
                name: "FK_User_LearningRoutes_LearningRouteId",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_User_LearningRouteId",
                table: "User");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "Modules",
                type: "varchar(255)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "LearningRoutes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "TeacherId",
                table: "Conversations",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 1,
                column: "StartDate",
                value: new DateTime(2025, 5, 30, 11, 16, 56, 756, DateTimeKind.Local).AddTicks(2644));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 2,
                column: "StartDate",
                value: new DateTime(2026, 5, 30, 11, 16, 56, 756, DateTimeKind.Local).AddTicks(2737));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 3,
                column: "StartDate",
                value: new DateTime(2027, 5, 30, 11, 16, 56, 756, DateTimeKind.Local).AddTicks(2746));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 4,
                column: "StartDate",
                value: new DateTime(2024, 5, 30, 11, 16, 56, 756, DateTimeKind.Local).AddTicks(2750));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 5,
                column: "StartDate",
                value: new DateTime(2023, 5, 30, 11, 16, 56, 756, DateTimeKind.Local).AddTicks(2755));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 6,
                column: "StartDate",
                value: new DateTime(2022, 5, 30, 11, 16, 56, 756, DateTimeKind.Local).AddTicks(2758));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 7,
                column: "StartDate",
                value: new DateTime(2021, 5, 30, 11, 16, 56, 756, DateTimeKind.Local).AddTicks(2761));

            migrationBuilder.InsertData(
                table: "GraduateProfiles",
                columns: new[] { "Id", "ColorCode", "Name" },
                values: new object[] { 4, "#4594D3A3", "Geen" });

            migrationBuilder.UpdateData(
                table: "LearningRoutes",
                keyColumn: "Id",
                keyValue: 1,
                column: "UserId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "DateTime",
                value: new DateTime(2025, 5, 30, 11, 16, 57, 203, DateTimeKind.Local).AddTicks(8426));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "DateTime",
                value: new DateTime(2025, 5, 30, 11, 16, 57, 203, DateTimeKind.Local).AddTicks(8465));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "DateTime",
                value: new DateTime(2025, 5, 30, 11, 16, 57, 203, DateTimeKind.Local).AddTicks(8469));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 4,
                column: "DateTime",
                value: new DateTime(2025, 5, 30, 11, 16, 57, 203, DateTimeKind.Local).AddTicks(8472));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                column: "RoleName",
                value: "Administrator");

            migrationBuilder.CreateIndex(
                name: "IX_Modules_Code",
                table: "Modules",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LearningRoutes_UserId",
                table: "LearningRoutes",
                column: "UserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Conversations_User_TeacherId",
                table: "Conversations",
                column: "TeacherId",
                principalTable: "User",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_LearningRoutes_User_UserId",
                table: "LearningRoutes",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Conversations_User_TeacherId",
                table: "Conversations");

            migrationBuilder.DropForeignKey(
                name: "FK_LearningRoutes_User_UserId",
                table: "LearningRoutes");

            migrationBuilder.DropIndex(
                name: "IX_Modules_Code",
                table: "Modules");

            migrationBuilder.DropIndex(
                name: "IX_LearningRoutes_UserId",
                table: "LearningRoutes");

            migrationBuilder.DeleteData(
                table: "GraduateProfiles",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "LearningRoutes");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "Modules",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<int>(
                name: "TeacherId",
                table: "Conversations",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 1,
                column: "StartDate",
                value: new DateTime(2025, 5, 25, 17, 23, 24, 373, DateTimeKind.Local).AddTicks(4435));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 2,
                column: "StartDate",
                value: new DateTime(2026, 5, 25, 17, 23, 24, 373, DateTimeKind.Local).AddTicks(4487));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 3,
                column: "StartDate",
                value: new DateTime(2027, 5, 25, 17, 23, 24, 373, DateTimeKind.Local).AddTicks(4495));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 4,
                column: "StartDate",
                value: new DateTime(2024, 5, 25, 17, 23, 24, 373, DateTimeKind.Local).AddTicks(4498));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 5,
                column: "StartDate",
                value: new DateTime(2023, 5, 25, 17, 23, 24, 373, DateTimeKind.Local).AddTicks(4500));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 6,
                column: "StartDate",
                value: new DateTime(2022, 5, 25, 17, 23, 24, 373, DateTimeKind.Local).AddTicks(4502));

            migrationBuilder.UpdateData(
                table: "Cohorts",
                keyColumn: "Id",
                keyValue: 7,
                column: "StartDate",
                value: new DateTime(2021, 5, 25, 17, 23, 24, 373, DateTimeKind.Local).AddTicks(4504));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "DateTime",
                value: new DateTime(2025, 5, 25, 17, 23, 24, 373, DateTimeKind.Local).AddTicks(6474));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "DateTime",
                value: new DateTime(2025, 5, 25, 17, 23, 24, 373, DateTimeKind.Local).AddTicks(6479));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3,
                column: "DateTime",
                value: new DateTime(2025, 5, 25, 17, 23, 24, 373, DateTimeKind.Local).AddTicks(6482));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 4,
                column: "DateTime",
                value: new DateTime(2025, 5, 25, 17, 23, 24, 373, DateTimeKind.Local).AddTicks(6484));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                column: "RoleName",
                value: "Teacher");

            migrationBuilder.CreateIndex(
                name: "IX_User_LearningRouteId",
                table: "User",
                column: "LearningRouteId");

            migrationBuilder.AddForeignKey(
                name: "FK_Conversations_User_TeacherId",
                table: "Conversations",
                column: "TeacherId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_User_LearningRoutes_LearningRouteId",
                table: "User",
                column: "LearningRouteId",
                principalTable: "LearningRoutes",
                principalColumn: "Id");
        }
    }
}
