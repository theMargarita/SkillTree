namespace Infrastructure.Extensions
{
    internal class SkillConnectionExtension
    {
        //GetAllByTreeId — fetches all connections for a tree.Used when rendering the board so you can draw all the lines.Needs line colour and style too since those are visual properties.

        //GetIncomingBySkillId — fetches all connections where ToSkillId matches a given skill.In other words, what skills must be completed before this one unlocks. Used heavily by SkillStatusService.

        //GetOutgoingBySkillId — fetches all connections where FromSkillId matches a given skill.In other words, what skills does this one unlock. Used when rechecking downstream status after a skill completes.

        //ConnectionExists — a simple true/false check asking whether a connection already exists between two specific skills.Used in your circular dependency check to avoid creating duplicate connections.
    }
}
