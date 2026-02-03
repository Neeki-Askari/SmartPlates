using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;

namespace Recipe.Api.UseCases.ShoppingLists;

public class DeleteSavedShoppingList(AppDbContext db)
{
    public async Task<bool> Execute(Guid id, CancellationToken ct = default)
    {
        var savedList = await db.SavedShoppingLists
            .FirstOrDefaultAsync(ssl => ssl.Id == id, ct);

        if (savedList is null) return false;

        db.SavedShoppingLists.Remove(savedList);
        await db.SaveChangesAsync(ct);
        return true;
    }
}
