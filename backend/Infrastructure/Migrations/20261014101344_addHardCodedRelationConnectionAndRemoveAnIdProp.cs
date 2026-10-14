using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addHardCodedRelationConnectionAndRemoveAnIdProp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_progressentries_subskills_SubSkillsId",
                table: "progressentries");

            migrationBuilder.DropIndex(
                name: "IX_progressentries_SubSkillsId",
                table: "progressentries");

            migrationBuilder.DropColumn(
                name: "SkillsId",
                table: "skillboard");

            migrationBuilder.DropColumn(
                name: "SubSkillsId",
                table: "progressentries");

            migrationBuilder.CreateIndex(
                name: "IX_skillconnections_FromSkillId",
                table: "skillconnections",
                column: "FromSkillId");

            migrationBuilder.CreateIndex(
                name: "IX_skillconnections_SkillBoardId",
                table: "skillconnections",
                column: "SkillBoardId");

            migrationBuilder.CreateIndex(
                name: "IX_skillconnections_ToSkillId",
                table: "skillconnections",
                column: "ToSkillId");

            migrationBuilder.CreateIndex(
                name: "IX_progressentries_SubSkillId",
                table: "progressentries",
                column: "SubSkillId");

            migrationBuilder.AddForeignKey(
                name: "FK_progressentries_subskills_SubSkillId",
                table: "progressentries",
                column: "SubSkillId",
                principalTable: "subskills",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_skillconnections_skillboard_SkillBoardId",
                table: "skillconnections",
                column: "SkillBoardId",
                principalTable: "skillboard",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_skillconnections_skills_FromSkillId",
                table: "skillconnections",
                column: "FromSkillId",
                principalTable: "skills",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_skillconnections_skills_ToSkillId",
                table: "skillconnections",
                column: "ToSkillId",
                principalTable: "skills",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_progressentries_subskills_SubSkillId",
                table: "progressentries");

            migrationBuilder.DropForeignKey(
                name: "FK_skillconnections_skillboard_SkillBoardId",
                table: "skillconnections");

            migrationBuilder.DropForeignKey(
                name: "FK_skillconnections_skills_FromSkillId",
                table: "skillconnections");

            migrationBuilder.DropForeignKey(
                name: "FK_skillconnections_skills_ToSkillId",
                table: "skillconnections");

            migrationBuilder.DropIndex(
                name: "IX_skillconnections_FromSkillId",
                table: "skillconnections");

            migrationBuilder.DropIndex(
                name: "IX_skillconnections_SkillBoardId",
                table: "skillconnections");

            migrationBuilder.DropIndex(
                name: "IX_skillconnections_ToSkillId",
                table: "skillconnections");

            migrationBuilder.DropIndex(
                name: "IX_progressentries_SubSkillId",
                table: "progressentries");

            migrationBuilder.AddColumn<Guid>(
                name: "SkillsId",
                table: "skillboard",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "SubSkillsId",
                table: "progressentries",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

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
        }
    }
}
