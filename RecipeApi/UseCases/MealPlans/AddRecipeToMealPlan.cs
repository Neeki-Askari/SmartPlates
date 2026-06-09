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

        // Multiple recipes are allowed per day/meal combination, so always add a new entry.
        var entry = new MealPlanRecipe
        {
            MealPlanId = dto.MealPlanId,
            RecipeId = dto.RecipeId,
            DayOfWeek = dto.DayOfWeek,
            MealType = dto.MealType,
            HealthRatingConstraint = dto.HealthRatingConstraint,
            CuisineTypeConstraint = dto.CuisineTypeConstraint
        };
        db.MealPlanRecipes.Add(entry);

        await db.SaveChangesAsync(ct);

        return new MealPlanRecipeDto(
            entry.Id,
            entry.MealPlanId,
            entry.RecipeId,
            entry.DayOfWeek,
            entry.MealType,
            entry.HealthRatingConstraint,
            entry.CuisineTypeConstraint,
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
                recipe.UpdatedAt,
                recipe.IsPublic
            )
        );
    }
}
