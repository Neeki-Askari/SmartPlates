namespace Recipe.Api.Models;

public class SavedShoppingList
{
    public Guid Id { get; set; }
    public Guid MealPlanId { get; set; }
    public Guid UserId { get; set; }
    public string MealPlanName { get; set; } = default!;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int ServingSize { get; set; }
    public string ItemsJson { get; set; } = default!; // JSON serialized ShoppingListItem[]
    public decimal TotalEstimatedCost { get; set; }
    public decimal TotalCalories { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public User User { get; set; } = default!;
    public MealPlan MealPlan { get; set; } = default!;
}
