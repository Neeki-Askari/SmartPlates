using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;

namespace Recipe.Api.UseCases.MealPlans;

public class RemoveRecipeFromMealPlan(AppDbContext db)
{
    public async Task<bool> Execute(Guid mealPlanId, Guid mealPlanRecipeId, CancellationToken ct = default)
    {
        var entry = await db.MealPlanRecipes
            .FirstOrDefaultAsync(mpr => mpr.Id == mealPlanRecipeId && mpr.MealPlanId == mealPlanId, ct);
        if (entry is null) return false;

        db.MealPlanRecipes.Remove(entry);
        await db.SaveChangesAsync(ct);
        return true;
    }
}
