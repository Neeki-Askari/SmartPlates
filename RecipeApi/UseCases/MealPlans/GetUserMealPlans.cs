using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.MealPlans;

public class GetUserMealPlans(AppDbContext db)
{
    public async Task<List<MealPlanSummaryDto>> Execute(Guid userId, CancellationToken ct = default)
    {
        var mealPlans = await db.MealPlans
            .AsNoTracking()
            .Where(mp => mp.UserId == userId)
            .OrderByDescending(mp => mp.StartDate)
            .Select(mp => new MealPlanSummaryDto(
                mp.Id,
                mp.UserId,
                mp.Name,
                mp.StartDate,
                mp.EndDate,
                mp.ServingSize,
                mp.IncludesBreakfast,
                mp.IncludesSnack1,
                mp.IncludesLunch,
                mp.IncludesSnack2,
                mp.IncludesDinner,
                mp.IncludesSnack3,
                mp.CreatedAt,
                mp.UpdatedAt,
                mp.MealPlanRecipes.Count
            ))
            .ToListAsync(ct);

        return mealPlans;
    }
}
