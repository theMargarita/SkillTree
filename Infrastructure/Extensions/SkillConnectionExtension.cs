using Domain;

namespace Infrastructure.Extensions
{
    public static class SkillConnectionExtension
    {
        //fetches all connections for a board - used when rendering the board
        public static IQueryable<SkillConnections> GetAllByBoardId(this IQueryable<SkillConnections> query, Guid boardId) =>
            query.Where(c => c.SkillBoardId == boardId);

        //fetches all connections where ToSkillId matches a given skill.
        //i.e. what must be completed before this skill unlocks.
        //Used by SkillStatusService.
        public static IQueryable<SkillConnections> GetIncomingBySkillId(this IQueryable<SkillConnections> query, Guid skillId) =>
            query.Where(c => c.ToSkillId == skillId);

        //fetches all connections where FromSkillId matches a given skill.
        //i.e. what this skill unlocks.
        //Used when a skill completes, to know which skills to recheck.
        public static IQueryable<SkillConnections> GetOutgoingBySkillId(this IQueryable<SkillConnections> query, Guid skillId) =>
            query.Where(c => c.FromSkillId == skillId);

        //true/false check for whether a connection already exists between
        //two specific skills, in either direction. Used to block duplicate
        //connections when creating a new one.
        public static IQueryable<SkillConnections> WhereConnects(this IQueryable<SkillConnections> query, Guid fromSkillId, Guid toSkillId) =>
            query.Where(c =>
                (c.FromSkillId == fromSkillId && c.ToSkillId == toSkillId) ||
                (c.FromSkillId == toSkillId && c.ToSkillId == fromSkillId));
    }
}