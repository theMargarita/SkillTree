using Domain;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Extensions
{
    public static class SkillExtension
    {
        //GetByTree — fetch all skills for a given tree (used when rendering the board)
        public static IQueryable<Skills> GetSkillTreeById(this IQueryable<Skills> query, Guid id) => query.Where(q => q.Id == id);

        //fetch all skills for given tree  (used when rendering the board)
        //GetById — fetch a single skill with its subskills loaded
        public static async Task<List<Skills>> GetAllSkills(this ISkillTreeDbContext db, Guid sbId, CancellationToken ct = default)
        {
            if (db == null) throw new ArgumentNullException(nameof(db));

            var skillIdsQuery = db.SkillConnections
                .Where(sc => sc.SkillBoradId == sbId)
                .SelectMany(sc => new[] { sc.FromSkillId, sc.ToSkillId }).Distinct();

            return await db.Skills
                .Where(s => skillIdsQuery
                .Contains(s.Id))
                .ToListAsync(ct);
        }
        //GetStatus — your key computed method. Takes a skillId, returns Locked / InProgress / Completed based on prerequisites and subskill completion count. This is the heart of your logic and should be called any time the board renders

        //public static async Task<List<Skills>> GetSkillStatus(this ISkillTreeDbContext db, Guid id, CancellationToken ct)
        //{
        //    if (db == null) throw new ArgumentNullException( nameof(db));

        //    var skillId = db.SkillConnections.SelectMany(s => s.)
        //        .Where(s => s.Id == id).FirstOrDefault();  
        //}
    }
}

/*
Create — add a skill to a tree, including position, color, shape, required subskill count
Update — update any styling, position (drag/drop), name, description, summary text/photo
Delete — remove a skill and its subskills, connections and progress entries
 */