using Domain;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Infrastructure.Extensions
{
    public static class SkillExtension
    {
        //get lookup by skill id 
        public static IQueryable<Skills> GetById(this IQueryable<Skills> query, Guid skillId) => query.Where(q => q.Id == skillId);

        //fetch all skills for given tree  (used when rendering the board)
        //public static async Task<List<Skills>> GetAllSkillsAsync(this ISkillTreeDbContext db, Guid sbId, CancellationToken ct = default)
        //{
        //    if (db == null) throw new ArgumentNullException(nameof(db));

        //    var skillIdsQuery = db.SkillConnections
        //        .Where(sc => sc.SkillBoradId == sbId)
        //        .SelectMany(sc => new[] { sc.FromSkillId, sc.ToSkillId }).Distinct();

        //    return await db.Skills
        //        .Where(s => skillIdsQuery
        //        .Contains(s.Id))
        //        .ToListAsync(ct);
        //}

        //fetch single skill with its subskills orded by sequence
        public static IQueryable<Skills> GetByIdWithSubSkill(this IQueryable<Skills> query, Guid skillId) => query.Where(s => s.Id == skillId)
            .Include(s => s.SubSkills.OrderBy(s => s.OrderIndex));


        //GetAllByTreeId — fetches all skills belonging to a tree.Used when rendering the board.Needs position, colour, shape and size but not the full subskill details yet.

        //GetByIdWithSubSkills — fetches one skill and includes all its subskills.Used when the user opens the skill detail panel. This is where RequiredSubSkillCount becomes relevant because you're showing progress.

        //GetById — same pattern as SkillTree — just the skill itself, no includes. Used for existence and ownership checks before updates or deletes.

        //GetPrerequisites — fetches all skills that are connected as prerequisites to a given skill via SkillConnections.Used by your SkillStatusService to determine if a skill should be locked or unlocked.This one is important because without it your status computation has to do extra work.

        //GetDownstream — fetches all skills that a given skill unlocks. Used when a skill gets completed, so you know which skills to recheck status on.Without this you'd have to recheck the entire tree every time anything changes.
    }
}
