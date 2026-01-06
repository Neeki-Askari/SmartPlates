namespace Recipe.Api.Models;

public class Ingredient
{
    public Guid Id { get; set; }
    public Guid RecipeId { get; set; }
    public string Name { get; set; } = default!;

    // Quantity and measurements
    public decimal? Quantity { get; set; } // Original quantity from recipe
    public string? Unit { get; set; } // e.g., "cup", "tbsp", "oz", "g"

    // Cost and nutrition (per size bought)
    public decimal? CostPerUnit { get; set; } // Cost per unit size
    public decimal? CaloriesPerUnit { get; set; } // Calories per unit size
    public string? SizeBought { get; set; } // e.g., "1 lb", "500g", "1 bottle"

    // User's custom proportion for single person (flavor adjustment)
    public decimal ProportionFactor { get; set; } = 1.0m;

    public Recipe Recipe { get; set; } = default!;
}
