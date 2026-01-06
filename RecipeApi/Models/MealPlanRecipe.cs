namespace Recipe.Api.Models;

public class MealPlanRecipe
{
    public Guid Id { get; set; }
    public Guid MealPlanId { get; set; }
    public Guid RecipeId { get; set; }

    // Which day and meal type
    public DayOfWeek DayOfWeek { get; set; } // 0 = Sunday, 6 = Saturday
    public MealType MealType { get; set; }

    // Constraints used when this recipe was selected (for tracking)
    public string? HealthRatingConstraint { get; set; }
    public string? CuisineTypeConstraint { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public MealPlan MealPlan { get; set; } = default!;
    public Recipe Recipe { get; set; } = default!;
}

public enum MealType
{
    Breakfast = 0,
    Snack1 = 1,
    Lunch = 2,
    Snack2 = 3,
    Dinner = 4,
    Snack3 = 5 // Dessert
}
