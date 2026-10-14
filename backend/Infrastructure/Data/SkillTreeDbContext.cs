using Domain;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public interface ISkillTreeDbContext
    {
        //private
        DbSet<SkillBoard> SkillBoard { get; set; }
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
        public DbSet<SkillBoard> SkillBoard { get; set; }
        public DbSet<Skills> Skills { get; set; }
        public DbSet<ProgressEntries> ProgressEntries { get; set; }
        public DbSet<SkillConnections> SkillConnections { get; set; }
        public DbSet<SubSkills> SubSkills { get; set; }
        public DbSet<User> User { get; set; }

        //to "default" to cascade delete behavior
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            foreach (var fk in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                //removes a parent entity automatically triggers deletion of its related child
                fk.DeleteBehavior = DeleteBehavior.Cascade;
            }

            foreach(var e in modelBuilder.Model.GetEntityTypes())
            {
                e.SetTableName(e.GetTableName()!.ToLower());
            }

            modelBuilder.Entity<SkillBoard>()
               .HasMany(b => b.Skills)
               .WithOne()
               .HasForeignKey(s => s.SkillBoardId)
               .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SkillConnections>(e =>
            {
                e.HasOne<SkillBoard>().WithMany().HasForeignKey(c => c.SkillBoardId).OnDelete(DeleteBehavior.Cascade);
                e.HasOne<Skills>().WithMany().HasForeignKey(c => c.FromSkillId).OnDelete(DeleteBehavior.NoAction);
                e.HasOne<Skills>().WithMany().HasForeignKey(c => c.ToSkillId).OnDelete(DeleteBehavior.NoAction);
            });

            modelBuilder.Entity<SubSkills>()
                .HasOne(s => s.Skills).WithMany(s => s.SubSkills)
                .HasForeignKey(s => s.SkillsId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProgressEntries>()
                .HasOne(p => p.SubSkills).WithMany(s => s.ProgressEntries)
                .HasForeignKey(p => p.SubSkillId)
                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

        }
    }
}
