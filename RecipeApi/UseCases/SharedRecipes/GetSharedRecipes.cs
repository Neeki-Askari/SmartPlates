using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.SharedRecipes;

public class GetSharedRecipes(AppDbContext db)
{
    public async Task<IReadOnlyList<SharedRecipeDto>> Execute(Guid userId, CancellationToken ct = default)
    {
        var sharedRecipes = await db.SharedRecipes
            .AsNoTracking()
            .Where(sr => sr.SharedWithUserId == userId)
            .Include(sr => sr.OriginalRecipe)
            .ThenInclude(r => r.Ingredients)
            .Include(sr => sr.OriginalOwner)
            .ToListAsync(ct);

        return sharedRecipes.Select(sr => new SharedRecipeDto(
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
                sr.OriginalRecipe.IsPublic,
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
        )).ToList();
    }
}
