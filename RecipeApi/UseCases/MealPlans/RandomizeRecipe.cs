using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.MealPlans;

public class RandomizeRecipe(AppDbContext db)
{
    public async Task<IReadOnlyList<RecipeDto>> Execute(RandomizeRecipeDto dto, CancellationToken ct = default)
    {
        // Validate meal plan exists
        var mealPlan = await db.MealPlans.FindAsync(new object[] { dto.MealPlanId }, ct);
        if (mealPlan is null) throw new InvalidOperationException("Meal plan does not exist.");

        // Build query with constraints
        var query = db.Recipes.AsNoTracking().Where(r => r.UserId == mealPlan.UserId);

        if (!string.IsNullOrWhiteSpace(dto.HealthRatingConstraint))
        {
            query = query.Where(r => r.HealthRating == dto.HealthRatingConstraint);
        }

        if (!string.IsNullOrWhiteSpace(dto.CuisineTypeConstraint))
        {
            query = query.Where(r => r.CuisineType == dto.CuisineTypeConstraint);
        }

        // Exclude recipes with specified ingredients
        if (dto.ExcludeIngredients is not null && dto.ExcludeIngredients.Count > 0)
        {
            query = query.Where(r => !r.Ingredients.Any(i =>
                dto.ExcludeIngredients.Contains(i.Name)));
        }

        // Get all matching recipes
        var allRecipes = await query.ToListAsync(ct);

        if (allRecipes.Count == 0)
        {
            return new List<RecipeDto>();
        }

        // Randomly select the requested number of options
        var random = new Random();
        var selectedRecipes = allRecipes
            .OrderBy(x => random.Next())
            .Take(dto.OptionCount)
            .Select(r => new RecipeDto(
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
                r.IsPublic
            ))
            .ToList();

        return selectedRecipes;
    }
}
