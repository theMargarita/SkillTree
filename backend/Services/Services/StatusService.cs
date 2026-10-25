using Domain;
using Infrastructure.Extensions;
using Services.IServices;
using static Infrastructure.Dtos.ProgressEntry.StatusEnum;

namespace Services.Services
{
    public class StatusService : IStatusService
    {
        public Dictionary<Guid, SkillStatus> ComputeStatuses(
            IEnumerable<Skills> skills,
            IEnumerable<SkillConnections> connections,
            IReadOnlyDictionary<Guid, SkillSubSkillCounts> counts)
        {
            var skillList = skills.ToList();

            var isComplete = skillList.ToDictionary(
                s => s.Id,
                s => counts.TryGetValue(s.Id, out var c)
                     && c.TotalCount > 0
                     && c.CompletedCount >= c.TotalCount);

            var incomingByTarget = connections
                .GroupBy(c => c.ToSkillId)
                .ToDictionary(g => g.Key, g => g.Select(c => c.FromSkillId).ToList());

            // pass 2: decide status per skill
            var statuses = new Dictionary<Guid, SkillStatus>();
            foreach (var skill in skillList)
            {
                if (isComplete[skill.Id])
                {
                    statuses[skill.Id] = SkillStatus.Completed;
                    continue;
                }

                var prerequisites = incomingByTarget.GetValueOrDefault(skill.Id, new List<Guid>());

                var unlock = prerequisites.Count == 0
                             || prerequisites.All(p => isComplete.GetValueOrDefault(p, false));

                statuses[skill.Id] = unlock ? SkillStatus.Unlocked : SkillStatus.Locked;
            }

            return statuses;
        }
    }
}