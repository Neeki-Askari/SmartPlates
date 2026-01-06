using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.Users;

public class CreateUser(AppDbContext db)
{
    public async Task<UserDto> Execute(CreateUserDto dto, CancellationToken ct = default)
    {
        var entity = new User { Email = dto.Email, DisplayName = dto.DisplayName };
        db.Users.Add(entity);
        await db.SaveChangesAsync(ct);
        return new UserDto(entity.Id, entity.Email, entity.DisplayName, entity.CreatedAt);
    }
}
