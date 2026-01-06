// UseCases/Ingredients/ListIngredientsByRecipe.cs
using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.Ingredients;

public class ListIngredientsByRecipe(AppDbContext db)
{
    public async Task<IReadOnlyList<IngredientDto>> Execute(Guid recipeId, CancellationToken ct = default)
    {
        var list = await db.Ingredients.AsNoTracking()
            .Where(x => x.RecipeId == recipeId)
            .ToListAsync(ct);

        return list.Select(i => new IngredientDto(
            i.Id,
            i.RecipeId,
            i.Name,
            i.Quantity,
            i.Unit,
            i.CostPerUnit,
            i.CaloriesPerUnit,
            i.SizeBought,
            i.ProportionFactor
        )).ToList();
    }
}
