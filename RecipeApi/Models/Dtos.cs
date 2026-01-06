// Models/Dtos.cs
namespace Recipe.Api.Models;

// ===== USER DTOs =====
public record UserDto(Guid Id, string Email, string DisplayName, DateTime CreatedAt);
public record CreateUserDto(string Email, string DisplayName, string? Password);
public record UpdateUserDto(string DisplayName, string? Password);
public record LoginDto(string Email, string Password);

// ===== INGREDIENT DTOs =====
public record IngredientInput(
    string Name,
    decimal? Quantity,
    string? Unit,
    decimal? CostPerUnit,
    decimal? CaloriesPerUnit,
    string? SizeBought,
    decimal ProportionFactor = 1.0m
);

public record IngredientDto(
    Guid Id,
    Guid RecipeId,
    string Name,
    decimal? Quantity,
    string? Unit,
    decimal? CostPerUnit,
    decimal? CaloriesPerUnit,
    string? SizeBought,
    decimal ProportionFactor
);

public record UpdateIngredientDto(
    string Name,
    decimal? Quantity,
    string? Unit,
    decimal? CostPerUnit,
    decimal? CaloriesPerUnit,
    string? SizeBought,
    decimal ProportionFactor
);

// ===== RECIPE DTOs =====
public record CreateRecipeDto(
    Guid UserId,
    string Title,
    string? Description,
    string? Instructions,
    string? CuisineType,
    string? HealthRating,
    string? Comments,
    string? RecipeLink,
    int OriginalServings,
    decimal ProportionFactor,
    List<IngredientInput> Ingredients
);

public record UpdateRecipeDto(
    string Title,
    string? Description,
    string? Instructions,
    string? CuisineType,
    string? HealthRating,
    string? Comments,
    string? RecipeLink,
    int OriginalServings,
    decimal ProportionFactor,
    DateTime? LastCookedDate,
    List<IngredientInput> Ingredients
);

public record RecipeDto(
    Guid Id,
    Guid UserId,
    string Title,
    string? Description,
    string? Instructions,
    string? CuisineType,
    string? HealthRating,
    string? Comments,
    string? RecipeLink,
    int OriginalServings,
    decimal ProportionFactor,
    DateTime? LastCookedDate,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record RecipeWithIngredientsDto(
    Guid Id,
    Guid UserId,
    string Title,
    string? Description,
    string? Instructions,
    string? CuisineType,
    string? HealthRating,
    string? Comments,
    string? RecipeLink,
    int OriginalServings,
    decimal ProportionFactor,
    DateTime? LastCookedDate,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    IReadOnlyList<IngredientDto> Ingredients
);

public record GetAllRecipesDto(
    Guid? UserId = null,
    string? CuisineType = null,
    string? HealthRating = null,
    string? SearchTerm = null,
    string? SortBy = null, // "name", "lastCooked", "createdAt"
    bool IncludeIngredients = false,
    int Page = 1,
    int PageSize = 50
);

public record SearchRecipesByIngredientsDto(
    Guid UserId,
    List<string> IngredientNames,
    bool MatchAll = false // true = must have all ingredients, false = match any
);

// ===== MEAL PLAN DTOs =====
public record CreateMealPlanDto(
    Guid UserId,
    string Name,
    DateTime StartDate,
    DateTime EndDate,
    int ServingSize,
    bool IncludesBreakfast,
    bool IncludesSnack1,
    bool IncludesLunch,
    bool IncludesSnack2,
    bool IncludesDinner,
    bool IncludesSnack3
);

public record UpdateMealPlanDto(
    string Name,
    int ServingSize,
    bool IncludesBreakfast,
    bool IncludesSnack1,
    bool IncludesLunch,
    bool IncludesSnack2,
    bool IncludesDinner,
    bool IncludesSnack3
);

public record MealPlanDto(
    Guid Id,
    Guid UserId,
    string Name,
    DateTime StartDate,
    DateTime EndDate,
    int ServingSize,
    bool IncludesBreakfast,
    bool IncludesSnack1,
    bool IncludesLunch,
    bool IncludesSnack2,
    bool IncludesDinner,
    bool IncludesSnack3,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record MealPlanWithRecipesDto(
    Guid Id,
    Guid UserId,
    string Name,
    DateTime StartDate,
    DateTime EndDate,
    int ServingSize,
    bool IncludesBreakfast,
    bool IncludesSnack1,
    bool IncludesLunch,
    bool IncludesSnack2,
    bool IncludesDinner,
    bool IncludesSnack3,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    IReadOnlyList<MealPlanRecipeDto> MealPlanRecipes
);

public record MealPlanRecipeDto(
    Guid Id,
    Guid MealPlanId,
    Guid RecipeId,
    DayOfWeek DayOfWeek,
    MealType MealType,
    string? HealthRatingConstraint,
    string? CuisineTypeConstraint,
    RecipeDto Recipe
);

public record AddRecipeToMealPlanDto(
    Guid MealPlanId,
    Guid RecipeId,
    DayOfWeek DayOfWeek,
    MealType MealType,
    string? HealthRatingConstraint,
    string? CuisineTypeConstraint
);

public record RandomizeRecipeDto(
    Guid MealPlanId,
    DayOfWeek DayOfWeek,
    MealType MealType,
    string? HealthRatingConstraint,
    string? CuisineTypeConstraint,
    List<string>? ExcludeIngredients,
    int OptionCount = 1
);

// ===== SHARED RECIPE DTOs =====
public record ShareRecipeDto(
    Guid RecipeId,
    Guid SharedWithUserId
);

public record SharedRecipeDto(
    Guid Id,
    Guid OriginalRecipeId,
    Guid OriginalOwnerId,
    Guid SharedWithUserId,
    DateTime SharedAt,
    Guid? CopiedRecipeId,
    RecipeWithIngredientsDto OriginalRecipe,
    UserDto OriginalOwner
);

// ===== SHOPPING LIST DTOs =====
public record ShoppingListItemDto(
    string IngredientName,
    decimal TotalQuantity,
    string? Unit,
    decimal? EstimatedCost,
    decimal? TotalCalories
);

public record ShoppingListDto(
    Guid MealPlanId,
    string MealPlanName,
    int ServingSize,
    IReadOnlyList<ShoppingListItemDto> Items,
    decimal TotalEstimatedCost,
    decimal TotalCalories
);
