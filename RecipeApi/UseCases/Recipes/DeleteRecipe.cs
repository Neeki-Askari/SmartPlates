// UseCases/Recipes/DeleteRecipe.cs
using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;

namespace Recipe.Api.UseCases.Recipes;

public class DeleteRecipe(AppDbContext db)
{
    public async Task<bool> Execute(Guid id, CancellationToken ct = default)
    {
        var r = await db.Recipes.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (r is null) return false;
        db.Recipes.Remove(r);
        await db.SaveChangesAsync(ct);
        return true;
    }
}
