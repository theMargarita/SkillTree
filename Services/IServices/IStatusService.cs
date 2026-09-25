using Domain;

namespace Services.IServices
{
    public interface IStatusService
    {
        Dictionary<Guid, SkillStatus> ComputeStatuses(
            IEnumerable<Skills> skills,
            IEnumerable<SkillConnections> connections,
            IReadOnlyDictionary<Guid, int> completedSubSkillCounts);
    }
    public enum SkillStatus
    {
        Locked,
        Unlocked,
        Completed
    }
}
