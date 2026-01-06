using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.Users;

public class UpdateUser(AppDbContext db)
{
    public async Task<UserDto?> Execute(Guid id, UpdateUserDto dto, CancellationToken ct = default)
    {
        var entity = await db.Users.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (entity is null) return null;
        entity.DisplayName = dto.DisplayName;
        await db.SaveChangesAsync(ct);
        return new UserDto(entity.Id, entity.Email, entity.DisplayName, entity.CreatedAt);
    }
}
