// UseCases/Ingredients/GetIngredient.cs
using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.Ingredients;

public class GetIngredient(AppDbContext db)
{
    public async Task<IngredientDto?> Execute(Guid id, CancellationToken ct = default)
    {
        var i = await db.Ingredients.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct);
        return i is null ? null : new IngredientDto(
            i.Id,
            i.RecipeId,
            i.Name,
            i.Quantity,
            i.Unit,
            i.CostPerUnit,
            i.CaloriesPerUnit,
            i.SizeBought,
            i.ProportionFactor
        );
    }
}
