using Domain;
using static Infrastructure.Dtos.ProgressEntry.StatusEnum;

namespace Services.IServices
{
    public interface IStatusService
    {
        Dictionary<Guid, SkillStatus> ComputeStatuses(
            IEnumerable<Skills> skills,
            IEnumerable<SkillConnections> connections,
            IReadOnlyDictionary<Guid, int> completedSubSkillCounts);
    }
    
}
