using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.Recipes;

public class SearchRecipesByIngredients(AppDbContext db)
{
    public async Task<IReadOnlyList<RecipeWithIngredientsDto>> Execute(SearchRecipesByIngredientsDto dto, CancellationToken ct = default)
    {
        var query = db.Recipes
            .AsNoTracking()
            .Where(r => r.UserId == dto.UserId)
            .Include(r => r.Ingredients);

        List<Models.Recipe> recipes;

        if (dto.MatchAll)
        {
            // Recipe must contain ALL specified ingredients
            recipes = await query.ToListAsync(ct);
            recipes = recipes.Where(r =>
                dto.IngredientNames.All(searchIngredient =>
                    r.Ingredients.Any(i => i.Name.Contains(searchIngredient, StringComparison.OrdinalIgnoreCase))
                )
            ).ToList();
        }
        else
        {
            // Recipe must contain AT LEAST ONE of the specified ingredients
            recipes = await query.Where(r =>
                r.Ingredients.Any(i =>
                    dto.IngredientNames.Any(searchIngredient =>
                        i.Name.Contains(searchIngredient, StringComparison.OrdinalIgnoreCase)
                    )
                )
            ).ToListAsync(ct);
        }

        return recipes.Select(r => new RecipeWithIngredientsDto(
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
            r.Ingredients.Select(i => new IngredientDto(
                i.Id,
                i.RecipeId,
                i.Name,
                i.Quantity,
                i.Unit,
                i.CostPerUnit,
                i.CaloriesPerUnit,
                i.SizeBought,
                i.ProportionFactor
            )).ToList()
        )).ToList();
    }
}
