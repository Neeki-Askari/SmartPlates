# Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Prerequisites Check
Before starting, make sure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ .NET 9 SDK installed (`dotnet --version`)
- ✅ PostgreSQL running (`pg_isready` or check your PostgreSQL service)

### Step 1: Database Setup (2 minutes)

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE recipe_db;"
```

### Step 2: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd RecipeApi

# Restore packages and run migrations
dotnet restore
dotnet ef database update

# Start the backend
dotnet run
```

✅ Backend should now be running at http://localhost:5000
✅ Check Swagger UI at http://localhost:5000/swagger

### Step 3: Frontend Setup (1 minute)

Open a **new terminal window**:

```bash
# Navigate to frontend
cd frontend

# Install dependencies (first time only - may take 1-2 minutes)
npm install

# Create environment file
cp .env.example .env

# Start the frontend
npm run dev
```

✅ Frontend should now be running at http://localhost:5173

### Step 4: Verify Everything Works

1. Open http://localhost:5173 in your browser
2. You should see the Meal Planner home page
3. Click on "Recipes" to view the recipe management page
4. Backend API is accessible at http://localhost:5000/api

## 🎉 You're All Set!

### What's Next?

1. **Create your first recipe**: Go to the Recipes page and click "+ Add New Recipe"
2. **Build a meal plan**: Navigate to Meal Plans and create your first weekly plan
3. **Generate a shopping list**: Once you have a meal plan, view the auto-generated shopping list

### Need Help?

- Check the main [README.md](README.md) for detailed documentation
- View API documentation at http://localhost:5000/swagger
- Check the troubleshooting section if something isn't working

## Common Issues

### "Port already in use"
**Backend (5000)**: Change port in `RecipeApi/Properties/launchSettings.json`
**Frontend (5173)**: Vite will automatically try the next available port

### "Cannot connect to database"
- Ensure PostgreSQL is running
- Check credentials in `RecipeApi/appsettings.json`
- Default: `postgres` / `postgres`

### "Module not found" errors in frontend
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Development Workflow

### Making Changes

**Backend**:
- Edit code in `RecipeApi/`
- Hot reload is automatic (when running with `dotnet watch run`)

**Frontend**:
- Edit code in `frontend/src/`
- Changes appear instantly (Vite HMR)

### Adding Database Changes

```bash
cd RecipeApi
dotnet ef migrations add YourMigrationName
dotnet ef database update
```

## Production Build

### Backend
```bash
cd RecipeApi
dotnet publish -c Release -o ./publish
```

### Frontend
```bash
cd frontend
npm run build
# Output in: frontend/dist/
```

---

**Happy Coding! 🍳**
