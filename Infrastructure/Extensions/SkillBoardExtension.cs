using Domain;
using System.Linq;

namespace Infrastructure.Extensions
{
    public static class SkillBoardExtension
    {
        public static IQueryable<SkillBoard> GetAllUserSkillTrees(this IQueryable<SkillBoard> query, Guid userId) => query.Where(s => s.UserId == userId);

        public static IQueryable<SkillBoard> GetTreeById(this IQueryable<SkillBoard> query, Guid id) => query.Where(i => i.Id == id);
    }

  
}
