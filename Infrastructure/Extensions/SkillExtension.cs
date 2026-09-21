using Domain;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Infrastructure.Extensions
{
    public static class SkillExtension
    {
        //get lookup by skill id 
        public static IQueryable<Skills> GetById(this IQueryable<Skills> query, Guid skillId) => query.Where(q => q.Id == skillId);

        //fetch single skill with its subskills orded by sequence
        public static IQueryable<Skills> GetByIdWithSubSkill(this IQueryable<Skills> query, Guid skillId) => query.Where(s => s.Id == skillId)
            .Include(s => s.SubSkills.OrderBy(s => s.OrderIndex));
       
    }
}
