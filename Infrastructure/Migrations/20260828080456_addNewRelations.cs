using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addNewRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SkillsId",
                table: "subskills",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AlterColumn<string>(
                name: "BackgroundColor",
                table: "skillboard",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<Guid>(
                name: "SubSkillsId",
                table: "progressentries",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_subskills_SkillsId",
                table: "subskills",
                column: "SkillsId");

            migrationBuilder.CreateIndex(
                name: "IX_progressentries_SubSkillsId",
                table: "progressentries",
                column: "SubSkillsId");

            migrationBuilder.AddForeignKey(
                name: "FK_progressentries_subskills_SubSkillsId",
                table: "progressentries",
                column: "SubSkillsId",
                principalTable: "subskills",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_subskills_skills_SkillsId",
                table: "subskills",
                column: "SkillsId",
                principalTable: "skills",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_progressentries_subskills_SubSkillsId",
                table: "progressentries");

            migrationBuilder.DropForeignKey(
                name: "FK_subskills_skills_SkillsId",
                table: "subskills");

            migrationBuilder.DropIndex(
                name: "IX_subskills_SkillsId",
                table: "subskills");

            migrationBuilder.DropIndex(
                name: "IX_progressentries_SubSkillsId",
                table: "progressentries");

            migrationBuilder.DropColumn(
                name: "SkillsId",
                table: "subskills");

            migrationBuilder.DropColumn(
                name: "SubSkillsId",
                table: "progressentries");

            migrationBuilder.AlterColumn<string>(
                name: "BackgroundColor",
                table: "skillboard",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
