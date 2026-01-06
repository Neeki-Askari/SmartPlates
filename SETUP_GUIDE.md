# Complete Setup Guide - Meal Planning Application

## 📦 What You Need to Install

Before starting, you'll need to install the following software:

### 1. Node.js (Required for Frontend)
Since Node.js is not currently installed on your system:

**Option A: Using Homebrew (Recommended for macOS)**
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify installation
node --version  # Should show v18.x or higher
npm --version   # Should show v9.x or higher
```

**Option B: Direct Download**
1. Visit https://nodejs.org/
2. Download the LTS (Long Term Support) version
3. Run the installer
4. Verify with `node --version` and `npm --version`

### 2. .NET 9 SDK (Already Installed ✅)
You already have .NET 9 SDK installed.

### 3. PostgreSQL (Already Running ✅)
Your PostgreSQL server is already running.

---

## 🚀 Step-by-Step Setup

### Step 1: Install Frontend Dependencies

```bash
cd /Users/neekiaskari/Desktop/MealPlanApp/frontend
npm install
```

This will install:
- React & React DOM
- React Router
- Axios
- Vite
- Tailwind CSS v4
- TypeScript
- ESLint

**Expected time**: 1-2 minutes

### Step 2: Configure Environment Variables

```bash
# Create environment file
cp .env.example .env
```

The default configuration should work:
```
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Database Setup (If Not Already Done)

```bash
cd /Users/neekiaskari/Desktop/MealPlanApp/RecipeApi

# Apply migrations (creates tables)
dotnet ef database update
```

### Step 4: Start the Backend

```bash
cd /Users/neekiaskari/Desktop/MealPlanApp/RecipeApi
dotnet run
```

**Expected output**:
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:5001
```

**Seeding**: The database will automatically be seeded with 15 example recipes on first run (Development mode).

### Step 5: Start the Frontend (New Terminal)

```bash
cd /Users/neekiaskari/Desktop/MealPlanApp/frontend
npm run dev
```

**Expected output**:
```
  VITE v5.4.11  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

## ✅ Verification Checklist

### Backend Verification
- [ ] Backend running on http://localhost:5000
- [ ] Swagger UI accessible at http://localhost:5000/swagger
- [ ] Can see API endpoints in Swagger
- [ ] Database seeded with recipes (check logs for "Seed: done")

### Frontend Verification
- [ ] Frontend running on http://localhost:5173
- [ ] Home page loads with 3 feature cards
- [ ] Can navigate to Recipes page
- [ ] Can see 15 seeded recipes on Recipes page
- [ ] Can filter recipes by cuisine or health rating
- [ ] Can search recipes
- [ ] Can click on a recipe to see details

---

## 🧪 Test the Application

### 1. View Seeded Recipes
1. Open http://localhost:5173
2. Click "Recipes" in the navigation
3. You should see 15 recipes displayed in a grid

### 2. Filter Recipes
1. Select "Italian" from the Cuisine filter
2. Should show: Spaghetti Carbonara, Caesar Salad, Margherita Pizza
3. Clear filter
4. Select "Healthy" from Health Rating filter
5. Should show multiple healthy recipes

### 3. Search Recipes
1. Type "chicken" in the search box
2. Should show: Chicken Burrito Bowl, Chicken Stir Fry

### 4. View Recipe Details
1. Click on "Beef Tacos" recipe card
2. Modal should open showing:
   - Full ingredient list with quantities
   - Instructions
   - Total cost and calories
   - Tags for Mexican cuisine and Neutral health rating

### 5. Create a New Recipe
1. Click "+ Add New Recipe" button
2. Fill in the form:
   - Title: "Test Recipe"
   - Description: "This is a test"
   - Select cuisine and health rating
   - Add at least 2 ingredients
3. Click "Save Recipe"
4. Should see the new recipe appear in the list

### 6. Test API Directly
1. Open http://localhost:5000/swagger
2. Expand "GET /api/recipes"
3. Click "Try it out"
4. Click "Execute"
5. Should see JSON response with all recipes

---

## 📁 Project Structure Overview

```
MealPlanApp/
├── RecipeApi/                      # Backend
│   ├── Models/                     # Data models
│   │   ├── Recipe.cs
│   │   ├── Ingredient.cs
│   │   ├── MealPlan.cs
│   │   └── ...
│   ├── UseCases/                   # Business logic
│   │   ├── Recipes/
│   │   ├── MealPlans/
│   │   └── ...
│   ├── Seed/
│   │   └── DbSeeder.cs            # 15 example recipes!
│   └── Program.cs                  # API endpoints
│
├── frontend/                       # Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                # Reusable UI
│   │   │   ├── layout/            # Layout
│   │   │   └── features/          # Feature components
│   │   │       └── recipes/       # Recipe components
│   │   ├── hooks/                 # Custom hooks
│   │   ├── pages/                 # Page components
│   │   ├── services/              # API client
│   │   └── types/                 # TypeScript types
│   ├── package.json
│   └── vite.config.ts
│
├── README.md                       # Full documentation
├── QUICKSTART.md                   # 5-minute guide
├── FEATURES_COMPLETE.md           # Feature list
└── SETUP_GUIDE.md                 # This file
```

---

## 🔧 Development Workflow

### Running Both Servers Simultaneously

**Terminal 1 - Backend:**
```bash
cd RecipeApi
dotnet watch run  # Auto-restart on code changes
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev  # Hot module replacement
```

### Making Changes

**Backend Changes:**
- Edit .cs files
- Server auto-restarts (if using `dotnet watch run`)
- Refresh browser to see changes

**Frontend Changes:**
- Edit .tsx/.ts files
- Changes appear instantly (Vite HMR)
- No refresh needed!

---

## 📊 Seeded Data Summary

On first run, you'll get **15 recipes** across these categories:

**Breakfast (3)**
- Classic Pancakes (American, Neutral)
- Avocado Toast (American, Healthy)
- Greek Yogurt Parfait (Greek, Healthy)

**Lunch (2)**
- Caesar Salad (Italian, Healthy)
- Chicken Burrito Bowl (Mexican, Healthy)

**Dinner (6)**
- Spaghetti Carbonara (Italian, Neutral)
- Beef Tacos (Mexican, Neutral)
- Grilled Salmon with Vegetables (Mediterranean, Healthy)
- Chicken Stir Fry (Chinese, Healthy)
- Margherita Pizza (Italian, Neutral)
- Lentil Soup (Mediterranean, Healthy)

**Snacks (2)**
- Hummus with Veggies (Mediterranean, Healthy)
- Chocolate Chip Cookies (American, Unhealthy)

**Specialty (1)**
- Spicy Thai Curry (Thai, Spicy)

Each recipe includes:
- Complete ingredient list
- Quantities and units
- Cost per ingredient
- Calories per ingredient
- Detailed instructions
- Personal notes/comments

---

## 🐛 Troubleshooting

### Backend Issues

**"Database does not exist"**
```bash
psql -U postgres -c "CREATE DATABASE recipe_db;"
cd RecipeApi
dotnet ef database update
```

**"Port 5000 already in use"**
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9
```

**"Migration failed"**
```bash
# Reset database
cd RecipeApi
dotnet ef database drop
dotnet ef database update
```

### Frontend Issues

**"Module not found" errors**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**"Port 5173 already in use"**
- Vite will automatically try port 5174, 5175, etc.
- Or manually kill the process:
```bash
lsof -ti:5173 | xargs kill -9
```

**"Failed to fetch" or API errors**
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify `.env` file has correct API URL

### Database Issues

**"Too many connections"**
```bash
# Restart PostgreSQL
brew services restart postgresql@14
```

**"Password authentication failed"**
- Check `appsettings.json` connection string
- Update password to match your PostgreSQL setup

**Reseed database**
```bash
psql -U postgres
DROP DATABASE recipe_db;
CREATE DATABASE recipe_db;
\q

cd RecipeApi
dotnet run
```

---

## 🎯 Next Steps After Setup

### 1. Explore the UI
- Browse all 15 seeded recipes
- Try all filter combinations
- Create your own recipes
- View recipe details

### 2. Test the API
- Open Swagger UI
- Try different endpoints
- See request/response formats
- Test with different parameters

### 3. Learn the Codebase
- Read `FEATURES_COMPLETE.md` for feature details
- Check `README.md` for architecture info
- Explore the code structure
- Modify and experiment!

### 4. Future Development
The following features are ready to implement:
- Meal plan builder UI
- Shopping list display
- Recipe editing modal
- User authentication
- Recipe sharing UI

---

## 📚 Additional Resources

### Documentation Files
- `README.md` - Complete project documentation
- `QUICKSTART.md` - 5-minute quick start
- `FEATURES_COMPLETE.md` - Detailed feature list
- `SETUP_GUIDE.md` - This file

### API Documentation
- http://localhost:5000/swagger - Interactive API docs

### Code Examples
- `frontend/src/pages/RecipesPage.tsx` - Complete CRUD example
- `frontend/src/components/features/recipes/` - Feature components
- `RecipeApi/UseCases/` - Backend business logic

---

## 🎉 You're All Set!

Once you complete the setup steps above, you'll have a fully functional meal planning application with:

✅ Working recipe management
✅ 15 pre-loaded example recipes
✅ Advanced filtering and search
✅ Beautiful, responsive UI
✅ Full CRUD operations
✅ Cost and calorie tracking

**Happy coding!** 🚀
