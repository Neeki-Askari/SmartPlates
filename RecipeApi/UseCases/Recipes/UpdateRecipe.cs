// UseCases/Recipes/UpdateRecipe.cs
using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.Recipes;

public class UpdateRecipe(AppDbContext db)
{
    public async Task<RecipeDto?> Execute(Guid id, UpdateRecipeDto dto, CancellationToken ct = default)
    {
        var r = await db.Recipes.Include(x => x.Ingredients).FirstOrDefaultAsync(x => x.Id == id, ct);
        if (r is null) return null;

        r.Title = dto.Title;
        r.Description = dto.Description;
        r.Instructions = dto.Instructions;
        r.CuisineType = dto.CuisineType;
        r.HealthRating = dto.HealthRating;
        r.Comments = dto.Comments;
        r.RecipeLink = dto.RecipeLink;
        r.OriginalServings = dto.OriginalServings;
        r.ProportionFactor = dto.ProportionFactor;
        r.LastCookedDate = dto.LastCookedDate;
        r.UpdatedAt = DateTime.UtcNow;

        // Update ingredients - remove old ones and add new ones
        r.Ingredients.Clear();
        foreach (var ingDto in dto.Ingredients)
        {
            r.Ingredients.Add(new Ingredient
            {
                Id = Guid.NewGuid(),
                RecipeId = r.Id,
                Name = ingDto.Name,
                Quantity = ingDto.Quantity,
                Unit = ingDto.Unit,
                CostPerUnit = ingDto.CostPerUnit,
                CaloriesPerUnit = ingDto.CaloriesPerUnit,
                SizeBought = ingDto.SizeBought,
                ProportionFactor = ingDto.ProportionFactor
            });
        }

        await db.SaveChangesAsync(ct);
        return new RecipeDto(
            r.Id,
            r.UserId,
            r.Title,
            r.Description,
            r.Instructions,
            r.CuisineType,
            r.HealthRating,
            r.Comments,
            r.RecipeLink,
            r.OriginalServings,
            r.ProportionFactor,
            r.LastCookedDate,
            r.CreatedAt,
            r.UpdatedAt
        );
    }
}
