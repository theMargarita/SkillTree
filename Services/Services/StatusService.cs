using Domain;
using Services.IServices;

namespace Services.Services
{
    public class StatusService : IStatusService
    {
        public Dictionary<Guid, SkillStatus> ComputeStatuses(IEnumerable<Skills> skills, IEnumerable<SkillConnections> connections, IReadOnlyDictionary<Guid, int> completedSubSkillCounts)
        {
            throw new NotImplementedException();
        }
    }
}
