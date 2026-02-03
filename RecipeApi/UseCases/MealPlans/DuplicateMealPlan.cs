using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.MealPlans;

public class DuplicateMealPlan(AppDbContext db)
{
    public async Task<MealPlanWithRecipesDto> Execute(DuplicateMealPlanDto dto, CancellationToken ct = default)
    {
        // Get the source meal plan with all recipes
        var sourceMealPlan = await db.MealPlans
            .Include(mp => mp.MealPlanRecipes)
            .FirstOrDefaultAsync(mp => mp.Id == dto.SourceMealPlanId, ct);

        if (sourceMealPlan is null)
            throw new InvalidOperationException($"Meal plan {dto.SourceMealPlanId} not found");

        // Create new meal plan
        var newMealPlan = new MealPlan
        {
            Id = Guid.NewGuid(),
            UserId = sourceMealPlan.UserId,
            Name = dto.Name,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            ServingSize = dto.ServingSize,
            IncludesBreakfast = dto.IncludesBreakfast,
            IncludesSnack1 = dto.IncludesSnack1,
            IncludesLunch = dto.IncludesLunch,
            IncludesSnack2 = dto.IncludesSnack2,
            IncludesDinner = dto.IncludesDinner,
            IncludesSnack3 = dto.IncludesSnack3,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        db.MealPlans.Add(newMealPlan);

        // Copy all meal plan recipes
        var newMealPlanRecipes = new List<MealPlanRecipe>();
        foreach (var sourceMpr in sourceMealPlan.MealPlanRecipes)
        {
            var newMpr = new MealPlanRecipe
            {
                Id = Guid.NewGuid(),
                MealPlanId = newMealPlan.Id,
                RecipeId = sourceMpr.RecipeId,
                DayOfWeek = sourceMpr.DayOfWeek,
                MealType = sourceMpr.MealType,
                HealthRatingConstraint = sourceMpr.HealthRatingConstraint,
                CuisineTypeConstraint = sourceMpr.CuisineTypeConstraint
            };
            db.MealPlanRecipes.Add(newMpr);
            newMealPlanRecipes.Add(newMpr);
        }

        await db.SaveChangesAsync(ct);

        // Fetch recipes for response
        var recipesDict = await db.Recipes
            .AsNoTracking()
            .Where(r => newMealPlanRecipes.Select(mpr => mpr.RecipeId).Contains(r.Id))
            .ToDictionaryAsync(r => r.Id, ct);

        return new MealPlanWithRecipesDto(
            newMealPlan.Id,
            newMealPlan.UserId,
            newMealPlan.Name,
            newMealPlan.StartDate,
            newMealPlan.EndDate,
            newMealPlan.ServingSize,
            newMealPlan.IncludesBreakfast,
            newMealPlan.IncludesSnack1,
            newMealPlan.IncludesLunch,
            newMealPlan.IncludesSnack2,
            newMealPlan.IncludesDinner,
            newMealPlan.IncludesSnack3,
            newMealPlan.CreatedAt,
            newMealPlan.UpdatedAt,
            newMealPlanRecipes.Select(mpr => new MealPlanRecipeDto(
                mpr.Id,
                mpr.MealPlanId,
                mpr.RecipeId,
                mpr.DayOfWeek,
                mpr.MealType,
                mpr.HealthRatingConstraint,
                mpr.CuisineTypeConstraint,
                recipesDict.TryGetValue(mpr.RecipeId, out var recipe)
                    ? new RecipeDto(
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
                    : throw new InvalidOperationException($"Recipe {mpr.RecipeId} not found")
            )).ToList()
        );
    }
}
