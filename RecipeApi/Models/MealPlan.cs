namespace Recipe.Api.Models;

public class MealPlan
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = default!; // e.g., "Week of Dec 18"
    public DateTime StartDate { get; set; } // Sunday of the week
    public DateTime EndDate { get; set; } // Saturday of the week
    public int ServingSize { get; set; } = 1; // How many people this meal plan is for

    // Active meal types for this plan
    public bool IncludesBreakfast { get; set; } = false;
    public bool IncludesSnack1 { get; set; } = false;
    public bool IncludesLunch { get; set; } = false;
    public bool IncludesSnack2 { get; set; } = false;
    public bool IncludesDinner { get; set; } = true;
    public bool IncludesSnack3 { get; set; } = false; // Dessert

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public User User { get; set; } = default!;
    public ICollection<MealPlanRecipe> MealPlanRecipes { get; set; } = new List<MealPlanRecipe>();
}
