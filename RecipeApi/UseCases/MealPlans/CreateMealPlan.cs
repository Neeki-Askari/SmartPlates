using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.MealPlans;

public class CreateMealPlan(AppDbContext db)
{
    public async Task<MealPlanDto> Execute(CreateMealPlanDto dto, CancellationToken ct = default)
    {
        // Validate user exists
        var userExists = await db.Users.AnyAsync(u => u.Id == dto.UserId, ct);
        if (!userExists) throw new InvalidOperationException("User does not exist.");

        var mealPlan = new MealPlan
        {
            UserId = dto.UserId,
            Name = dto.Name,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            ServingSize = dto.ServingSize,
            IncludesBreakfast = dto.IncludesBreakfast,
            IncludesSnack1 = dto.IncludesSnack1,
            IncludesLunch = dto.IncludesLunch,
            IncludesSnack2 = dto.IncludesSnack2,
            IncludesDinner = dto.IncludesDinner,
            IncludesSnack3 = dto.IncludesSnack3
        };

        db.MealPlans.Add(mealPlan);
        await db.SaveChangesAsync(ct);

        return new MealPlanDto(
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
            mealPlan.UpdatedAt
        );
    }
}
