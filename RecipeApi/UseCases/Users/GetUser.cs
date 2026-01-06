using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.Users;

public class GetUser(AppDbContext db)
{
    public async Task<UserDto?> Execute(Guid id, CancellationToken ct = default)
    {
        var u = await db.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct);
        return u is null ? null : new UserDto(u.Id, u.Email, u.DisplayName, u.CreatedAt);
    }
}
