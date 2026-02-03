using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.MealPlans;

public class UpdateMealPlan(AppDbContext db)
{
    public async Task<MealPlanSummaryDto?> Execute(Guid id, UpdateMealPlanDto dto, CancellationToken ct = default)
    {
        var mealPlan = await db.MealPlans.FindAsync(new object[] { id }, ct);
        if (mealPlan is null) return null;

        mealPlan.Name = dto.Name;
        mealPlan.StartDate = dto.StartDate;
        mealPlan.EndDate = dto.EndDate;
        mealPlan.ServingSize = dto.ServingSize;
        mealPlan.IncludesBreakfast = dto.IncludesBreakfast;
        mealPlan.IncludesSnack1 = dto.IncludesSnack1;
        mealPlan.IncludesLunch = dto.IncludesLunch;
        mealPlan.IncludesSnack2 = dto.IncludesSnack2;
        mealPlan.IncludesDinner = dto.IncludesDinner;
        mealPlan.IncludesSnack3 = dto.IncludesSnack3;
        mealPlan.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);

        var recipeCount = await db.MealPlanRecipes.CountAsync(mpr => mpr.MealPlanId == id, ct);

        return new MealPlanSummaryDto(
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
            recipeCount
        );
    }
}
