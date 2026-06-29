using Domain;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public interface ISkillTreeDbContext
    {
        DbSet<SkillBorad> SkillBoard { get; set; }
        DbSet<Skills> Skills { get; set; }
        DbSet<ProgressEntries> ProgressEntries { get; set; }
        DbSet<SkillConnections> SkillConnections { get; set; }
        DbSet<SubSkills> SubSkills { get; set; }
        DbSet<User> User { get; set; }
    }


    public class SkillDbContext : DbContext, ISkillTreeDbContext
    {
        public SkillDbContext(DbContextOptions<SkillDbContext> options) : base(options)
        {

        }

        public DbSet<SkillBorad> SkillBoard { get; set; }
        public DbSet<Skills> Skills { get; set; }
        public DbSet<ProgressEntries> ProgressEntries { get; set; }
        public DbSet<SkillConnections> SkillConnections { get; set; }
        public DbSet<SubSkills> SubSkills { get; set; }
        public DbSet<User> User { get; set; }
    }
}
