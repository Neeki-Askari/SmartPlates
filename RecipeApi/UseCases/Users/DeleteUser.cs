using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;

namespace Recipe.Api.UseCases.Users;

public class DeleteUser(AppDbContext db)
{
    public async Task<bool> Execute(Guid id, CancellationToken ct = default)
    {
        var entity = await db.Users.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (entity is null) return false;
        db.Users.Remove(entity);
        await db.SaveChangesAsync(ct);
        return true;
    }
}
