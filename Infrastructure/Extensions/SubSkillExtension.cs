namespace Infrastructure.Extensions
{
    public class SubSkillExtension
    {


        //GetAllBySkillId — fetches all subskills for a given skill ordered by OrderIndex.Used in the skill detail panel to show the list of things to complete. Ordering matters here because the user defined a sequence.

        //GetCompletedBySkillId — fetches only the completed subskills for a skill. Used by SkillStatusService when computing whether a skill's RequiredSubSkillCount has been reached. You only need the count really, but having the extension lets you reuse it cleanly.

        //GetByIdWithProgressEntries — fetches one subskill and includes all its progress entries ordered by date. Used when the user opens a specific subskill to review their proof and journal entries.This is your "growth view" for that subskill.

        //GetByIdBasic — again just for existence and ownership checks before writes.
    }
}
