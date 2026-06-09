using Microsoft.EntityFrameworkCore;
using Recipe.Api.Models;

namespace Recipe.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Recipe.Api.Models.Recipe> Recipes => Set<Recipe.Api.Models.Recipe>();
    public DbSet<Ingredient> Ingredients => Set<Ingredient>();
    public DbSet<MealPlan> MealPlans => Set<MealPlan>();
    public DbSet<MealPlanRecipe> MealPlanRecipes => Set<MealPlanRecipe>();
    public DbSet<SharedRecipe> SharedRecipes => Set<SharedRecipe>();
    public DbSet<SavedShoppingList> SavedShoppingLists => Set<SavedShoppingList>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // User configuration
        modelBuilder.Entity<User>(b =>
        {
            b.HasKey(x => x.Id);
            b.Property(x => x.Email).IsRequired().HasMaxLength(200);
            b.HasIndex(x => x.Email).IsUnique();
            b.Property(x => x.DisplayName).IsRequired().HasMaxLength(120);
            b.Property(x => x.Auth0SubjectId).HasMaxLength(200);
            b.Property(x => x.PasswordHash).HasMaxLength(500);
            b.Property(x => x.OAuthProvider).HasMaxLength(50);
            b.Property(x => x.OAuthProviderId).HasMaxLength(200);
            b.Property(x => x.RefreshToken).HasMaxLength(500);

            // Create indexes for lookups
            b.HasIndex(x => x.Auth0SubjectId).IsUnique();
            b.HasIndex(x => new { x.OAuthProvider, x.OAuthProviderId });

            b.HasMany(x => x.Recipes)
             .WithOne(r => r.User)
             .HasForeignKey(r => r.UserId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasMany(x => x.MealPlans)
             .WithOne(mp => mp.User)
             .HasForeignKey(mp => mp.UserId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasMany(x => x.SharedRecipes)
             .WithOne(sr => sr.OriginalOwner)
             .HasForeignKey(sr => sr.OriginalOwnerId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasMany(x => x.ReceivedSharedRecipes)
             .WithOne(sr => sr.SharedWithUser)
             .HasForeignKey(sr => sr.SharedWithUserId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // Recipe configuration
        modelBuilder.Entity<Recipe.Api.Models.Recipe>(b =>
        {
            b.HasKey(x => x.Id);
            b.Property(x => x.Title).IsRequired().HasMaxLength(200);
            b.Property(x => x.CuisineType).HasMaxLength(100);
            b.Property(x => x.HealthRating).HasMaxLength(100);
            b.Property(x => x.ProportionFactor).HasPrecision(5, 2);

            b.HasMany(x => x.Ingredients)
             .WithOne(i => i.Recipe)
             .HasForeignKey(i => i.RecipeId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasMany(x => x.MealPlanRecipes)
             .WithOne(mpr => mpr.Recipe)
             .HasForeignKey(mpr => mpr.RecipeId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // Ingredient configuration
        modelBuilder.Entity<Ingredient>(b =>
        {
            b.HasKey(x => x.Id);
            b.Property(x => x.Name).IsRequired().HasMaxLength(200);
            b.Property(x => x.Quantity).HasPrecision(10, 3);
            b.Property(x => x.CostPerUnit).HasPrecision(10, 2);
            b.Property(x => x.CaloriesPerUnit).HasPrecision(10, 2);
            b.Property(x => x.ProportionFactor).HasPrecision(5, 2);
            b.Property(x => x.Unit).HasMaxLength(50);
            b.Property(x => x.SizeBought).HasMaxLength(100);
        });

        // MealPlan configuration
        modelBuilder.Entity<MealPlan>(b =>
        {
            b.HasKey(x => x.Id);
            b.Property(x => x.Name).IsRequired().HasMaxLength(200);

            b.HasMany(x => x.MealPlanRecipes)
             .WithOne(mpr => mpr.MealPlan)
             .HasForeignKey(mpr => mpr.MealPlanId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // MealPlanRecipe configuration
        modelBuilder.Entity<MealPlanRecipe>(b =>
        {
            b.HasKey(x => x.Id);
            b.Property(x => x.HealthRatingConstraint).HasMaxLength(100);
            b.Property(x => x.CuisineTypeConstraint).HasMaxLength(100);

            // Composite index for fast slot lookups (multiple recipes per slot allowed)
            b.HasIndex(x => new { x.MealPlanId, x.DayOfWeek, x.MealType });
        });

        // SharedRecipe configuration
        modelBuilder.Entity<SharedRecipe>(b =>
        {
            b.HasKey(x => x.Id);

            b.HasOne(x => x.OriginalRecipe)
             .WithMany()
             .HasForeignKey(x => x.OriginalRecipeId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // SavedShoppingList configuration
        modelBuilder.Entity<SavedShoppingList>(b =>
        {
            b.HasKey(x => x.Id);
            b.Property(x => x.MealPlanName).IsRequired().HasMaxLength(200);
            b.Property(x => x.ItemsJson).IsRequired();
            b.Property(x => x.TotalEstimatedCost).HasPrecision(10, 2);
            b.Property(x => x.TotalCalories).HasPrecision(10, 2);

            b.HasOne(x => x.User)
             .WithMany()
             .HasForeignKey(x => x.UserId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(x => x.MealPlan)
             .WithMany()
             .HasForeignKey(x => x.MealPlanId)
             .OnDelete(DeleteBehavior.Cascade);

            // Index for querying user's shopping lists
            b.HasIndex(x => x.UserId);
            b.HasIndex(x => x.MealPlanId);
        });
    }
}
