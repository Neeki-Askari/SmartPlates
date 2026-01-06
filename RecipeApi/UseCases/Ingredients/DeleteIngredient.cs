// UseCases/Ingredients/DeleteIngredient.cs
using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;

namespace Recipe.Api.UseCases.Ingredients;

public class DeleteIngredient(AppDbContext db)
{
    public async Task<bool> Execute(Guid id, CancellationToken ct = default)
    {
        var i = await db.Ingredients.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (i is null) return false;
        db.Ingredients.Remove(i);
        await db.SaveChangesAsync(ct);
        return true;
    }
}
