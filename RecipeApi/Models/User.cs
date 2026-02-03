namespace Recipe.Api.Models;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = default!;
    public string DisplayName { get; set; } = default!;
    public string? Auth0SubjectId { get; set; } // Auth0 'sub' claim (e.g., auth0|123456)
    public string? PasswordHash { get; set; } // For local authentication (BCrypt hashed)
    public string? OAuthProvider { get; set; } // "Google", "Apple", "Microsoft", null for local
    public string? OAuthProviderId { get; set; } // ID from the OAuth provider
    public bool EmailVerified { get; set; } = false; // Email verification status
    public string? RefreshToken { get; set; } // For JWT refresh token rotation
    public DateTime? RefreshTokenExpiry { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Recipe> Recipes { get; set; } = new List<Recipe>();
    public ICollection<MealPlan> MealPlans { get; set; } = new List<MealPlan>();
    public ICollection<SharedRecipe> SharedRecipes { get; set; } = new List<SharedRecipe>();
    public ICollection<SharedRecipe> ReceivedSharedRecipes { get; set; } = new List<SharedRecipe>();
}
