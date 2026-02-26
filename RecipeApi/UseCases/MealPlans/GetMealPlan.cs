using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.MealPlans;

public class GetMealPlan(AppDbContext db)
{
    public async Task<MealPlanWithRecipesDto?> Execute(Guid id, CancellationToken ct = default)
    {
        var mealPlan = await db.MealPlans
            .AsNoTracking()
            .Include(mp => mp.MealPlanRecipes)
            .ThenInclude(mpr => mpr.Recipe)
            .FirstOrDefaultAsync(mp => mp.Id == id, ct);

        if (mealPlan is null) return null;

        return new MealPlanWithRecipesDto(
            mealPlan.Id,
            mealPlan.UserId,
            mealPlan.Name,
            mealPlan.StartDate,
            mealPlan.EndDate,
            mealPlan.ServingSize,
            mealPlan.IncludesBreakfast,
            mealPlan.IncludesSnack1,
            mealPlan.IncludesLunch,
            mealPlan.IncludesSnack2,
            mealPlan.IncludesDinner,
            mealPlan.IncludesSnack3,
            mealPlan.CreatedAt,
            mealPlan.UpdatedAt,
            mealPlan.MealPlanRecipes.Select(mpr => new MealPlanRecipeDto(
                mpr.Id,
                mpr.MealPlanId,
                mpr.RecipeId,
                mpr.DayOfWeek,
                mpr.MealType,
                mpr.HealthRatingConstraint,
                mpr.CuisineTypeConstraint,
                new RecipeDto(
                    mpr.Recipe.Id,
                    mpr.Recipe.UserId,
                    mpr.Recipe.Title,
                    mpr.Recipe.Description,
                    mpr.Recipe.Instructions,
                    mpr.Recipe.CuisineType,
                    mpr.Recipe.HealthRating,
                    mpr.Recipe.Comments,
                    mpr.Recipe.RecipeLink,
                    mpr.Recipe.OriginalServings,
                    mpr.Recipe.ProportionFactor,
                    mpr.Recipe.LastCookedDate,
                    mpr.Recipe.CreatedAt,
                    mpr.Recipe.UpdatedAt,
                    mpr.Recipe.IsPublic
                )
            )).ToList()
        );
    }
}
