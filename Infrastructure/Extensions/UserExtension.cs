using Domain;

namespace Infrastructure.Extensions
{
    public static class UserExtension
    {
        public static IQueryable<User> GetAllUsers(this IQueryable<User> query) => query.Where(u => u.UserName.Any());
    }
}
