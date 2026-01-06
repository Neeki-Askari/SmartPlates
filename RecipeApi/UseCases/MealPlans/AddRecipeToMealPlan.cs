using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.MealPlans;

public class AddRecipeToMealPlan(AppDbContext db)
{
    public async Task<MealPlanRecipeDto> Execute(AddRecipeToMealPlanDto dto, CancellationToken ct = default)
    {
        // Validate meal plan exists
        var mealPlan = await db.MealPlans.FindAsync(new object[] { dto.MealPlanId }, ct);
        if (mealPlan is null) throw new InvalidOperationException("Meal plan does not exist.");

        // Validate recipe exists
        var recipe = await db.Recipes.FindAsync(new object[] { dto.RecipeId }, ct);
        if (recipe is null) throw new InvalidOperationException("Recipe does not exist.");

        // Check if there's already a recipe for this day/meal combination
        var existing = await db.MealPlanRecipes
            .FirstOrDefaultAsync(mpr =>
                mpr.MealPlanId == dto.MealPlanId &&
                mpr.DayOfWeek == dto.DayOfWeek &&
                mpr.MealType == dto.MealType, ct);

        if (existing is not null)
        {
            // Update existing
            existing.RecipeId = dto.RecipeId;
            existing.HealthRatingConstraint = dto.HealthRatingConstraint;
            existing.CuisineTypeConstraint = dto.CuisineTypeConstraint;
        }
        else
        {
            // Create new
            existing = new MealPlanRecipe
            {
                MealPlanId = dto.MealPlanId,
                RecipeId = dto.RecipeId,
                DayOfWeek = dto.DayOfWeek,
                MealType = dto.MealType,
                HealthRatingConstraint = dto.HealthRatingConstraint,
                CuisineTypeConstraint = dto.CuisineTypeConstraint
            };
            db.MealPlanRecipes.Add(existing);
        }

        await db.SaveChangesAsync(ct);

        // Reload with recipe data
        await db.Entry(existing).Reference(mpr => mpr.Recipe).LoadAsync(ct);

        return new MealPlanRecipeDto(
            existing.Id,
            existing.MealPlanId,
            existing.RecipeId,
            existing.DayOfWeek,
            existing.MealType,
            existing.HealthRatingConstraint,
            existing.CuisineTypeConstraint,
            new RecipeDto(
                recipe.Id,
                recipe.UserId,
                recipe.Title,
                recipe.Description,
                recipe.Instructions,
                recipe.CuisineType,
                recipe.HealthRating,
                recipe.Comments,
                recipe.RecipeLink,
                recipe.OriginalServings,
                recipe.ProportionFactor,
                recipe.LastCookedDate,
                recipe.CreatedAt,
                recipe.UpdatedAt
            )
        );
    }
}
