// UseCases/Recipes/CreateRecipe.cs
using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.Recipes;

public class CreateRecipe(AppDbContext db)
{
    public async Task<RecipeWithIngredientsDto> Execute(CreateRecipeDto dto, CancellationToken ct = default)
    {
        // Validate required fields
        if (dto.UserId == Guid.Empty) throw new InvalidOperationException("UserId is required.");
        if (string.IsNullOrWhiteSpace(dto.Title)) throw new InvalidOperationException("Title is required.");

        // Validate user
        var userExists = await db.Users.AnyAsync(u => u.Id == dto.UserId, ct);
        if (!userExists) throw new InvalidOperationException("User does not exist.");

        // Build recipe and attach ingredients
        var recipe = new Models.Recipe
        {
            UserId = dto.UserId,
            Title = dto.Title,
            Description = dto.Description,
            Instructions = dto.Instructions,
            CuisineType = dto.CuisineType,
            HealthRating = dto.HealthRating,
            Comments = dto.Comments,
            RecipeLink = dto.RecipeLink,
            OriginalServings = dto.OriginalServings,
            ProportionFactor = dto.ProportionFactor,
            IsPublic = dto.IsPublic,
            Ingredients = (dto.Ingredients ?? new List<IngredientInput>()).Select(i => new Ingredient
            {
                Id       = Guid.NewGuid(),
                Name     = i.Name,
                Quantity = i.Quantity,
                Unit     = i.Unit,
                CostPerUnit = i.CostPerUnit,
                CaloriesPerUnit = i.CaloriesPerUnit,
                SizeBought = i.SizeBought,
                ProportionFactor = i.ProportionFactor
            }).ToList()
        };

        db.Recipes.Add(recipe);
        await db.SaveChangesAsync(ct); // atomic in EF Core by default

        // Map to response
        var outDto = new RecipeWithIngredientsDto(
            recipe.Id,
            recipe.UserId,
            recipe.Title,
            recipe.Description,
            recipe.Instructions,
            recipe.CuisineType,
            recipe.HealthRating,
            recipe.Comments,
            recipe.RecipeLink,
            recipe.OriginalServings,
            recipe.ProportionFactor,
            recipe.LastCookedDate,
            recipe.CreatedAt,
            recipe.UpdatedAt,
            recipe.IsPublic,
            recipe.Ingredients.Select(i =>
                new IngredientDto(i.Id, recipe.Id, i.Name, i.Quantity, i.Unit,
                    i.CostPerUnit, i.CaloriesPerUnit, i.SizeBought, i.ProportionFactor)
            ).ToList()
        );

        return outDto;
    }
}
