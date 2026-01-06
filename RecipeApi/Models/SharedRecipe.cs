namespace Recipe.Api.Models;

public class SharedRecipe
{
    public Guid Id { get; set; }
    public Guid OriginalRecipeId { get; set; } // The original recipe
    public Guid OriginalOwnerId { get; set; } // Who created/shared it
    public Guid SharedWithUserId { get; set; } // Who received it
    public DateTime SharedAt { get; set; } = DateTime.UtcNow;

    // When user receives a shared recipe, they can create their own copy
    // This tracks the copied version (null if they haven't copied it yet)
    public Guid? CopiedRecipeId { get; set; }

    // Navigation properties
    public Recipe OriginalRecipe { get; set; } = default!;
    public User OriginalOwner { get; set; } = default!;
    public User SharedWithUser { get; set; } = default!;
}
