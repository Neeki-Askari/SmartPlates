using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;

namespace Recipe.Api.UseCases.MealPlans;

public class DeleteMealPlan(AppDbContext db)
{
    public async Task<bool> Execute(Guid id, CancellationToken ct = default)
    {
        var mealPlan = await db.MealPlans.FindAsync(new object[] { id }, ct);
        if (mealPlan is null) return false;

        // Delete associated meal plan recipes first
        var mealPlanRecipes = await db.MealPlanRecipes
            .Where(mpr => mpr.MealPlanId == id)
            .ToListAsync(ct);

        db.MealPlanRecipes.RemoveRange(mealPlanRecipes);
        db.MealPlans.Remove(mealPlan);

        await db.SaveChangesAsync(ct);
        return true;
    }
}
