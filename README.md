# Meal Plan App

A full-stack meal planning application for managing recipes, building weekly meal plans, and auto-generating shopping lists. Supports per-user recipe libraries, recipe sharing, and Auth0-based authentication.

![.NET](https://img.shields.io/badge/.NET_9-512BD4?style=flat&logo=dotnet&logoColor=white)
![React](https://img.shields.io/badge/React_18-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Auth0](https://img.shields.io/badge/Auth0-EB5424?style=flat&logo=auth0&logoColor=white)

---

## Features

### Recipes
- Create, edit, and delete recipes with ingredients, instructions, and links
- Categorize by cuisine type and health rating
- Track cost, calories, and last cooked date
- Search and filter by multiple criteria
- Public/private visibility per recipe
- Copy shared recipes into your own library

### Meal Planning
- Build weekly meal plans (Sunday–Saturday)
- Assign recipes to meal slots (Breakfast, Lunch, Dinner, Snacks)
- Randomize meal slots with filters (cuisine, health rating, ingredient exclusions)
- Scale portions based on number of people
- Duplicate existing meal plans

### Shopping Lists
- Auto-generate from any meal plan
- Aggregated ingredient quantities with estimated cost and calorie totals
- Save and retrieve past shopping lists

### Authentication & Users
- Auth0-based login (social login supported)
- Per-user recipe and meal plan libraries
- Recipe sharing between users

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend framework | ASP.NET Core 9 (Minimal APIs) |
| ORM | Entity Framework Core 9 |
| Database | PostgreSQL |
| Auth | Auth0 + JWT Bearer |
| Password hashing | BCrypt |
| API docs | Swagger / OpenAPI |
| Frontend framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v6 |
| Data fetching | TanStack Query v5 + Axios |
| Environment variables | DotNetEnv (backend), Vite env (frontend) |

---

## Project Structure

```
MealPlanApp/
├── RecipeApi/                  # ASP.NET Core backend
│   ├── Models/                 # Entity models and DTOs
│   ├── Data/                   # EF Core DbContext
│   ├── UseCases/               # Business logic by domain
│   │   ├── Auth/
│   │   ├── Users/
│   │   ├── Recipes/
│   │   ├── Ingredients/
│   │   ├── MealPlans/
│   │   ├── SharedRecipes/
│   │   └── ShoppingLists/
│   ├── Services/               # Auth, hashing, token services
│   ├── Migrations/             # EF Core migrations
│   ├── Seed/                   # Database seeder
│   └── Program.cs              # App entry point and route definitions
│
└── frontend/                   # React frontend
    └── src/
        ├── components/
        │   ├── ui/             # Reusable UI primitives
        │   ├── layout/         # Header, Layout, Container
        │   └── features/       # Recipe, MealPlan components
        ├── hooks/              # Custom data-fetching hooks
        ├── pages/              # Route-level page components
        ├── services/           # Axios API client
        └── types/              # Shared TypeScript types
```

---

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [PostgreSQL 12+](https://www.postgresql.org/download/)
- [Node.js 18+](https://nodejs.org/)
- An [Auth0](https://auth0.com/) account and application

---

## Setup

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd MealPlanApp
```

### 2. Create the PostgreSQL database

```bash
psql -U postgres
```
```sql
CREATE DATABASE recipe_db;
\q
```

### 3. Configure the backend environment

Create `RecipeApi/.env` (never committed):

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=recipe_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Auth0
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_AUDIENCE=https://your-api-identifier

# Optional: seed the DB on first run
SEED=true
```

### 4. Run the backend

```bash
cd RecipeApi
dotnet restore
dotnet run
```

Migrations are applied automatically on startup.

| Endpoint | URL |
|---|---|
| API | `http://localhost:5076` |
| Swagger UI | `http://localhost:5076/swagger` |

### 5. Configure the frontend environment

Create `frontend/.env` (never committed):

```env
VITE_API_URL=http://localhost:5076/api

# Auth0
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
VITE_AUTH0_AUDIENCE=https://your-api-identifier
VITE_AUTH0_REDIRECT_URI=http://localhost:5173
```

### 6. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## Auth0 Setup

1. Create an **Application** in Auth0 (Single Page Application)
   - Add `http://localhost:5173` to **Allowed Callback URLs**, **Logout URLs**, and **Web Origins**
2. Create an **API** in Auth0
   - Set the **Identifier** — this is your `AUTH0_AUDIENCE`
3. Copy your **Domain** and **Client ID** into both `.env` files

---

## API Reference

<details>
<summary><strong>Auth</strong></summary>

| Method | Endpoint | Auth |
|---|---|---|
| `POST` | `/api/auth/sync` | Required |
| `GET` | `/api/auth/me` | Required |

</details>

<details>
<summary><strong>Recipes</strong></summary>

| Method | Endpoint | Auth |
|---|---|---|
| `GET` | `/api/recipes` | Optional |
| `GET` | `/api/recipes/{id}` | — |
| `POST` | `/api/recipes` | Required |
| `PUT` | `/api/recipes/{id}` | Required |
| `DELETE` | `/api/recipes/{id}` | Required |
| `POST` | `/api/recipes/{id}/copy` | Required |
| `POST` | `/api/recipes/search-by-ingredients` | — |
| `POST` | `/api/recipes/share` | — |

</details>

<details>
<summary><strong>Meal Plans</strong></summary>

| Method | Endpoint | Auth |
|---|---|---|
| `GET` | `/api/mealplans` | Required |
| `POST` | `/api/mealplans` | Required |
| `GET` | `/api/mealplans/{id}` | Required |
| `PUT` | `/api/mealplans/{id}` | Required |
| `DELETE` | `/api/mealplans/{id}` | Required |
| `POST` | `/api/mealplans/duplicate` | Required |
| `POST` | `/api/mealplans/add-recipe` | Required |
| `POST` | `/api/mealplans/randomize` | Required |
| `GET` | `/api/mealplans/{id}/shopping-list` | Required |

</details>

<details>
<summary><strong>Shopping Lists</strong></summary>

| Method | Endpoint | Auth |
|---|---|---|
| `GET` | `/api/shopping-lists` | Required |
| `POST` | `/api/shopping-lists/save` | Required |
| `GET` | `/api/shopping-lists/{id}` | Required |
| `DELETE` | `/api/shopping-lists/{id}` | Required |

</details>

<details>
<summary><strong>Ingredients & Users</strong></summary>

| Method | Endpoint | Auth |
|---|---|---|
| `GET` | `/api/ingredients/{id}` | — |
| `GET` | `/api/ingredients/by-recipe/{recipeId}` | — |
| `DELETE` | `/api/ingredients/{id}` | — |
| `GET` | `/api/users/{id}` | — |
| `GET` | `/api/users/{userId}/shared-recipes` | — |

</details>

---

## Useful Commands

### Backend

```bash
dotnet run                              # Start API
dotnet build                            # Build
dotnet ef migrations add <Name>         # Create a new migration
dotnet ef database update               # Apply migrations manually
```

### Frontend

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # ESLint check
npm run preview   # Preview production build
```

---

## Troubleshooting

**Port already in use**
Another instance of the API is still running. Find and kill it:
```bash
lsof -ti :5076 | xargs kill
```

**Database connection errors**
- Confirm PostgreSQL is running: `pg_isready -h localhost -p 5432`
- Double-check credentials in `RecipeApi/.env`

**Auth0 errors**
- Ensure `AUTH0_DOMAIN` and `AUTH0_AUDIENCE` match exactly between your `.env` and Auth0 dashboard
- Confirm `http://localhost:5173` is listed in your Auth0 app's allowed callback/logout URLs

**Frontend API calls failing**
- Confirm the backend is running on port `5076`
- Check `VITE_API_URL` in `frontend/.env`
