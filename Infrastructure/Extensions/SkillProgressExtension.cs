namespace Infrastructure.Extensions
{
    public class SkillProgressExtension
    {
        //GetAllBySubSkillId — fetches all progress entries for a subskill ordered by CreatedAt ascending, so you see the oldest proof first and the newest last.This gives the chronological growth view you described wanting.

        //GetLatestBySubSkillId — fetches only the most recent progress entry for a subskill. Useful for showing a quick preview in the skill detail panel without loading the entire history.

        //GetAllBySkillId — fetches all progress entries across all subskills of a given skill.Used for the full skill-level growth view — seeing everything you've done across all the subskills in one timeline.
    }
}
