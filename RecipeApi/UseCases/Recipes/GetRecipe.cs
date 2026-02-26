using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.Recipes;

public class GetRecipe(AppDbContext db)
{
    public async Task<RecipeWithIngredientsDto?> Execute(Guid id, CancellationToken ct = default)
    {
        var dto = await db.Recipes
            .AsNoTracking()
            .Where(r => r.Id == id)
            .Select(r => new RecipeWithIngredientsDto(
                r.Id,
                r.UserId,
                r.Title,
                r.Description,
                r.Instructions,
                r.CuisineType,
                r.HealthRating,
                r.Comments,
                r.RecipeLink,
                r.OriginalServings,
                r.ProportionFactor,
                r.LastCookedDate,
                r.CreatedAt,
                r.UpdatedAt,
                r.IsPublic,
                r.Ingredients
                 .Select(i => new IngredientDto(i.Id, r.Id, i.Name, i.Quantity, i.Unit,
                     i.CostPerUnit, i.CaloriesPerUnit, i.SizeBought, i.ProportionFactor))
                 .ToList() // materialize to List -> IReadOnlyList
            ))
            .FirstOrDefaultAsync(ct);

        return dto; // null if not found
    }
}