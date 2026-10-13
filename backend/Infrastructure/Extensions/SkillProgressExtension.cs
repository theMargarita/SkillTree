using Domain;

namespace Infrastructure.Extensions
{
    public static class SkillProgressExtension
    {
        // fetches all progress entries for a subskill, oldest first - the
        // chronological "growth view": see the first proof through to the latest.
        public static IQueryable<ProgressEntries> GetAllBySubSkillId(this IQueryable<ProgressEntries> query, Guid subSkillId) =>
            query
                .Where(p => p.SubSkillId == subSkillId)
                .OrderBy(p => p.CreatedAt);

        // fetches only the most recent entry - for a quick preview without
        // loading the whole history (e.g. a thumbnail on the skill node).
        public static IQueryable<ProgressEntries> GetLatestBySubSkillId(this IQueryable<ProgressEntries> query, Guid subSkillId) =>
            query
                .Where(p => p.SubSkillId == subSkillId)
                .OrderByDescending(p => p.CreatedAt)
                .Take(1);
    }
}
