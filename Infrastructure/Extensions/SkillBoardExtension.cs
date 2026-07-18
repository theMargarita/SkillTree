using Domain;
using System.Linq;

namespace Infrastructure.Extensions
{
    public static class SkillBoardExtension
    {
        public static IQueryable<SkillBoard> GetAllUserSkillTrees(this IQueryable<SkillBoard> query, Guid userId) => query.Where(s => s.UserId == userId);

        public static IQueryable<SkillBoard> GetTreeById(this IQueryable<SkillBoard> query, Guid id) => query.Where(i => i.Id == id);
    }
    /*
     GetAllForUser — fetch all trees belonging to the logged in user
    GetById — fetch a single tree with its skills and connections loaded
    Create — create a new tree for a user
    Update — update name, description, background color
    Delete — delete a tree and cascade everything under it (skills, subskills, connections, progress entries)
     */

}
