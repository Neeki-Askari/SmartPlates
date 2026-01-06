// Program.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Recipe.Api.Data;
using Recipe.Api.Models;
using Recipe.Api.UseCases.Users;
using Recipe.Api.UseCases.Recipes;
using Recipe.Api.UseCases.Ingredients;
using Recipe.Api.UseCases.MealPlans;
using Recipe.Api.UseCases.SharedRecipes;
using Recipe.Api.Seed;

var builder = WebApplication.CreateBuilder(args);

// EF Core + Postgres
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Default") ??
                  "Host=localhost;Port=5432;Database=recipe_db;Username=postgres;Password=postgres"));

// Register Use Cases (DI)
builder.Services.AddScoped<GetUser>();
builder.Services.AddScoped<CreateUser>();
builder.Services.AddScoped<UpdateUser>();
builder.Services.AddScoped<DeleteUser>();

builder.Services.AddScoped<GetRecipe>();
builder.Services.AddScoped<CreateRecipe>();
builder.Services.AddScoped<UpdateRecipe>();
builder.Services.AddScoped<DeleteRecipe>();
builder.Services.AddScoped<GetAllRecipes>();

builder.Services.AddScoped<GetIngredient>();
builder.Services.AddScoped<ListIngredientsByRecipe>();
builder.Services.AddScoped<DeleteIngredient>();

builder.Services.AddScoped<CreateMealPlan>();
builder.Services.AddScoped<GetMealPlan>();
builder.Services.AddScoped<AddRecipeToMealPlan>();
builder.Services.AddScoped<RandomizeRecipe>();
builder.Services.AddScoped<GenerateShoppingList>();

builder.Services.AddScoped<SearchRecipesByIngredients>();
builder.Services.AddScoped<ShareRecipe>();
builder.Services.AddScoped<GetSharedRecipes>();

// minimal plumbing
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .WithOrigins(
                "http://localhost:3000",  
                "http://localhost:5173"
            );
    });
});

var app = builder.Build();
//Apply EF Core migrations at startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
}

app.UseSwagger();
app.UseSwaggerUI();


app.UseCors("AllowFrontend");

//Seed the database
var shouldSeed =
    string.Equals(Environment.GetEnvironmentVariable("SEED"), "true", StringComparison.OrdinalIgnoreCase)
    || builder.Configuration.GetValue<bool>("Seed");

if (shouldSeed)
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await DbSeeder.SeedAsync(db, app.Logger);
}

// ===== USERS =====
app.MapGet("/api/users/{id:guid}", async (Guid id, GetUser uc, CancellationToken ct) =>
{
    var u = await uc.Execute(id, ct);
    return u is null ? Results.NotFound() : Results.Ok(u);
});

app.MapPost("/api/users", async (CreateUserDto dto, CreateUser uc, CancellationToken ct) =>
{
    if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.DisplayName))
        return Results.BadRequest("Email and DisplayName are required.");
    var created = await uc.Execute(dto, ct);
    return Results.Created($"/api/users/{created.Id}", created);
});

app.MapPut("/api/users/{id:guid}", async (Guid id, UpdateUserDto dto, UpdateUser uc, CancellationToken ct) =>
{
    if (string.IsNullOrWhiteSpace(dto.DisplayName))
        return Results.BadRequest("DisplayName is required.");
    var updated = await uc.Execute(id, dto, ct);
    return updated is null ? Results.NotFound() : Results.Ok(updated);
});

app.MapDelete("/api/users/{id:guid}", async (Guid id, DeleteUser uc, CancellationToken ct) =>
{
    var ok = await uc.Execute(id, ct);
    return ok ? Results.NoContent() : Results.NotFound();
});

// ===== RECIPES =====

app.MapGet("/api/recipes", async (
    [FromServices] GetAllRecipes uc,
    [AsParameters] GetAllRecipesDto dto,
    CancellationToken ct) =>
{
    var result = await uc.Execute(dto, ct);
    return Results.Ok(result);
});

app.MapGet("/api/recipes/{id:guid}", async (Guid id, GetRecipe uc, CancellationToken ct) =>
{
    var r = await uc.Execute(id, ct);
    return r is null ? Results.NotFound() : Results.Ok(r);
});
app.MapPost("/api/recipes", async (
    [FromServices] CreateRecipe uc,
    [FromBody] CreateRecipeDto dto,
    CancellationToken ct) =>
{
    if (dto.Ingredients is null) return Results.BadRequest("Ingredients is required (use empty array if none).");

    var created = await uc.Execute(dto, ct);
    return Results.Created($"/api/recipes/{created.Id}", created);
});


app.MapPut("/api/recipes/{id:guid}", async (Guid id, UpdateRecipeDto dto, UpdateRecipe uc, CancellationToken ct) =>
{
    if (string.IsNullOrWhiteSpace(dto.Title))
        return Results.BadRequest("Title is required.");
    var updated = await uc.Execute(id, dto, ct);
    return updated is null ? Results.NotFound() : Results.Ok(updated);
});

app.MapDelete("/api/recipes/{id:guid}", async (Guid id, DeleteRecipe uc, CancellationToken ct) =>
{
    var ok = await uc.Execute(id, ct);
    return ok ? Results.NoContent() : Results.NotFound();
});

// ===== INGREDIENTS =====
app.MapGet("/api/ingredients/{id:guid}", async (Guid id, GetIngredient uc, CancellationToken ct) =>
{
    var ing = await uc.Execute(id, ct);
    return ing is null ? Results.NotFound() : Results.Ok(ing);
});

app.MapGet("/api/ingredients/by-recipe/{recipeId:guid}", async (Guid recipeId, ListIngredientsByRecipe uc, CancellationToken ct) =>
{
    var list = await uc.Execute(recipeId, ct);
    return Results.Ok(list);
});

app.MapDelete("/api/ingredients/{id:guid}", async (Guid id, DeleteIngredient uc, CancellationToken ct) =>
{
    var ok = await uc.Execute(id, ct);
    return ok ? Results.NoContent() : Results.NotFound();
});

// ===== MEAL PLANS =====
app.MapPost("/api/mealplans", async (CreateMealPlanDto dto, CreateMealPlan uc, CancellationToken ct) =>
{
    var created = await uc.Execute(dto, ct);
    return Results.Created($"/api/mealplans/{created.Id}", created);
});

app.MapGet("/api/mealplans/{id:guid}", async (Guid id, GetMealPlan uc, CancellationToken ct) =>
{
    var mp = await uc.Execute(id, ct);
    return mp is null ? Results.NotFound() : Results.Ok(mp);
});

app.MapPost("/api/mealplans/add-recipe", async (AddRecipeToMealPlanDto dto, AddRecipeToMealPlan uc, CancellationToken ct) =>
{
    var result = await uc.Execute(dto, ct);
    return Results.Ok(result);
});

app.MapPost("/api/mealplans/randomize", async (RandomizeRecipeDto dto, RandomizeRecipe uc, CancellationToken ct) =>
{
    var options = await uc.Execute(dto, ct);
    return Results.Ok(options);
});

app.MapGet("/api/mealplans/{id:guid}/shopping-list", async (Guid id, GenerateShoppingList uc, CancellationToken ct) =>
{
    var shoppingList = await uc.Execute(id, ct);
    return Results.Ok(shoppingList);
});

// ===== RECIPE SEARCH & SHARING =====
app.MapPost("/api/recipes/search-by-ingredients", async (SearchRecipesByIngredientsDto dto, SearchRecipesByIngredients uc, CancellationToken ct) =>
{
    var results = await uc.Execute(dto, ct);
    return Results.Ok(results);
});

app.MapPost("/api/recipes/share", async (ShareRecipeDto dto, ShareRecipe uc, CancellationToken ct) =>
{
    var shared = await uc.Execute(dto, ct);
    return Results.Ok(shared);
});

app.MapGet("/api/users/{userId:guid}/shared-recipes", async (Guid userId, GetSharedRecipes uc, CancellationToken ct) =>
{
    var shared = await uc.Execute(userId, ct);
    return Results.Ok(shared);
});

app.Run();
