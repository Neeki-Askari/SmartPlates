// UseCases/Recipes/GetAllRecipes.cs
using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.Recipes;

public class GetAllRecipes(AppDbContext db)
{
    public async Task<IReadOnlyList<object>> Execute(GetAllRecipesDto dto, CancellationToken ct = default)
    {
        // base query
        var q = db.Recipes.AsNoTracking();

        // optional filters
        if (dto.UserId is Guid uid && uid != Guid.Empty)
        {
            q = q.Where(r => r.UserId == uid);
        }

        if (!string.IsNullOrWhiteSpace(dto.CuisineType))
        {
            q = q.Where(r => r.CuisineType == dto.CuisineType);
        }

        if (!string.IsNullOrWhiteSpace(dto.HealthRating))
        {
            q = q.Where(r => r.HealthRating == dto.HealthRating);
        }

        if (!string.IsNullOrWhiteSpace(dto.SearchTerm))
        {
            q = q.Where(r => r.Title.Contains(dto.SearchTerm) ||
                            (r.Description != null && r.Description.Contains(dto.SearchTerm)));
        }

        // sorting
        q = dto.SortBy?.ToLower() switch
        {
            "name" => q.OrderBy(r => r.Title),
            "lastcooked" => q.OrderByDescending(r => r.LastCookedDate ?? DateTime.MinValue),
            "createdat" => q.OrderByDescending(r => r.CreatedAt),
            _ => q.OrderByDescending(r => r.CreatedAt) // default
        };

        // paging
        var page = Math.Max(1, dto.Page);
        var pageSize = Math.Clamp(dto.PageSize, 1, 200);
        q = q.Skip((page - 1) * pageSize).Take(pageSize);

        if (dto.IncludeIngredients)
        {
            // Project with ingredients
            var listWith = await q
                .Select(r => new RecipeWithIngredientsDto(
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
                    r.UpdatedAt,
                    r.Ingredients
                        .Select(i => new IngredientDto(i.Id, i.RecipeId, i.Name, i.Quantity, i.Unit,
                            i.CostPerUnit, i.CaloriesPerUnit, i.SizeBought, i.ProportionFactor))
                        .ToList()
                ))
                .ToListAsync(ct);

            return listWith;
        }
        else
        {
            // Project to simple RecipeDto
            var list = await q
                .Select(r => new RecipeDto(
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
                ))
                .ToListAsync(ct);

            return list;
        }
    }
}
