using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.ShoppingLists;

public class SaveShoppingList(AppDbContext db)
{
    public async Task<SavedShoppingListDto> Execute(ShoppingListDto shoppingList, CancellationToken ct = default)
    {
        // Get the meal plan to extract dates
        var mealPlan = await db.MealPlans
            .AsNoTracking()
            .FirstOrDefaultAsync(mp => mp.Id == shoppingList.MealPlanId, ct);

        if (mealPlan is null)
            throw new InvalidOperationException($"Meal plan {shoppingList.MealPlanId} not found");

        // Check if a saved shopping list already exists for this meal plan
        var existingList = await db.SavedShoppingLists
            .FirstOrDefaultAsync(ssl => ssl.MealPlanId == shoppingList.MealPlanId, ct);

        if (existingList is not null)
        {
            // Update existing
            existingList.MealPlanName = shoppingList.MealPlanName;
            existingList.ServingSize = shoppingList.ServingSize;
            existingList.ItemsJson = JsonSerializer.Serialize(shoppingList.Items);
            existingList.TotalEstimatedCost = shoppingList.TotalEstimatedCost;
            existingList.TotalCalories = shoppingList.TotalCalories;
            existingList.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync(ct);

            return new SavedShoppingListDto(
                existingList.Id,
                existingList.MealPlanId,
                existingList.UserId,
                existingList.MealPlanName,
                existingList.StartDate,
                existingList.EndDate,
                existingList.ServingSize,
                shoppingList.Items,
                existingList.TotalEstimatedCost,
                existingList.TotalCalories,
                existingList.CreatedAt,
                existingList.UpdatedAt
            );
        }

        // Create new
        var savedList = new SavedShoppingList
        {
            Id = Guid.NewGuid(),
            MealPlanId = shoppingList.MealPlanId,
            UserId = mealPlan.UserId,
            MealPlanName = shoppingList.MealPlanName,
            StartDate = mealPlan.StartDate,
            EndDate = mealPlan.EndDate,
            ServingSize = shoppingList.ServingSize,
            ItemsJson = JsonSerializer.Serialize(shoppingList.Items),
            TotalEstimatedCost = shoppingList.TotalEstimatedCost,
            TotalCalories = shoppingList.TotalCalories,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        db.SavedShoppingLists.Add(savedList);
        await db.SaveChangesAsync(ct);

        return new SavedShoppingListDto(
            savedList.Id,
            savedList.MealPlanId,
            savedList.UserId,
            savedList.MealPlanName,
            savedList.StartDate,
            savedList.EndDate,
            savedList.ServingSize,
            shoppingList.Items,
            savedList.TotalEstimatedCost,
            savedList.TotalCalories,
            savedList.CreatedAt,
            savedList.UpdatedAt
        );
    }
}
