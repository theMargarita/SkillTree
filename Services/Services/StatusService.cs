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

            //pass 2
            //decide status per skill
            var statuses = new Dictionary<Guid, SkillStatus>();
            foreach ( var skill in skills )
            {
                if (isComplete[skill.Id])
                {
                    statuses[skill.Id] = SkillStatus.Completed;
                    continue;
                }

                var prerequistes = incomingByTarget.GetValueOrDefault(skill.Id, new List<Guid>());

                //a prerequisite id missing from iscomplete is treated as not complete - stays locked
                var unlock = prerequistes.Count == 0 || prerequistes.All(p => isComplete.GetValueOrDefault(p, false));

                statuses[skill.Id] = unlock ? SkillStatus.Unlocked : SkillStatus.Locked;
            }

            return statuses;
        }
    }
}
