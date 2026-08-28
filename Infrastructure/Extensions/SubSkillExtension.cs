using Domain;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Extensions
{
    public static class SubSkillExtension
    {
        //fetches all subskills belonging to a parent skill, ordered by sequence index
        public static IQueryable<SubSkills> GetAllBySkillId(this IQueryable<SubSkills> query, Guid skillId) => query
            .Where(x => x.SkillId == skillId)
            .OrderBy(s => s.OrderIndex);

        //fetches only completed subskills for a parent skill
        public static IQueryable<SubSkills> GetCompletedBySkillId(this IQueryable<SubSkills> query, Guid skillId) => query.Where(x => x.SkillId == skillId && x.IsComplete);

        //fetches a single subskill by id and eagerly loads its progress entires orded by date
        public static IQueryable<SubSkills> GetByIdWithProgressEntries(IQueryable<SubSkills> query, Guid subskillId) => query.Where(s => s.Id == subskillId)
            .Include(x => x.ProgressEntries.OrderByDescending(p => p.CreatedAt));

        //GetByIdBasic — again just for existence and ownership checks before writes.
        public static IQueryable<SubSkills> GetByIdBasic(this IQueryable<SubSkills> query, Guid subskillId) => query.Where(s => s.Id == subskillId);
    }
}
