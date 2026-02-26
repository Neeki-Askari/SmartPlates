using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.Recipes;

public class CopyRecipe(AppDbContext db)
{
    public async Task<RecipeWithIngredientsDto> Execute(Guid recipeId, Guid requestingUserId, CancellationToken ct = default)
    {
        var source = await db.Recipes
            .Include(r => r.Ingredients)
            .FirstOrDefaultAsync(r => r.Id == recipeId, ct)
            ?? throw new InvalidOperationException("Recipe not found.");

        if (!source.IsPublic && source.UserId != requestingUserId)
            throw new UnauthorizedAccessException("Cannot copy a private recipe you don't own.");

        var copy = new Models.Recipe
        {
            UserId = requestingUserId,
            Title = source.Title,
            Description = source.Description,
            Instructions = source.Instructions,
            CuisineType = source.CuisineType,
            HealthRating = source.HealthRating,
            Comments = source.Comments,
            RecipeLink = source.RecipeLink,
            OriginalServings = source.OriginalServings,
            ProportionFactor = source.ProportionFactor,
            IsPublic = true,
            Ingredients = source.Ingredients.Select(i => new Ingredient
            {
                Id = Guid.NewGuid(),
                Name = i.Name,
                Quantity = i.Quantity,
                Unit = i.Unit,
                CostPerUnit = i.CostPerUnit,
                CaloriesPerUnit = i.CaloriesPerUnit,
                SizeBought = i.SizeBought,
                ProportionFactor = i.ProportionFactor
            }).ToList()
        };

        db.Recipes.Add(copy);
        await db.SaveChangesAsync(ct);

        return new RecipeWithIngredientsDto(
            copy.Id,
            copy.UserId,
            copy.Title,
            copy.Description,
            copy.Instructions,
            copy.CuisineType,
            copy.HealthRating,
            copy.Comments,
            copy.RecipeLink,
            copy.OriginalServings,
            copy.ProportionFactor,
            copy.LastCookedDate,
            copy.CreatedAt,
            copy.UpdatedAt,
            copy.IsPublic,
            copy.Ingredients.Select(i =>
                new IngredientDto(i.Id, copy.Id, i.Name, i.Quantity, i.Unit,
                    i.CostPerUnit, i.CaloriesPerUnit, i.SizeBought, i.ProportionFactor)
            ).ToList()
        );
    }
}
