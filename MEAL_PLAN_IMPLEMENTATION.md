# Meal Plan Feature Implementation

## Overview
The meal planning feature has been fully implemented with all the requested functionality. This document explains how to use it and what has been implemented.

## Features Implemented

### 1. Meal Plan Creation
- ✅ Create weekly meal plans (Sunday - Saturday)
- ✅ Select number of people (serving size)
- ✅ Choose which meals to include:
  - Breakfast
  - Snack 1
  - Lunch
  - Snack 2
  - Dinner
  - Snack 3 (Dessert)

### 2. Week View with Meal Grid
- ✅ 7-day grid layout (Sunday through Saturday)
- ✅ Each day shows only the selected meal types
- ✅ Each meal slot has three sections:
  1. Health rating dropdown constraint
  2. Cuisine type dropdown constraint
  3. Selected recipe display

### 3. Recipe Selection & Randomization
- ✅ **Manual Selection**: Click randomize to see options matching your constraints
- ✅ **Constraint-based Randomization**:
  - Filter by health rating (Healthy, Neutral, Unhealthy, Gluten Free, Vegan, etc.)
  - Filter by cuisine type (American, Italian, Mexican, Chinese, etc.)
- ✅ **Exclude Ingredients**: Enter comma-separated ingredients to exclude
- ✅ **Customize Option Count**: Choose how many recipe options to show (1-10)
- ✅ **Select from Options**: Review randomized options and select one

### 4. Shopping List Generation
- ✅ Generate shopping list from meal plan
- ✅ Aggregated ingredients with quantities
- ✅ Estimated cost per ingredient
- ✅ Total calorie count
- ✅ Cost per person calculation
- ✅ **Export to CSV**: Download shopping list as CSV file
- ✅ **Print**: Print-friendly view of shopping list

### 5. Additional Features
- ✅ Ingredient search (via exclude/include functionality)
- ✅ Automatic portion sizing based on serving size
- ✅ Real-time updates when selecting recipes
- ✅ React Query integration for optimized data fetching

## File Structure

### React Query Hooks
- `/frontend/src/hooks/useMealPlans.query.ts` - Meal plan data fetching hooks
- `/frontend/src/hooks/useRecipes.query.ts` - Recipe data fetching hooks
- `/frontend/src/lib/queryClient.ts` - React Query configuration

### Components
```
/frontend/src/components/features/mealplans/
├── MealPlanForm.tsx          # Initial setup form
├── MealPlanWeekView.tsx      # 7-day grid layout
├── MealSlot.tsx              # Individual meal slot with constraints
└── ShoppingListView.tsx      # Shopping list display
```

### Pages
- `/frontend/src/pages/MealPlansPage.tsx` - Main meal planning page
- `/frontend/src/pages/RecipesPage.tsx` - Updated with React Query

## How to Use

### Creating a Meal Plan

1. Navigate to "Meal Plans" in the navigation
2. Click "Create New Meal Plan"
3. Fill out the form:
   - Enter a name (optional - auto-generates based on date)
   - Set the number of people
   - Check which meals to include
4. Click "Create Meal Plan"

### Planning Your Week

1. For each meal slot:
   - **Set Constraints** (optional):
     - Select health rating from dropdown
     - Select cuisine type from dropdown
     - Enter ingredients to exclude (comma-separated)
   - **Customize Options**: Set how many recipes to show (default: 3)
   - **Randomize**: Click "Randomize" button
   - **Select**: Choose from the presented options

2. Repeat for all meal slots

### Generating Shopping List

1. Click "Generate Shopping List" button
2. Review the shopping list with:
   - All ingredients with quantities
   - Estimated costs
   - Total calories
   - Cost per person
3. Options:
   - **Print**: Print the shopping list
   - **Export CSV**: Download as spreadsheet
   - **Back**: Return to meal plan editing

## API Integration

### Endpoints Used

```
POST   /api/mealplans                        # Create meal plan
GET    /api/mealplans/{id}                   # Get meal plan with recipes
POST   /api/mealplans/add-recipe             # Add recipe to meal plan
POST   /api/mealplans/randomize              # Get randomized recipe options
GET    /api/mealplans/{id}/shopping-list     # Generate shopping list
```

### Data Flow

1. **Create Meal Plan**: `MealPlanForm` → `useCreateMealPlan` → API → Returns meal plan ID
2. **Load Meal Plan**: `useMealPlan(id)` → Fetches meal plan with all recipes
3. **Randomize**: `MealSlot` → `useRandomizeRecipe` → Returns recipe options
4. **Add Recipe**: User selects → `useAddRecipeToMealPlan` → Updates meal plan
5. **Shopping List**: `useShoppingList` → Calculates aggregated ingredients

## React Query Benefits

The implementation uses React Query for:
- ✅ **Automatic Caching**: No duplicate requests
- ✅ **Background Refetching**: Keep data fresh
- ✅ **Optimistic Updates**: Immediate UI feedback
- ✅ **Request Deduplication**: Multiple components can use same data
- ✅ **Loading States**: Built-in loading indicators
- ✅ **Error Handling**: Automatic retry logic

## Demo User Setup

The frontend is configured to use a demo user:
- **User ID**: `00000000-0000-0000-0000-000000000001`
- **Location**: `/frontend/src/constants.ts`

To use a different user, update the `DEMO_USER_ID` constant.

## Next Steps

### Optional Enhancements

1. **Search by Ingredients**:
   - Already possible via the randomization with constraints
   - Could add dedicated search UI

2. **Save Meal Plans**:
   - Currently creates new meal plans
   - Could add ability to load/edit existing ones
   - Would need a meal plan list view

3. **Recipe Ingredient Search**:
   - Use the existing `/api/recipes/search-by-ingredients` endpoint
   - Add search form to find recipes with specific ingredients

4. **Meal Plan History**:
   - List all user's meal plans
   - Filter by date range
   - Clone previous meal plans

## Testing

### To test the feature:

1. Make sure the API is running:
   ```bash
   cd RecipeApi
   SEED=true dotnet run
   ```

2. Make sure the frontend is running:
   ```bash
   cd frontend
   npm run dev
   ```

3. Navigate to http://localhost:5173/mealplans

4. Create a meal plan and test:
   - Setting constraints
   - Randomizing recipes
   - Selecting recipes
   - Generating shopping list
   - Exporting to CSV

## Troubleshooting

### Issue: "No recipes found matching your criteria"
- **Solution**: Loosen constraints (remove health/cuisine filters) or add more recipes to the database

### Issue: Shopping list shows "$0.00"
- **Solution**: Some recipes in the seed data may not have cost information

### Issue: React Query errors
- **Solution**: Make sure `@tanstack/react-query` is installed and QueryClientProvider is wrapping the app

## Technologies Used

- **Frontend**: React + TypeScript + Vite
- **State Management**: React Query (TanStack Query)
- **Styling**: Tailwind CSS
- **Backend**: ASP.NET Core Minimal APIs
- **Database**: PostgreSQL
