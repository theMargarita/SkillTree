using Domain;
using Infrastructure.Data;
using Microsoft.Azure.Search.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Extensions
{
    public static class SkillExtension
    {
        //GetByTree — fetch all skills for a given tree (used when rendering the board)
        public static IQueryable<Skills> GetSkillTreeById(this IQueryable<Skills> query, Guid id) => query.Where(q => q.Id == id);

        //fetch all skills for given tree  (used when rendering the board)
        //GetById — fetch a single skill with its subskills loaded
        public static async Task<List<Skills>> GetAllSkillsAsync(this ISkillTreeDbContext db, Guid sbId, CancellationToken ct = default)
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


        //GetAllByTreeId — fetches all skills belonging to a tree.Used when rendering the board.Needs position, colour, shape and size but not the full subskill details yet.

        //GetByIdWithSubSkills — fetches one skill and includes all its subskills.Used when the user opens the skill detail panel. This is where RequiredSubSkillCount becomes relevant because you're showing progress.

        //GetByIdBasic — same pattern as SkillTree — just the skill itself, no includes. Used for existence and ownership checks before updates or deletes.

        //GetPrerequisites — fetches all skills that are connected as prerequisites to a given skill via SkillConnections.Used by your SkillStatusService to determine if a skill should be locked or unlocked.This one is important because without it your status computation has to do extra work.

        //GetDownstream — fetches all skills that a given skill unlocks. Used when a skill gets completed, so you know which skills to recheck status on.Without this you'd have to recheck the entire tree every time anything changes.
    }
}
