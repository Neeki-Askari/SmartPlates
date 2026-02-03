// Program.cs
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Recipe.Api.Data;
using Recipe.Api.Models;
using Recipe.Api.Services;
using Recipe.Api.UseCases.Users;
using Recipe.Api.UseCases.Recipes;
using Recipe.Api.UseCases.Ingredients;
using Recipe.Api.UseCases.MealPlans;
using Recipe.Api.UseCases.SharedRecipes;
using Recipe.Api.UseCases.ShoppingLists;
using Recipe.Api.UseCases.Auth;
using Recipe.Api.Extensions;
using Recipe.Api.Seed;
using System.Text.Json;
using DotNetEnv;

// Load environment variables from .env file
Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Load Auth0 configuration from environment
builder.Configuration["Auth0:Domain"] = Environment.GetEnvironmentVariable("AUTH0_DOMAIN")
    ?? throw new InvalidOperationException("AUTH0_DOMAIN not configured");
builder.Configuration["Auth0:Audience"] = Environment.GetEnvironmentVariable("AUTH0_AUDIENCE") ?? "";

// Load OAuth configuration from environment (for future use)
builder.Configuration["Google:ClientId"] = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID") ?? "";
builder.Configuration["Google:ClientSecret"] = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET") ?? "";
builder.Configuration["Google:RedirectUri"] = Environment.GetEnvironmentVariable("GOOGLE_REDIRECT_URI") ?? "http://localhost:5173/auth/google/callback";

builder.Configuration["Apple:ClientId"] = Environment.GetEnvironmentVariable("APPLE_CLIENT_ID") ?? "";
builder.Configuration["Apple:TeamId"] = Environment.GetEnvironmentVariable("APPLE_TEAM_ID") ?? "";
builder.Configuration["Apple:KeyId"] = Environment.GetEnvironmentVariable("APPLE_KEY_ID") ?? "";
builder.Configuration["Apple:PrivateKey"] = Environment.GetEnvironmentVariable("APPLE_PRIVATE_KEY") ?? "";
builder.Configuration["Apple:RedirectUri"] = Environment.GetEnvironmentVariable("APPLE_REDIRECT_URI") ?? "http://localhost:5173/auth/apple/callback";

builder.Configuration["Microsoft:ClientId"] = Environment.GetEnvironmentVariable("MICROSOFT_CLIENT_ID") ?? "";
builder.Configuration["Microsoft:ClientSecret"] = Environment.GetEnvironmentVariable("MICROSOFT_CLIENT_SECRET") ?? "";
builder.Configuration["Microsoft:RedirectUri"] = Environment.GetEnvironmentVariable("MICROSOFT_REDIRECT_URI") ?? "http://localhost:5173/auth/microsoft/callback";

// EF Core + Postgres
var dbHost = Environment.GetEnvironmentVariable("DB_HOST") ?? "localhost";
var dbPort = Environment.GetEnvironmentVariable("DB_PORT") ?? "5433";
var dbName = Environment.GetEnvironmentVariable("DB_NAME") ?? "recipe_db";
var dbUser = Environment.GetEnvironmentVariable("DB_USER") ?? "postgres";
var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD") ?? "postgres";
var connectionString = $"Host={dbHost};Port={dbPort};Database={dbName};Username={dbUser};Password={dbPassword}";

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(connectionString));

// Register Authentication Services
builder.Services.AddScoped<IPasswordHasher, BcryptPasswordHasher>();
builder.Services.AddScoped<ITokenService, JwtTokenService>();

// Register OAuth Services
builder.Services.AddHttpClient<GoogleOAuthService>();
builder.Services.AddHttpClient<AppleOAuthService>();
builder.Services.AddHttpClient<MicrosoftOAuthService>();

// Configure Auth0 JWT Authentication
var auth0Domain = builder.Configuration["Auth0:Domain"]!;
var auth0Audience = builder.Configuration["Auth0:Audience"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.Authority = $"https://{auth0Domain}/";
    options.Audience = auth0Audience;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = $"https://{auth0Domain}/",
        ValidateAudience = !string.IsNullOrEmpty(auth0Audience),
        ValidAudience = auth0Audience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero,
        NameClaimType = "name"
    };
});

builder.Services.AddAuthorization();

// Register Use Cases (DI)
// Auth Use Cases
builder.Services.AddScoped<Register>();
builder.Services.AddScoped<Login>();
builder.Services.AddScoped<RefreshToken>();
builder.Services.AddScoped<GetCurrentUser>();
builder.Services.AddScoped<GetOAuthUrl>();
builder.Services.AddScoped<HandleOAuthCallback>();
builder.Services.AddScoped<OAuthLogin>();
builder.Services.AddScoped<SyncAuth0User>();

// User Use Cases
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
builder.Services.AddScoped<GetUserMealPlans>();
builder.Services.AddScoped<UpdateMealPlan>();
builder.Services.AddScoped<DeleteMealPlan>();
builder.Services.AddScoped<DuplicateMealPlan>();
builder.Services.AddScoped<AddRecipeToMealPlan>();
builder.Services.AddScoped<RandomizeRecipe>();
builder.Services.AddScoped<GenerateShoppingList>();

builder.Services.AddScoped<SearchRecipesByIngredients>();
builder.Services.AddScoped<ShareRecipe>();
builder.Services.AddScoped<GetSharedRecipes>();

builder.Services.AddScoped<SaveShoppingList>();
builder.Services.AddScoped<GetUserSavedShoppingLists>();
builder.Services.AddScoped<GetSavedShoppingList>();
builder.Services.AddScoped<DeleteSavedShoppingList>();

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

// Authentication & Authorization middleware (order matters!)
app.UseAuthentication();
app.UseAuthorization();

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

// ===== AUTHENTICATION =====
app.MapPost("/api/auth/register", async (RegisterDto dto, Register uc, CancellationToken ct) =>
{
    try
    {
        var response = await uc.Execute(dto, ct);
        return Results.Ok(response);
    }
    catch (InvalidOperationException ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

app.MapPost("/api/auth/login", async (LoginDto dto, Login uc, CancellationToken ct) =>
{
    try
    {
        var response = await uc.Execute(dto, ct);
        return Results.Ok(response);
    }
    catch (UnauthorizedAccessException)
    {
        return Results.Unauthorized();
    }
});

app.MapPost("/api/auth/refresh", async (RefreshTokenDto dto, RefreshToken uc, CancellationToken ct) =>
{
    try
    {
        var response = await uc.Execute(dto, ct);
        return Results.Ok(response);
    }
    catch (UnauthorizedAccessException)
    {
        return Results.Unauthorized();
    }
});

app.MapGet("/api/auth/me", async (HttpContext httpContext, GetCurrentUser uc, CancellationToken ct) =>
{
    var userIdClaim = httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
        ?? httpContext.User.FindFirst("sub")?.Value;

    if (userIdClaim is null || !Guid.TryParse(userIdClaim, out var userId))
        return Results.Unauthorized();

    var user = await uc.Execute(userId, ct);
    return user is null ? Results.NotFound() : Results.Ok(user);
}).RequireAuthorization();

// ===== AUTH0 USER SYNC =====
app.MapPost("/api/auth/sync", async (HttpContext httpContext, SyncAuth0User uc, IHttpClientFactory httpClientFactory, CancellationToken ct) =>
{
    // Get Auth0 subject ID from token claims
    var auth0Sub = httpContext.User.FindFirst("sub")?.Value
        ?? httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
        ?? httpContext.User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;

    // Try to get email/name from token claims first
    var email = httpContext.User.FindFirst("email")?.Value
        ?? httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value
        ?? httpContext.User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value;

    var name = httpContext.User.FindFirst("name")?.Value
        ?? httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value
        ?? httpContext.User.FindFirst("nickname")?.Value;

    // If email is missing from the token, fetch from Auth0 /userinfo endpoint
    if (string.IsNullOrEmpty(email))
    {
        var accessToken = httpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        if (!string.IsNullOrEmpty(accessToken))
        {
            try
            {
                var client = httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
                var auth0Domain = app.Configuration["Auth0:Domain"];
                var userInfoResponse = await client.GetAsync($"https://{auth0Domain}/userinfo", ct);
                if (userInfoResponse.IsSuccessStatusCode)
                {
                    var userInfo = await userInfoResponse.Content.ReadFromJsonAsync<JsonElement>(ct);
                    email ??= userInfo.TryGetProperty("email", out var emailProp) ? emailProp.GetString() : null;
                    name ??= userInfo.TryGetProperty("name", out var nameProp) ? nameProp.GetString() : null;
                    auth0Sub ??= userInfo.TryGetProperty("sub", out var subProp) ? subProp.GetString() : null;
                }
            }
            catch (Exception ex)
            {
                app.Logger.LogWarning("Failed to fetch /userinfo from Auth0: {Error}", ex.Message);
            }
        }
    }

    name ??= email?.Split('@')[0] ?? "User";

    // Debug logging
    if (string.IsNullOrEmpty(auth0Sub) || string.IsNullOrEmpty(email))
    {
        var claims = string.Join(", ", httpContext.User.Claims.Select(c => $"{c.Type}={c.Value}"));
        app.Logger.LogWarning("Sync failed. Claims received: {Claims}", claims);
        return Results.BadRequest(new {
            error = "Invalid token claims",
            debug = "Check server logs for claim details",
            hasSub = !string.IsNullOrEmpty(auth0Sub),
            hasEmail = !string.IsNullOrEmpty(email)
        });
    }

    var user = await uc.Execute(auth0Sub, email, name, ct);
    var userDto = new UserDto(user.Id, user.Email, user.DisplayName, user.CreatedAt);
    return Results.Ok(userDto);
}).RequireAuthorization();

// ===== OAUTH AUTHENTICATION =====
app.MapGet("/api/auth/{provider}/url", (string provider, GetOAuthUrl uc, string? state) =>
{
    try
    {
        var url = uc.Execute(provider, state);
        return Results.Ok(new { url });
    }
    catch (InvalidOperationException ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

app.MapPost("/api/auth/{provider}/callback", async (string provider, OAuthCallbackDto dto, HandleOAuthCallback uc, CancellationToken ct) =>
{
    try
    {
        var response = await uc.Execute(provider, dto.Code, ct);
        return Results.Ok(response);
    }
    catch (InvalidOperationException ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
    catch (Exception ex)
    {
        return Results.Problem($"OAuth authentication failed: {ex.Message}");
    }
});

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
    HttpContext httpContext,
    AppDbContext db,
    [FromServices] CreateRecipe uc,
    [FromBody] CreateRecipeDto dto,
    CancellationToken ct) =>
{
    if (dto.Ingredients is null) return Results.BadRequest("Ingredients is required (use empty array if none).");

    var userId = await httpContext.GetCurrentUserIdAsync(db, ct);
    if (userId is null) return Results.Unauthorized();

    var dtoWithUser = dto with { UserId = userId.Value };
    var created = await uc.Execute(dtoWithUser, ct);
    return Results.Created($"/api/recipes/{created.Id}", created);
}).RequireAuthorization();


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

// ===== MEAL PLANS ===== (Protected - Requires Authentication)
app.MapPost("/api/mealplans", async (HttpContext httpContext, AppDbContext db, CreateMealPlanDto dto, CreateMealPlan uc, CancellationToken ct) =>
{
    // Debug: log claims to diagnose auth issues
    var claims = string.Join(", ", httpContext.User.Claims.Select(c => $"{c.Type}={c.Value}"));
    app.Logger.LogInformation("POST /api/mealplans - Claims: {Claims}", claims);

    var userId = await httpContext.GetCurrentUserIdAsync(db, ct);
    if (userId is null)
    {
        app.Logger.LogWarning("POST /api/mealplans - User not found in DB. Claims: {Claims}", claims);
        return Results.Unauthorized();
    }

    var dtoWithUser = dto with { UserId = userId.Value };
    var created = await uc.Execute(dtoWithUser, ct);
    return Results.Created($"/api/mealplans/{created.Id}", created);
}).RequireAuthorization();

app.MapGet("/api/mealplans/{id:guid}", async (Guid id, GetMealPlan uc, CancellationToken ct) =>
{
    var mp = await uc.Execute(id, ct);
    return mp is null ? Results.NotFound() : Results.Ok(mp);
}).RequireAuthorization();

app.MapGet("/api/mealplans", async (HttpContext httpContext, AppDbContext db, GetUserMealPlans uc, CancellationToken ct) =>
{
    var userId = await httpContext.GetCurrentUserIdAsync(db, ct);
    if (userId is null) return Results.Unauthorized();

    var mealPlans = await uc.Execute(userId.Value, ct);
    return Results.Ok(mealPlans);
}).RequireAuthorization();

app.MapPut("/api/mealplans/{id:guid}", async (Guid id, UpdateMealPlanDto dto, UpdateMealPlan uc, CancellationToken ct) =>
{
    var updated = await uc.Execute(id, dto, ct);
    return updated is null ? Results.NotFound() : Results.Ok(updated);
}).RequireAuthorization();

app.MapDelete("/api/mealplans/{id:guid}", async (Guid id, DeleteMealPlan uc, CancellationToken ct) =>
{
    var ok = await uc.Execute(id, ct);
    return ok ? Results.NoContent() : Results.NotFound();
}).RequireAuthorization();

app.MapPost("/api/mealplans/duplicate", async (DuplicateMealPlanDto dto, DuplicateMealPlan uc, CancellationToken ct) =>
{
    var duplicated = await uc.Execute(dto, ct);
    return Results.Created($"/api/mealplans/{duplicated.Id}", duplicated);
}).RequireAuthorization();

app.MapPost("/api/mealplans/add-recipe", async (AddRecipeToMealPlanDto dto, AddRecipeToMealPlan uc, CancellationToken ct) =>
{
    var result = await uc.Execute(dto, ct);
    return Results.Ok(result);
}).RequireAuthorization();

app.MapPost("/api/mealplans/randomize", async (RandomizeRecipeDto dto, RandomizeRecipe uc, CancellationToken ct) =>
{
    var options = await uc.Execute(dto, ct);
    return Results.Ok(options);
}).RequireAuthorization();

app.MapGet("/api/mealplans/{id:guid}/shopping-list", async (Guid id, GenerateShoppingList uc, CancellationToken ct) =>
{
    var shoppingList = await uc.Execute(id, ct);
    return Results.Ok(shoppingList);
}).RequireAuthorization();

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

// ===== SAVED SHOPPING LISTS ===== (Protected - Requires Authentication)
app.MapPost("/api/shopping-lists/save", async (ShoppingListDto dto, SaveShoppingList uc, CancellationToken ct) =>
{
    var saved = await uc.Execute(dto, ct);
    return Results.Created($"/api/shopping-lists/{saved.Id}", saved);
}).RequireAuthorization();

app.MapGet("/api/shopping-lists", async (HttpContext httpContext, AppDbContext db, GetUserSavedShoppingLists uc, CancellationToken ct) =>
{
    var userId = await httpContext.GetCurrentUserIdAsync(db, ct);
    if (userId is null) return Results.Unauthorized();

    var lists = await uc.Execute(userId.Value, ct);
    return Results.Ok(lists);
}).RequireAuthorization();

app.MapGet("/api/shopping-lists/{id:guid}", async (Guid id, GetSavedShoppingList uc, CancellationToken ct) =>
{
    var list = await uc.Execute(id, ct);
    return list is null ? Results.NotFound() : Results.Ok(list);
}).RequireAuthorization();

app.MapDelete("/api/shopping-lists/{id:guid}", async (Guid id, DeleteSavedShoppingList uc, CancellationToken ct) =>
{
    var ok = await uc.Execute(id, ct);
    return ok ? Results.NoContent() : Results.NotFound();
}).RequireAuthorization();

app.Run();
