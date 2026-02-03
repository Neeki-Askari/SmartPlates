using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.ShoppingLists;

public class GetUserSavedShoppingLists(AppDbContext db)
{
    public async Task<List<SavedShoppingListSummaryDto>> Execute(Guid userId, CancellationToken ct = default)
    {
        var savedLists = await db.SavedShoppingLists
            .AsNoTracking()
            .Where(ssl => ssl.UserId == userId)
            .OrderByDescending(ssl => ssl.StartDate)
            .ToListAsync(ct);

        return savedLists.Select(ssl =>
        {
            var items = JsonSerializer.Deserialize<List<ShoppingListItemDto>>(ssl.ItemsJson) ?? new List<ShoppingListItemDto>();
            return new SavedShoppingListSummaryDto(
                ssl.Id,
                ssl.MealPlanId,
                ssl.MealPlanName,
                ssl.StartDate,
                ssl.EndDate,
                items.Count,
                ssl.TotalEstimatedCost,
                ssl.CreatedAt
            );
        }).ToList();
    }
}
