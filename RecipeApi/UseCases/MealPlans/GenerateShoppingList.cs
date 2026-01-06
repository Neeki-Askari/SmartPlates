using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.UseCases.MealPlans;

public class GenerateShoppingList(AppDbContext db)
{
    public async Task<ShoppingListDto> Execute(Guid mealPlanId, CancellationToken ct = default)
    {
        var mealPlan = await db.MealPlans
            .AsNoTracking()
            .Include(mp => mp.MealPlanRecipes)
            .ThenInclude(mpr => mpr.Recipe)
            .ThenInclude(r => r.Ingredients)
            .FirstOrDefaultAsync(mp => mp.Id == mealPlanId, ct);

        if (mealPlan is null)
            throw new InvalidOperationException("Meal plan does not exist.");

        // Group all ingredients by name and aggregate quantities
        var ingredientGroups = new Dictionary<string, ShoppingListItem>();

        foreach (var mealPlanRecipe in mealPlan.MealPlanRecipes)
        {
            var recipe = mealPlanRecipe.Recipe;
            foreach (var ingredient in recipe.Ingredients)
            {
                var key = ingredient.Name.ToLower().Trim();

                if (!ingredientGroups.ContainsKey(key))
                {
                    ingredientGroups[key] = new ShoppingListItem
                    {
                        Name = ingredient.Name,
                        Unit = ingredient.Unit,
                        TotalQuantity = 0,
                        TotalCost = 0,
                        TotalCalories = 0
                    };
                }

                var item = ingredientGroups[key];

                // Calculate quantity needed based on meal plan serving size and recipe servings
                var servingMultiplier = (decimal)mealPlan.ServingSize / recipe.OriginalServings;
                var quantityNeeded = (ingredient.Quantity ?? 0) * servingMultiplier * ingredient.ProportionFactor * recipe.ProportionFactor;

                item.TotalQuantity += quantityNeeded;

                if (ingredient.CostPerUnit.HasValue)
                {
                    item.TotalCost += ingredient.CostPerUnit.Value * quantityNeeded;
                }

                if (ingredient.CaloriesPerUnit.HasValue)
                {
                    item.TotalCalories += ingredient.CaloriesPerUnit.Value * quantityNeeded;
                }
            }
        }

        var items = ingredientGroups.Values
            .Select(item => new ShoppingListItemDto(
                item.Name,
                item.TotalQuantity,
                item.Unit,
                item.TotalCost > 0 ? item.TotalCost : null,
                item.TotalCalories > 0 ? item.TotalCalories : null
            ))
            .OrderBy(item => item.IngredientName)
            .ToList();

        var totalCost = items.Sum(i => i.EstimatedCost ?? 0);
        var totalCalories = items.Sum(i => i.TotalCalories ?? 0);

        return new ShoppingListDto(
            mealPlan.Id,
            mealPlan.Name,
            mealPlan.ServingSize,
            items,
            totalCost,
            totalCalories
        );
    }

    private class ShoppingListItem
    {
        public string Name { get; set; } = default!;
        public string? Unit { get; set; }
        public decimal TotalQuantity { get; set; }
        public decimal TotalCost { get; set; }
        public decimal TotalCalories { get; set; }
    }
}
