namespace Recipe.Api.Models;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = default!;
    public string DisplayName { get; set; } = default!;
    public string? PasswordHash { get; set; } // For authentication
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Recipe> Recipes { get; set; } = new List<Recipe>();
    public ICollection<MealPlan> MealPlans { get; set; } = new List<MealPlan>();
    public ICollection<SharedRecipe> SharedRecipes { get; set; } = new List<SharedRecipe>();
    public ICollection<SharedRecipe> ReceivedSharedRecipes { get; set; } = new List<SharedRecipe>();
}
