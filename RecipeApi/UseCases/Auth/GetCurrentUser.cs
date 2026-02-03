using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.Auth;

public class GetCurrentUser(AppDbContext db)
{
    public async Task<UserDto?> Execute(Guid userId, CancellationToken ct = default)
    {
        var user = await db.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId, ct);

        if (user is null) return null;

        return new UserDto(
            user.Id,
            user.Email,
            user.DisplayName,
            user.CreatedAt
        );
    }
}
