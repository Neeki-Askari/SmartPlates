// RecipeApi/Seed/DbSeeder.cs
using Microsoft.EntityFrameworkCore;
using Recipe.Api.Data;
using Recipe.Api.Models;

namespace Recipe.Api.Seed;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db, ILogger logger, CancellationToken ct = default)
    {
        // Idempotency: if any user exists, assume seeded and bail out
        if (await db.Users.AnyAsync(ct))
        {
            logger.LogInformation("Seed: data already present, skipping.");
            return;
        }

        logger.LogInformation("Seed: inserting demo users, recipes, and meal plans...");

        await using var tx = await db.Database.BeginTransactionAsync(ct);

        // Create two demo users - using fixed GUIDs for frontend development
        var user1Id = new Guid("00000000-0000-0000-0000-000000000001");
        var user2Id = new Guid("00000000-0000-0000-0000-000000000002");

        var user1 = new User
        {
            Id = user1Id,
            Email = "demo@example.com",
            DisplayName = "Demo Chef",
        };

        var user2 = new User
        {
            Id = user2Id,
            Email = "john.doe@example.com",
            DisplayName = "John Doe",
        };

        db.Users.AddRange(user1, user2);

        // Create comprehensive recipe collection for user1
        var recipes = new List<Recipe.Api.Models.Recipe>
        {
            // BREAKFAST RECIPES
            new()
            {
                Id = Guid.NewGuid(),
                UserId = user1Id,
                Title = "Classic Pancakes",
                Description = "Fluffy American-style pancakes perfect for weekend breakfast",
                Instructions = "1. Mix dry ingredients\n2. Add wet ingredients\n3. Cook on griddle until bubbles form\n4. Flip and cook until golden",
                CuisineType = "American",
                HealthRating = "Neutral",
                OriginalServings = 4,
                ProportionFactor = 1.0m,
                RecipeLink = "https://example.com/pancakes",
                Comments = "Kids love these!",
                LastCookedDate = DateTime.UtcNow.AddDays(-5),
                Ingredients = new List<Ingredient>
                {
                    new() { Id = Guid.NewGuid(), Name = "All-purpose flour", Quantity = 2, Unit = "cups", CostPerUnit = 0.15m, CaloriesPerUnit = 455, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Milk", Quantity = 1.5m, Unit = "cups", CostPerUnit = 0.30m, CaloriesPerUnit = 122, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Eggs", Quantity = 2, Unit = "pcs", CostPerUnit = 0.40m, CaloriesPerUnit = 140, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Sugar", Quantity = 2, Unit = "tbsp", CostPerUnit = 0.05m, CaloriesPerUnit = 100, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Baking powder", Quantity = 2, Unit = "tsp", CostPerUnit = 0.10m, CaloriesPerUnit = 5, ProportionFactor = 1.0m },
                }
            },
            new()
            {
                Id = Guid.NewGuid(),
                UserId = user1Id,
                Title = "Avocado Toast",
                Description = "Healthy and trendy breakfast with whole grain bread",
                Instructions = "1. Toast bread\n2. Mash avocado with lemon juice\n3. Spread on toast\n4. Top with salt, pepper, and red pepper flakes",
                CuisineType = "American",
                HealthRating = "Healthy",
                OriginalServings = 2,
                ProportionFactor = 1.0m,
                LastCookedDate = DateTime.UtcNow.AddDays(-2),
                Ingredients = new List<Ingredient>
                {
                    new() { Id = Guid.NewGuid(), Name = "Whole grain bread", Quantity = 4, Unit = "slices", CostPerUnit = 0.50m, CaloriesPerUnit = 280, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Avocado", Quantity = 2, Unit = "pcs", CostPerUnit = 1.50m, CaloriesPerUnit = 240, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Lemon juice", Quantity = 2, Unit = "tsp", CostPerUnit = 0.10m, CaloriesPerUnit = 5, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Red pepper flakes", Quantity = 0.5m, Unit = "tsp", CostPerUnit = 0.05m, CaloriesPerUnit = 3, ProportionFactor = 1.0m },
                }
            },
            new()
            {
                Id = Guid.NewGuid(),
                UserId = user1Id,
                Title = "Greek Yogurt Parfait",
                Description = "Light and healthy breakfast with fresh berries",
                Instructions = "Layer yogurt, granola, and berries in a glass. Drizzle with honey.",
                CuisineType = "Greek",
                HealthRating = "Healthy",
                OriginalServings = 2,
                ProportionFactor = 1.0m,
                Ingredients = new List<Ingredient>
                {
                    new() { Id = Guid.NewGuid(), Name = "Greek yogurt", Quantity = 2, Unit = "cups", CostPerUnit = 1.20m, CaloriesPerUnit = 200, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Granola", Quantity = 1, Unit = "cup", CostPerUnit = 0.80m, CaloriesPerUnit = 450, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Mixed berries", Quantity = 1.5m, Unit = "cups", CostPerUnit = 2.00m, CaloriesPerUnit = 84, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Honey", Quantity = 2, Unit = "tbsp", CostPerUnit = 0.30m, CaloriesPerUnit = 128, ProportionFactor = 1.0m },
                }
            },

            // LUNCH RECIPES
            new()
            {
                Id = Guid.NewGuid(),
                UserId = user1Id,
                Title = "Caesar Salad",
                Description = "Classic Caesar with crispy romaine and parmesan",
                Instructions = "1. Chop romaine\n2. Make dressing with anchovies, garlic, lemon\n3. Add croutons and parmesan\n4. Toss well",
                CuisineType = "Italian",
                HealthRating = "Healthy",
                OriginalServings = 4,
                ProportionFactor = 1.0m,
                RecipeLink = "https://example.com/caesar",
                LastCookedDate = DateTime.UtcNow.AddDays(-7),
                Ingredients = new List<Ingredient>
                {
                    new() { Id = Guid.NewGuid(), Name = "Romaine lettuce", Quantity = 2, Unit = "heads", CostPerUnit = 1.50m, CaloriesPerUnit = 34, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Parmesan cheese", Quantity = 0.5m, Unit = "cup", CostPerUnit = 2.50m, CaloriesPerUnit = 215, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Croutons", Quantity = 1, Unit = "cup", CostPerUnit = 1.00m, CaloriesPerUnit = 122, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Caesar dressing", Quantity = 0.5m, Unit = "cup", CostPerUnit = 1.50m, CaloriesPerUnit = 338, ProportionFactor = 1.0m },
                }
            },
            new()
            {
                Id = Guid.NewGuid(),
                UserId = user1Id,
                Title = "Chicken Burrito Bowl",
                Description = "Mexican-inspired bowl with rice, beans, and chicken",
                Instructions = "1. Cook rice\n2. Season and grill chicken\n3. Heat black beans\n4. Assemble bowl with toppings",
                CuisineType = "Mexican",
                HealthRating = "Healthy",
                OriginalServings = 4,
                ProportionFactor = 1.0m,
                LastCookedDate = DateTime.UtcNow.AddDays(-3),
                Ingredients = new List<Ingredient>
                {
                    new() { Id = Guid.NewGuid(), Name = "Rice", Quantity = 2, Unit = "cups", CostPerUnit = 0.80m, CaloriesPerUnit = 411, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Chicken breast", Quantity = 1, Unit = "lb", CostPerUnit = 4.50m, CaloriesPerUnit = 748, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Black beans", Quantity = 1, Unit = "can", CostPerUnit = 1.20m, CaloriesPerUnit = 227, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Corn", Quantity = 1, Unit = "cup", CostPerUnit = 0.80m, CaloriesPerUnit = 132, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Salsa", Quantity = 1, Unit = "cup", CostPerUnit = 1.50m, CaloriesPerUnit = 70, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Sour cream", Quantity = 0.5m, Unit = "cup", CostPerUnit = 0.80m, CaloriesPerUnit = 222, ProportionFactor = 1.0m },
                }
            },

            // DINNER RECIPES
            new()
            {
                Id = Guid.NewGuid(),
                UserId = user1Id,
                Title = "Spaghetti Carbonara",
                Description = "Classic Italian pasta with eggs, cheese, and pancetta",
                Instructions = "1. Cook pasta\n2. Fry pancetta\n3. Mix eggs and cheese\n4. Combine everything off heat\n5. Season with black pepper",
                CuisineType = "Italian",
                HealthRating = "Neutral",
                OriginalServings = 4,
                ProportionFactor = 1.0m,
                RecipeLink = "https://example.com/carbonara",
                LastCookedDate = DateTime.UtcNow.AddDays(-4),
                Ingredients = new List<Ingredient>
                {
                    new() { Id = Guid.NewGuid(), Name = "Spaghetti", Quantity = 1, Unit = "lb", CostPerUnit = 1.50m, CaloriesPerUnit = 1638, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Pancetta", Quantity = 8, Unit = "oz", CostPerUnit = 4.00m, CaloriesPerUnit = 560, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Eggs", Quantity = 4, Unit = "pcs", CostPerUnit = 0.80m, CaloriesPerUnit = 280, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Parmesan cheese", Quantity = 1, Unit = "cup", CostPerUnit = 5.00m, CaloriesPerUnit = 431, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Black pepper", Quantity = 2, Unit = "tsp", CostPerUnit = 0.10m, CaloriesPerUnit = 12, ProportionFactor = 1.0m },
                }
            },
            new()
            {
                Id = Guid.NewGuid(),
                UserId = user1Id,
                Title = "Beef Tacos",
                Description = "Seasoned ground beef in soft tortillas with fresh toppings",
                Instructions = "1. Brown ground beef\n2. Add taco seasoning\n3. Warm tortillas\n4. Assemble with lettuce, cheese, tomatoes, and sour cream",
                CuisineType = "Mexican",
                HealthRating = "Neutral",
                OriginalServings = 4,
                ProportionFactor = 1.0m,
                Comments = "Family favorite!",
                LastCookedDate = DateTime.UtcNow.AddDays(-1),
                Ingredients = new List<Ingredient>
                {
                    new() { Id = Guid.NewGuid(), Name = "Ground beef", Quantity = 1, Unit = "lb", CostPerUnit = 5.50m, CaloriesPerUnit = 1152, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Taco seasoning", Quantity = 2, Unit = "tbsp", CostPerUnit = 0.50m, CaloriesPerUnit = 30, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Tortillas", Quantity = 8, Unit = "pcs", CostPerUnit = 2.00m, CaloriesPerUnit = 560, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Lettuce", Quantity = 2, Unit = "cups", CostPerUnit = 0.80m, CaloriesPerUnit = 10, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Cheddar cheese", Quantity = 1, Unit = "cup", CostPerUnit = 2.50m, CaloriesPerUnit = 455, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Tomatoes", Quantity = 2, Unit = "pcs", CostPerUnit = 1.50m, CaloriesPerUnit = 44, ProportionFactor = 1.0m },
                }
            },
            new()
            {
                Id = Guid.NewGuid(),
                UserId = user1Id,
                Title = "Grilled Salmon with Vegetables",
                Description = "Healthy omega-3 rich salmon with roasted vegetables",
                Instructions = "1. Season salmon with lemon and herbs\n2. Grill 4-5 min per side\n3. Roast vegetables at 400°F for 25 min",
                CuisineType = "Mediterranean",
                HealthRating = "Healthy",
                OriginalServings = 4,
                ProportionFactor = 1.0m,
                Ingredients = new List<Ingredient>
                {
                    new() { Id = Guid.NewGuid(), Name = "Salmon fillets", Quantity = 4, Unit = "pcs", CostPerUnit = 12.00m, CaloriesPerUnit = 824, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Broccoli", Quantity = 2, Unit = "cups", CostPerUnit = 1.50m, CaloriesPerUnit = 62, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Bell peppers", Quantity = 2, Unit = "pcs", CostPerUnit = 2.00m, CaloriesPerUnit = 50, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Olive oil", Quantity = 3, Unit = "tbsp", CostPerUnit = 0.50m, CaloriesPerUnit = 358, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Lemon", Quantity = 1, Unit = "pc", CostPerUnit = 0.50m, CaloriesPerUnit = 24, ProportionFactor = 1.0m },
                }
            },
            new()
            {
                Id = Guid.NewGuid(),
                UserId = user1Id,
                Title = "Chicken Stir Fry",
                Description = "Quick Asian-inspired stir fry with vegetables",
                Instructions = "1. Cut chicken into strips\n2. Stir fry chicken in wok\n3. Add vegetables\n4. Add soy sauce mixture\n5. Serve over rice",
                CuisineType = "Chinese",
                HealthRating = "Healthy",
                OriginalServings = 4,
                ProportionFactor = 1.0m,
                Ingredients = new List<Ingredient>
                {
                    new() { Id = Guid.NewGuid(), Name = "Chicken breast", Quantity = 1.5m, Unit = "lbs", CostPerUnit = 6.75m, CaloriesPerUnit = 1122, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Mixed vegetables", Quantity = 4, Unit = "cups", CostPerUnit = 3.00m, CaloriesPerUnit = 100, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Soy sauce", Quantity = 0.25m, Unit = "cup", CostPerUnit = 0.50m, CaloriesPerUnit = 38, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Ginger", Quantity = 1, Unit = "tbsp", CostPerUnit = 0.30m, CaloriesPerUnit = 5, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Garlic", Quantity = 3, Unit = "cloves", CostPerUnit = 0.20m, CaloriesPerUnit = 13, ProportionFactor = 1.0m },
                }
            },
            new()
            {
                Id = Guid.NewGuid(),
                UserId = user1Id,
                Title = "Margherita Pizza",
                Description = "Simple Italian pizza with tomatoes, mozzarella, and basil",
                Instructions = "1. Roll out pizza dough\n2. Spread tomato sauce\n3. Add mozzarella\n4. Bake at 475°F for 12-15 min\n5. Top with fresh basil",
                CuisineType = "Italian",
                HealthRating = "Neutral",
                OriginalServings = 4,
                ProportionFactor = 1.0m,
                Ingredients = new List<Ingredient>
                {
                    new() { Id = Guid.NewGuid(), Name = "Pizza dough", Quantity = 1, Unit = "lb", CostPerUnit = 2.00m, CaloriesPerUnit = 1093, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Tomato sauce", Quantity = 1, Unit = "cup", CostPerUnit = 1.50m, CaloriesPerUnit = 78, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Fresh mozzarella", Quantity = 8, Unit = "oz", CostPerUnit = 4.00m, CaloriesPerUnit = 560, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Fresh basil", Quantity = 0.5m, Unit = "cup", CostPerUnit = 1.00m, CaloriesPerUnit = 2, ProportionFactor = 1.0m },
                }
            },

            // SNACKS
            new()
            {
                Id = Guid.NewGuid(),
                UserId = user1Id,
                Title = "Hummus with Veggies",
                Description = "Healthy chickpea dip with fresh vegetables",
                Instructions = "Blend chickpeas, tahini, lemon juice, garlic, and olive oil until smooth. Serve with cut vegetables.",
                CuisineType = "Mediterranean",
                HealthRating = "Healthy",
                OriginalServings = 6,
                ProportionFactor = 1.0m,
                Ingredients = new List<Ingredient>
                {
                    new() { Id = Guid.NewGuid(), Name = "Chickpeas", Quantity = 2, Unit = "cans", CostPerUnit = 2.40m, CaloriesPerUnit = 454, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Tahini", Quantity = 0.25m, Unit = "cup", CostPerUnit = 2.00m, CaloriesPerUnit = 356, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Lemon juice", Quantity = 3, Unit = "tbsp", CostPerUnit = 0.30m, CaloriesPerUnit = 15, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Carrots", Quantity = 4, Unit = "pcs", CostPerUnit = 1.50m, CaloriesPerUnit = 100, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Celery", Quantity = 4, Unit = "stalks", CostPerUnit = 1.00m, CaloriesPerUnit = 24, ProportionFactor = 1.0m },
                }
            },
            new()
            {
                Id = Guid.NewGuid(),
                UserId = user1Id,
                Title = "Chocolate Chip Cookies",
                Description = "Classic homemade cookies with chocolate chips",
                Instructions = "1. Cream butter and sugars\n2. Add eggs and vanilla\n3. Mix in dry ingredients\n4. Fold in chocolate chips\n5. Bake at 350°F for 10-12 min",
                CuisineType = "American",
                HealthRating = "Unhealthy",
                OriginalServings = 24,
                ProportionFactor = 1.0m,
                Comments = "Perfect for dessert!",
                Ingredients = new List<Ingredient>
                {
                    new() { Id = Guid.NewGuid(), Name = "Butter", Quantity = 1, Unit = "cup", CostPerUnit = 2.50m, CaloriesPerUnit = 1627, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Brown sugar", Quantity = 1, Unit = "cup", CostPerUnit = 1.50m, CaloriesPerUnit = 827, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "White sugar", Quantity = 0.5m, Unit = "cup", CostPerUnit = 0.50m, CaloriesPerUnit = 387, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Eggs", Quantity = 2, Unit = "pcs", CostPerUnit = 0.40m, CaloriesPerUnit = 140, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "All-purpose flour", Quantity = 2.25m, Unit = "cups", CostPerUnit = 0.70m, CaloriesPerUnit = 912, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Chocolate chips", Quantity = 2, Unit = "cups", CostPerUnit = 4.00m, CaloriesPerUnit = 1664, ProportionFactor = 1.0m },
                }
            },

            // VEGETARIAN OPTIONS
            new()
            {
                Id = Guid.NewGuid(),
                UserId = user1Id,
                Title = "Lentil Soup",
                Description = "Hearty and nutritious vegetarian soup",
                Instructions = "1. Sauté onions, carrots, celery\n2. Add lentils and broth\n3. Simmer 30 minutes\n4. Season with herbs",
                CuisineType = "Mediterranean",
                HealthRating = "Healthy",
                OriginalServings = 6,
                ProportionFactor = 1.0m,
                Ingredients = new List<Ingredient>
                {
                    new() { Id = Guid.NewGuid(), Name = "Lentils", Quantity = 2, Unit = "cups", CostPerUnit = 2.00m, CaloriesPerUnit = 452, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Vegetable broth", Quantity = 6, Unit = "cups", CostPerUnit = 3.00m, CaloriesPerUnit = 90, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Carrots", Quantity = 2, Unit = "pcs", CostPerUnit = 0.75m, CaloriesPerUnit = 50, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Onion", Quantity = 1, Unit = "pc", CostPerUnit = 0.50m, CaloriesPerUnit = 44, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Celery", Quantity = 2, Unit = "stalks", CostPerUnit = 0.50m, CaloriesPerUnit = 12, ProportionFactor = 1.0m },
                }
            },

            // SPICY OPTION
            new()
            {
                Id = Guid.NewGuid(),
                UserId = user1Id,
                Title = "Spicy Thai Curry",
                Description = "Red curry with vegetables and coconut milk",
                Instructions = "1. Sauté curry paste\n2. Add coconut milk\n3. Add vegetables\n4. Simmer until tender\n5. Serve over rice",
                CuisineType = "Thai",
                HealthRating = "Spicy",
                OriginalServings = 4,
                ProportionFactor = 1.0m,
                Comments = "Very spicy! Reduce curry paste for milder version.",
                Ingredients = new List<Ingredient>
                {
                    new() { Id = Guid.NewGuid(), Name = "Red curry paste", Quantity = 3, Unit = "tbsp", CostPerUnit = 2.00m, CaloriesPerUnit = 90, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Coconut milk", Quantity = 2, Unit = "cans", CostPerUnit = 4.00m, CaloriesPerUnit = 880, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Mixed vegetables", Quantity = 4, Unit = "cups", CostPerUnit = 3.00m, CaloriesPerUnit = 100, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Tofu", Quantity = 14, Unit = "oz", CostPerUnit = 2.50m, CaloriesPerUnit = 353, ProportionFactor = 1.0m },
                    new() { Id = Guid.NewGuid(), Name = "Thai basil", Quantity = 0.5m, Unit = "cup", CostPerUnit = 1.00m, CaloriesPerUnit = 1, ProportionFactor = 1.0m },
                }
            },
        };

        db.Recipes.AddRange(recipes);
        await db.SaveChangesAsync(ct);

        logger.LogInformation(
            "Seed: done. User1={User1}, User2={User2}, Recipes={RecipeCount}",
            user1.DisplayName, user2.DisplayName, recipes.Count
        );

        await tx.CommitAsync(ct);
    }
}
