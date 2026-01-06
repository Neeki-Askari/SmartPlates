using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.SharedRecipes;

public class ShareRecipe(AppDbContext db)
{
    public async Task<SharedRecipeDto> Execute(ShareRecipeDto dto, CancellationToken ct = default)
    {
        // Validate recipe exists
        var recipe = await db.Recipes
            .Include(r => r.User)
            .Include(r => r.Ingredients)
            .FirstOrDefaultAsync(r => r.Id == dto.RecipeId, ct);

        if (recipe is null)
            throw new InvalidOperationException("Recipe does not exist.");

        // Validate recipient user exists
        var recipientExists = await db.Users.AnyAsync(u => u.Id == dto.SharedWithUserId, ct);
        if (!recipientExists)
            throw new InvalidOperationException("Recipient user does not exist.");

        // Check if already shared
        var existingShare = await db.SharedRecipes
            .FirstOrDefaultAsync(sr =>
                sr.OriginalRecipeId == dto.RecipeId &&
                sr.SharedWithUserId == dto.SharedWithUserId, ct);

        if (existingShare is not null)
        {
            // Already shared, return existing
            await db.Entry(existingShare).Reference(sr => sr.OriginalRecipe).LoadAsync(ct);
            await db.Entry(existingShare).Reference(sr => sr.OriginalOwner).LoadAsync(ct);

            return MapToDto(existingShare);
        }

        // Create new share
        var sharedRecipe = new Models.SharedRecipe
        {
            OriginalRecipeId = dto.RecipeId,
            OriginalOwnerId = recipe.UserId,
            SharedWithUserId = dto.SharedWithUserId
        };

        db.SharedRecipes.Add(sharedRecipe);
        await db.SaveChangesAsync(ct);

        // Reload with navigation properties
        await db.Entry(sharedRecipe).Reference(sr => sr.OriginalRecipe).LoadAsync(ct);
        await db.Entry(sharedRecipe).Reference(sr => sr.OriginalOwner).LoadAsync(ct);
        await db.Entry(sharedRecipe.OriginalRecipe).Collection(r => r.Ingredients).LoadAsync(ct);

        return MapToDto(sharedRecipe);
    }

    private SharedRecipeDto MapToDto(Models.SharedRecipe sr)
    {
        return new SharedRecipeDto(
            sr.Id,
            sr.OriginalRecipeId,
            sr.OriginalOwnerId,
            sr.SharedWithUserId,
            sr.SharedAt,
            sr.CopiedRecipeId,
            new RecipeWithIngredientsDto(
                sr.OriginalRecipe.Id,
                sr.OriginalRecipe.UserId,
                sr.OriginalRecipe.Title,
                sr.OriginalRecipe.Description,
                sr.OriginalRecipe.Instructions,
                sr.OriginalRecipe.CuisineType,
                sr.OriginalRecipe.HealthRating,
                sr.OriginalRecipe.Comments,
                sr.OriginalRecipe.RecipeLink,
                sr.OriginalRecipe.OriginalServings,
                sr.OriginalRecipe.ProportionFactor,
                sr.OriginalRecipe.LastCookedDate,
                sr.OriginalRecipe.CreatedAt,
                sr.OriginalRecipe.UpdatedAt,
                sr.OriginalRecipe.Ingredients.Select(i => new IngredientDto(
                    i.Id,
                    i.RecipeId,
                    i.Name,
                    i.Quantity,
                    i.Unit,
                    i.CostPerUnit,
                    i.CaloriesPerUnit,
                    i.SizeBought,
                    i.ProportionFactor
                )).ToList()
            ),
            new UserDto(
                sr.OriginalOwner.Id,
                sr.OriginalOwner.Email,
                sr.OriginalOwner.DisplayName,
                sr.OriginalOwner.CreatedAt
            )
        );
    }
}
