namespace Recipe.Api.Models;

public class Recipe
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public string? Instructions { get; set; }

    // Categorization
    public string? CuisineType { get; set; } // e.g., "American", "Mexican", "Italian"
    public string? HealthRating { get; set; } // e.g., "Unhealthy", "Healthy", "Neutral", "Gluten Free", "Spicy"

    // Additional info
    public string? Comments { get; set; }
    public string? RecipeLink { get; set; } // Link to recipe/video

    // Serving and proportions
    public int OriginalServings { get; set; } = 1; // How many people the original recipe serves
    public decimal ProportionFactor { get; set; } = 1.0m; // User's custom proportion adjustment

    // Visibility
    public bool IsPublic { get; set; } = true; // false = private (only visible to owner)

    // Tracking
    public DateTime? LastCookedDate { get; set; } // Null means never cooked
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public User User { get; set; } = default!;
    public ICollection<Ingredient> Ingredients { get; set; } = new List<Ingredient>();
    public ICollection<MealPlanRecipe> MealPlanRecipes { get; set; } = new List<MealPlanRecipe>();
}
