# Meal Slot Component Improvements

## Overview
The MealSlot component has been redesigned for better readability and enhanced functionality, including manual recipe selection from your saved recipes.

## Key Improvements

### 1. **Improved Visual Design**
- ✅ **Card-based Layout**: Each meal slot is now a distinct card with shadow and hover effects
- ✅ **Clear Recipe Display**: Selected recipes show with title, description, and tags
- ✅ **Color-coded Tags**: Cuisine (blue) and health rating (green) badges
- ✅ **Empty State**: Clear visual indicator when no recipe is selected
- ✅ **Collapsible Constraints**: Hide/show randomization options to reduce clutter

### 2. **Manual Recipe Selection**
- ✅ **Choose Recipe Button**: Browse and select from your existing recipes
- ✅ **Search & Filter**: Find recipes by name, cuisine, or health rating
- ✅ **Full Recipe Info**: See complete recipe details before selecting
- ✅ **Modal Interface**: Clean, focused selection experience

### 3. **Enhanced User Experience**
- ✅ **Two Selection Modes**:
  1. **Choose Recipe**: Manually pick from your saved recipes
  2. **Randomize**: Generate options based on constraints
- ✅ **Clear Recipe**: Remove selected recipe with X button
- ✅ **Show/Hide Options**: Toggle randomization panel to reduce visual clutter
- ✅ **Better Labels**: Clear, descriptive labels for all inputs
- ✅ **Improved Spacing**: More breathing room between elements

## Component Structure

### MealSlot Component
```
┌─────────────────────────────────────┐
│ Current Recipe Display              │
│ ┌─────────────────────────────────┐ │
│ │ Recipe Title                  × │ │
│ │ Description (2 lines max)       │ │
│ │ [Cuisine] [Health Rating]       │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Choose Recipe] [Randomize]         │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Constraints (when expanded)     │ │
│ │ - Health Rating Dropdown        │ │
│ │ - Cuisine Dropdown              │ │
│ │ - Exclude Ingredients           │ │
│ │ - Number of Options             │ │
│ │ [Generate Options]              │ │
│ │                                 │ │
│ │ Generated Options (if any):     │ │
│ │ - Option 1                      │ │
│ │ - Option 2                      │ │
│ │ - Option 3                      │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### RecipeSelector Modal
```
┌─────────────────────────────────────────┐
│ Select a Recipe                      × │
├─────────────────────────────────────────┤
│ [Search] [Cuisine Filter] [Health]      │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ Recipe 1                            │ │
│ │ Description...                      │ │
│ │ [Italian] [Healthy] [4 servings]    │ │
│ ├─────────────────────────────────────┤ │
│ │ Recipe 2                            │ │
│ │ Description...                      │ │
│ │ [Mexican] [Neutral] [2 servings]    │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│                         [Cancel]         │
└─────────────────────────────────────────┘
```

## Usage Guide

### Manual Selection
1. Click **"Choose Recipe"** button on any meal slot
2. Modal opens with all your saved recipes
3. Use search or filters to narrow down options
4. Click on any recipe to select it
5. Recipe appears in the meal slot

### Randomized Selection
1. Click **"Randomize"** button on any meal slot
2. Constraints panel expands
3. Set your preferences:
   - Health rating (optional)
   - Cuisine type (optional)
   - Ingredients to exclude (comma-separated)
   - Number of options to generate (1-10)
4. Click **"Generate Options"**
5. Review generated options
6. Click on your preferred option to select it

### Clearing a Recipe
- Click the **X** button in the top-right corner of the recipe display
- Slot returns to empty state

## Features

### Recipe Display
- **Title**: Bold, prominent display
- **Description**: Shows first 2 lines
- **Cuisine Badge**: Blue background
- **Health Rating Badge**: Green background
- **Truncation**: Long text is cut off with ellipsis

### Search & Filter (RecipeSelector)
- **Search**: Filters by recipe title and description
- **Cuisine Filter**: Dropdown with all cuisine types
- **Health Filter**: Dropdown with all health ratings
- **Real-time**: Results update as you type/select

### Constraints (Randomization)
- **Collapsible**: Hidden by default to reduce clutter
- **Health Rating**: Filter by dietary preferences
- **Cuisine Type**: Filter by cuisine style
- **Exclude Ingredients**: Comma-separated list (e.g., "nuts, dairy, gluten")
- **Option Count**: 1-10 recipes to choose from

## Visual Improvements

### Before (Old Design)
- Cramped 3-column layout
- Tiny text (text-xs everywhere)
- No visual hierarchy
- Always showing all controls
- Recipe shown in small box

### After (New Design)
- Spacious card layout
- Readable text sizes
- Clear visual hierarchy
- Collapsible controls
- Prominent recipe display
- Color-coded information
- Better hover states
- Professional card shadows

## Technical Details

### New Components
1. **RecipeSelector.tsx** - Modal for manual recipe selection
   - Search functionality
   - Filter by cuisine and health
   - Scrollable recipe list
   - Click to select

2. **Enhanced MealSlot.tsx**
   - Card-based layout
   - Collapsible constraints
   - Manual selection button
   - Clear recipe button
   - Improved recipe display

### Props (unchanged)
- `dayOfWeek`: 0-6 (Sunday-Saturday)
- `mealType`: MealType enum
- `currentRecipe`: Selected recipe or undefined
- `onRandomize`: Callback for randomization
- `onSelectRecipe`: Callback when recipe is selected

### State Management
- Uses React Query for recipe fetching
- Local state for UI controls
- Optimistic updates on selection

## Benefits

1. **Easier to Read**
   - Larger text
   - Better spacing
   - Clear visual hierarchy

2. **More Functional**
   - Manual selection option
   - Browse all your recipes
   - Search and filter

3. **Less Cluttered**
   - Collapsible constraints
   - Show only what you need
   - Clean empty states

4. **Better UX**
   - Clear buttons
   - Intuitive actions
   - Visual feedback

## Testing

To test the improvements:

1. **Create a meal plan**
   ```
   Navigate to /mealplans
   Click "Create New Meal Plan"
   Select meals and serving size
   ```

2. **Test manual selection**
   ```
   Click "Choose Recipe" on any slot
   Search for a recipe
   Filter by cuisine/health
   Select a recipe
   ```

3. **Test randomization**
   ```
   Click "Randomize" on any slot
   Set health/cuisine constraints
   Add excluded ingredients
   Set option count
   Click "Generate Options"
   Select from results
   ```

4. **Test clearing**
   ```
   Click X on selected recipe
   Verify slot returns to empty state
   ```

## Browser Support

Works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Accessibility

- ✅ Keyboard navigation
- ✅ Focus states
- ✅ ARIA labels on buttons
- ✅ Semantic HTML
- ✅ Color contrast compliant

## Future Enhancements

Potential improvements:
- Drag and drop recipes between slots
- Quick actions (duplicate, swap)
- Recipe preview on hover
- Favorite recipes for quick access
- Recently used recipes section
- Bulk randomization (all meals at once)
