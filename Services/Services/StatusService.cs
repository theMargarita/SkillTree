using Domain;
using Services.IServices;

namespace Services.Services
{
    public class StatusService : IStatusService
    {
        public Dictionary<Guid, SkillStatus> ComputeStatuses(IEnumerable<Skills> skills, IEnumerable<SkillConnections> connections, IReadOnlyDictionary<Guid, int> completedSubSkillCounts)
        {
            var skillList = skills.ToList();

            //pass 1
            //a skills lock state depends on whether other skills are completed
            var isComplete = skillList.ToDictionary(
                s => s.Id,
                s => completedSubSkillCounts.GetValueOrDefault(
                    s.Id, 0) >= s.RequiredSubSkillCount);

            //group connections by their target once (instead of the full connection list per skill)
            var incomingByTarget = connections
                .GroupBy(c => c.ToSkillId)
                .ToDictionary(g => g.Key, g => g.Select(c => c.FromSkillId).ToList());
        }
    }
}
