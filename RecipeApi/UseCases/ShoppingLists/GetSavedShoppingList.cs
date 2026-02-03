using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.ShoppingLists;

public class GetSavedShoppingList(AppDbContext db)
{
    public async Task<SavedShoppingListDto?> Execute(Guid id, CancellationToken ct = default)
    {
        var savedList = await db.SavedShoppingLists
            .AsNoTracking()
            .FirstOrDefaultAsync(ssl => ssl.Id == id, ct);

        if (savedList is null) return null;

        var items = JsonSerializer.Deserialize<List<ShoppingListItemDto>>(savedList.ItemsJson)
            ?? new List<ShoppingListItemDto>();

        return new SavedShoppingListDto(
            savedList.Id,
            savedList.MealPlanId,
            savedList.UserId,
            savedList.MealPlanName,
            savedList.StartDate,
            savedList.EndDate,
            savedList.ServingSize,
            items,
            savedList.TotalEstimatedCost,
            savedList.TotalCalories,
            savedList.CreatedAt,
            savedList.UpdatedAt
        );
    }
}
