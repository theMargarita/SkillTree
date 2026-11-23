using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class initNewMigrationForPostgreSQL : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "skillboard",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    BackgroundColor = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_skillboard", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "user",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserName = table.Column<string>(type: "text", nullable: false),
                    UserEmail = table.Column<string>(type: "text", nullable: false),
                    HashPassword = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "skills",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SkillBoardId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: true),
                    PositionX = table.Column<decimal>(type: "numeric", nullable: false),
                    PositionY = table.Column<decimal>(type: "numeric", nullable: false),
                    Color = table.Column<string>(type: "text", nullable: true),
                    Icon = table.Column<string>(type: "text", nullable: true),
                    Shape = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_skills", x => x.Id);
                    table.ForeignKey(
                        name: "FK_skills_skillboard_SkillBoardId",
                        column: x => x.SkillBoardId,
                        principalTable: "skillboard",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "skillconnections",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SkillBoardId = table.Column<Guid>(type: "uuid", nullable: false),
                    FromSkillId = table.Column<Guid>(type: "uuid", nullable: false),
                    ToSkillId = table.Column<Guid>(type: "uuid", nullable: false),
                    LineColor = table.Column<string>(type: "text", nullable: true),
                    LineStyle = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_skillconnections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_skillconnections_skillboard_SkillBoardId",
                        column: x => x.SkillBoardId,
                        principalTable: "skillboard",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_skillconnections_skills_FromSkillId",
                        column: x => x.FromSkillId,
                        principalTable: "skills",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_skillconnections_skills_ToSkillId",
                        column: x => x.ToSkillId,
                        principalTable: "skills",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "subskills",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SkillsId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    ProgressURL = table.Column<string>(type: "text", nullable: true),
                    ProgressText = table.Column<string>(type: "text", nullable: true),
                    OrderIndex = table.Column<int>(type: "integer", nullable: false),
                    Color = table.Column<string>(type: "text", nullable: true),
                    IsComplete = table.Column<bool>(type: "boolean", nullable: false),
                    CompletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_subskills", x => x.Id);
                    table.ForeignKey(
                        name: "FK_subskills_skills_SkillsId",
                        column: x => x.SkillsId,
                        principalTable: "skills",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "progressentries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SubSkillId = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: true),
                    ImageUrl = table.Column<string>(type: "text", nullable: true),
                    ContentText = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_progressentries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_progressentries_subskills_SubSkillId",
                        column: x => x.SubSkillId,
                        principalTable: "subskills",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_progressentries_SubSkillId",
                table: "progressentries",
                column: "SubSkillId");

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
                name: "IX_skills_SkillBoardId",
                table: "skills",
                column: "SkillBoardId");

            migrationBuilder.CreateIndex(
                name: "IX_subskills_SkillsId",
                table: "subskills",
                column: "SkillsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "progressentries");

            migrationBuilder.DropTable(
                name: "skillconnections");

            migrationBuilder.DropTable(
                name: "user");

            migrationBuilder.DropTable(
                name: "subskills");

            migrationBuilder.DropTable(
                name: "skills");

            migrationBuilder.DropTable(
                name: "skillboard");
        }
    }
}
