using Domain;
using System.Linq;

namespace Infrastructure.Extensions
{
    public static class SkillBoardExtension
    {
        public static IQueryable<SkillBorad> GetAllUserSkillTrees(this IQueryable<SkillBorad> query) => query.Where(s => s.)
    }
}
