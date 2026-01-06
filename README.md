# Meal Planning Application

A comprehensive meal planning application with recipe management, weekly meal planning, and automated shopping list generation. Built with React, Vite, Tailwind CSS v4 (frontend) and ASP.NET Core with PostgreSQL (backend).

## Features

### Recipe Management
- ✅ Create, read, update, and delete recipes
- ✅ Categorize by cuisine type (American, Mexican, Italian, etc.)
- ✅ Health ratings (Healthy, Unhealthy, Neutral, Gluten Free, Spicy, etc.)
- ✅ Track ingredients with cost and calorie information
- ✅ Add instructions, comments, and recipe links
- ✅ Proportion factors for custom serving sizes
- ✅ Track last cooked date
- ✅ Search and filter recipes by multiple criteria
- ✅ Sort by name, creation date, or last cooked

### Meal Planning
- ✅ Create weekly meal plans (Sunday-Saturday)
- ✅ Customizable meal types (Breakfast, Snack 1, Lunch, Snack 2, Dinner, Snack 3/Dessert)
- ✅ Set number of people for automatic portion scaling
- ✅ Manually select recipes or use randomization
- ✅ Randomize with constraints (cuisine type, health rating)
- ✅ Exclude recipes with specific ingredients
- ✅ Search recipes based on available ingredients

### Shopping Lists
- ✅ Auto-generate from meal plans
- ✅ Aggregated ingredient quantities
- ✅ Estimated costs per ingredient and total
- ✅ Calorie information per ingredient and total
- ✅ Automatic portion scaling based on serving size

### Recipe Sharing
- ✅ Share recipes with other users
- ✅ Users can make their own copies with custom adjustments
- ✅ Individual databases per user

## Project Structure

```
MealPlanApp/
├── RecipeApi/                 # Backend (.NET 9 + PostgreSQL)
│   ├── Models/               # Entity models and DTOs
│   ├── Data/                 # EF Core DbContext
│   ├── UseCases/             # Business logic
│   │   ├── Users/
│   │   ├── Recipes/
│   │   ├── Ingredients/
│   │   ├── MealPlans/
│   │   └── SharedRecipes/
│   ├── Migrations/           # Database migrations
│   └── Program.cs            # API endpoints
│
└── frontend/                  # Frontend (React + Vite + Tailwind v4)
    ├── src/
    │   ├── components/
    │   │   ├── ui/           # Reusable UI components
    │   │   ├── layout/       # Layout components
    │   │   └── features/     # Feature-specific components
    │   ├── hooks/            # Custom React hooks
    │   ├── pages/            # Page components
    │   ├── services/         # API client
    │   ├── types/            # TypeScript type definitions
    │   └── utils/            # Utility functions
    └── public/
```

## Prerequisites

Before you begin, ensure you have the following installed:

### Backend Requirements
- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [PostgreSQL](https://www.postgresql.org/download/) (version 12 or higher)

### Frontend Requirements
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Getting Started

### 1. Database Setup

First, ensure PostgreSQL is running and create a database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE recipe_db;

# Exit psql
\q
```

### 2. Backend Setup

```bash
# Navigate to the backend directory
cd RecipeApi

# Restore NuGet packages
dotnet restore

# Update the connection string in appsettings.json if needed
# Default: "Host=localhost;Port=5432;Database=recipe_db;Username=postgres;Password=postgres"

# Apply database migrations
dotnet ef database update

# Run the backend
dotnet run
```

The API will be available at:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`
- Swagger UI: `http://localhost:5000/swagger`

### 3. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start the development server
npm run dev
```

The frontend will be available at: `http://localhost:5173`

## API Endpoints

### Users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Recipes
- `GET /api/recipes` - Get all recipes (with filters)
- `GET /api/recipes/{id}` - Get recipe by ID
- `POST /api/recipes` - Create recipe
- `PUT /api/recipes/{id}` - Update recipe
- `DELETE /api/recipes/{id}` - Delete recipe
- `POST /api/recipes/search-by-ingredients` - Search recipes by ingredients

### Ingredients
- `GET /api/ingredients/{id}` - Get ingredient by ID
- `GET /api/ingredients/by-recipe/{recipeId}` - Get all ingredients for a recipe
- `DELETE /api/ingredients/{id}` - Delete ingredient

### Meal Plans
- `POST /api/mealplans` - Create meal plan
- `GET /api/mealplans/{id}` - Get meal plan with recipes
- `POST /api/mealplans/add-recipe` - Add recipe to meal plan
- `POST /api/mealplans/randomize` - Get random recipe suggestions
- `GET /api/mealplans/{id}/shopping-list` - Generate shopping list

### Recipe Sharing
- `POST /api/recipes/share` - Share recipe with another user
- `GET /api/users/{userId}/shared-recipes` - Get shared recipes for user

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "Default": "Host=localhost;Port=5432;Database=recipe_db;Username=postgres;Password=YOUR_PASSWORD"
  },
  "Seed": false
}
```

## Technology Stack

### Backend
- **Framework**: ASP.NET Core 9 (Minimal APIs)
- **Database**: PostgreSQL with Entity Framework Core
- **ORM**: Entity Framework Core 9
- **Validation**: FluentValidation (optional)
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Hooks (useState, useEffect, custom hooks)

## Design Principles

### Component Architecture
- **Modular Components**: All UI components are modular and reusable
- **Separation of Concerns**: Business logic in custom hooks, presentation in components
- **Type Safety**: Full TypeScript coverage for type safety
- **Responsive Design**: Mobile-first approach, works on desktop, tablet, and mobile

### Styling
- **Color Scheme**: Blue and gray tones for a minimalistic, clean design
- **Tailwind CSS v4**: Latest version with `@theme` directive
- **Responsive**: Breakpoints for sm, md, lg, xl screens
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Development Scripts

### Backend
```bash
dotnet build                    # Build the project
dotnet run                      # Run the API
dotnet test                     # Run tests
dotnet ef migrations add [Name] # Create new migration
dotnet ef database update       # Apply migrations
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Future Enhancements (AI Opportunities)

The following features are planned for future releases:

1. **Smart Recommendations**: Track generated meal plans to learn favorite meals and suggest similar recipes
2. **Dynamic Pricing**: Pull current ingredient costs from grocery store APIs
3. **Deal Finder**: Search for sales on frequently used or high-price ingredients
4. **Nutritional Analysis**: Advanced calorie and macro tracking
5. **User Authentication**: Full auth system with JWT tokens
6. **Recipe Import**: Import recipes from URLs
7. **Mobile App**: React Native mobile application
8. **Meal Prep Mode**: Batch cooking and meal prep planning

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

This project is private and for personal use.

## Troubleshooting

### Backend won't start
- Ensure PostgreSQL is running
- Check connection string in `appsettings.json`
- Run `dotnet ef database update` to apply migrations

### Frontend won't start
- Delete `node_modules` and run `npm install` again
- Check if port 5173 is already in use
- Ensure Node.js version is 18 or higher

### API calls failing from frontend
- Ensure backend is running on port 5000
- Check CORS settings in `Program.cs`
- Verify `VITE_API_URL` in `.env` file

### Database migration errors
- Delete existing migrations and database
- Recreate migrations: `dotnet ef migrations add InitialCreate`
- Apply: `dotnet ef database update`

## Contact

For questions or issues, please create an issue in the repository or contact the developer.
