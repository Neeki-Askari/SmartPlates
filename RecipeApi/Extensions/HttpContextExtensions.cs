using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;

namespace Recipe.Api.Extensions;

public static class HttpContextExtensions
{
    public static async Task<Guid?> GetCurrentUserIdAsync(this HttpContext httpContext, AppDbContext db, CancellationToken ct = default)
    {
        // Get Auth0 subject ID from token
        var auth0Sub = httpContext.User.FindFirst("sub")?.Value
            ?? httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(auth0Sub))
            return null;

        // Find user by Auth0 subject ID
        var user = await db.Users
            .Where(u => u.Auth0SubjectId == auth0Sub)
            .Select(u => u.Id)
            .FirstOrDefaultAsync(ct);

        return user == Guid.Empty ? null : user;
    }

    // Ownership lookups. Each returns the owning user's id, or null when the resource does not exist.
    public static Task<Guid?> GetRecipeOwnerAsync(this AppDbContext db, Guid recipeId, CancellationToken ct = default)
        => db.Recipes.Where(r => r.Id == recipeId).Select(r => (Guid?)r.UserId).FirstOrDefaultAsync(ct);

    public static Task<Guid?> GetMealPlanOwnerAsync(this AppDbContext db, Guid mealPlanId, CancellationToken ct = default)
        => db.MealPlans.Where(m => m.Id == mealPlanId).Select(m => (Guid?)m.UserId).FirstOrDefaultAsync(ct);

    public static Task<Guid?> GetSavedShoppingListOwnerAsync(this AppDbContext db, Guid id, CancellationToken ct = default)
        => db.SavedShoppingLists.Where(s => s.Id == id).Select(s => (Guid?)s.UserId).FirstOrDefaultAsync(ct);

    public static Task<Guid?> GetIngredientOwnerAsync(this AppDbContext db, Guid ingredientId, CancellationToken ct = default)
        => db.Ingredients.Where(i => i.Id == ingredientId).Select(i => (Guid?)i.Recipe.UserId).FirstOrDefaultAsync(ct);
}
