using Domain;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Extensions
{
    public static class SkillExtension
    {
        public static IQueryable<Skills> GetById(this IQueryable<Skills> query, Guid skillId) => query.Where(q => q.Id == skillId);

        //fetch all skills belonging to a board (used when rendering the board).
        public static IQueryable<Skills> GetAllByBoardId(this IQueryable<Skills> query, Guid boardId) =>
            query.Where(s => s.SkillBoardId == boardId);

        //fetch single skill with its subskills orded by sequence
        public static IQueryable<Skills> GetByIdWithSubSkill(this IQueryable<Skills> query, Guid skillId) => query.Where(s => s.Id == skillId)
            .Include(s => s.SubSkills.OrderBy(s => s.OrderIndex));
    }
}