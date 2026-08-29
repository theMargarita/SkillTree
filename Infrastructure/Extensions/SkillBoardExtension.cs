using Domain;

namespace Infrastructure.Extensions
{
    public static class SkillBoardExtension
    {
        public static IQueryable<SkillBoard> GetAllUserSkillTrees(this IQueryable<SkillBoard> query, Guid userId) => query.Where(s => s.UserId == userId);

        public static IQueryable<SkillBoard> GetTreeById(this IQueryable<SkillBoard> query, Guid id) => query.Where(i => i.Id == id);
    }
    

     //GetAllForUser — fetch all trees belonging to the logged in user
    //    GetAllByUserId — filters trees by the logged in user.You need this because a user should never see another user's trees. Loads basic tree properties only, no deep includes. Used on the dashboard.

    //GetByIdWithSkills — fetches one tree and includes its skills and connections.Used when opening the board.Needs the connections too because you need to draw the lines between nodes.

    //GetById — fetches just the tree itself with no related data.Used when you just need to verify the tree exists and belongs to the current user before doing something to it, like updating its name or deleting it.
}
