// User types
export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface CreateUserDto {
  email: string;
  displayName: string;
  password?: string;
}

export interface UpdateUserDto {
  displayName: string;
  password?: string;
}

// Ingredient types
export interface Ingredient {
  id: string;
  recipeId: string;
  name: string;
  quantity?: number;
  unit?: string;
  costPerUnit?: number;
  caloriesPerUnit?: number;
  sizeBought?: string;
  proportionFactor: number;
}

export interface IngredientInput {
  name: string;
  quantity?: number;
  unit?: string;
  costPerUnit?: number;
  caloriesPerUnit?: number;
  sizeBought?: string;
  proportionFactor?: number;
}

// Recipe types
export interface Recipe {
  id: string;
  userId: string;
  title: string;
  description?: string;
  instructions?: string;
  cuisineType?: string;
  healthRating?: string;
  comments?: string;
  recipeLink?: string;
  originalServings: number;
  proportionFactor: number;
  lastCookedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeWithIngredients extends Recipe {
  ingredients: Ingredient[];
}

export interface CreateRecipeDto {
  userId: string;
  title: string;
  description?: string;
  instructions?: string;
  cuisineType?: string;
  healthRating?: string;
  comments?: string;
  recipeLink?: string;
  originalServings: number;
  proportionFactor: number;
  ingredients: IngredientInput[];
}

export interface UpdateRecipeDto {
  title: string;
  description?: string;
  instructions?: string;
  cuisineType?: string;
  healthRating?: string;
  comments?: string;
  recipeLink?: string;
  originalServings: number;
  proportionFactor: number;
  lastCookedDate?: string;
  ingredients: IngredientInput[];
}

export interface GetAllRecipesParams {
  userId?: string;
  cuisineType?: string;
  healthRating?: string;
  searchTerm?: string;
  sortBy?: 'name' | 'lastCooked' | 'createdAt';
  includeIngredients?: boolean;
  page?: number;
  pageSize?: number;
}

export interface SearchRecipesByIngredientsDto {
  userId: string;
  ingredientNames: string[];
  matchAll?: boolean;
}

// Meal Plan types
export enum MealType {
  Breakfast = 0,
  Snack1 = 1,
  Lunch = 2,
  Snack2 = 3,
  Dinner = 4,
  Snack3 = 5,
}

export const MealTypeLabels: Record<MealType, string> = {
  [MealType.Breakfast]: 'Breakfast',
  [MealType.Snack1]: 'Snack 1',
  [MealType.Lunch]: 'Lunch',
  [MealType.Snack2]: 'Snack 2',
  [MealType.Dinner]: 'Dinner',
  [MealType.Snack3]: 'Snack 3 (Dessert)',
};

export interface MealPlan {
  id: string;
  userId: string;
  name: string;
  startDate: string;
  endDate: string;
  servingSize: number;
  includesBreakfast: boolean;
  includesSnack1: boolean;
  includesLunch: boolean;
  includesSnack2: boolean;
  includesDinner: boolean;
  includesSnack3: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MealPlanRecipe {
  id: string;
  mealPlanId: string;
  recipeId: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  mealType: MealType;
  healthRatingConstraint?: string;
  cuisineTypeConstraint?: string;
  recipe: Recipe;
}

export interface MealPlanWithRecipes extends MealPlan {
  mealPlanRecipes: MealPlanRecipe[];
}

export interface CreateMealPlanDto {
  userId: string;
  name: string;
  startDate: string;
  endDate: string;
  servingSize: number;
  includesBreakfast: boolean;
  includesSnack1: boolean;
  includesLunch: boolean;
  includesSnack2: boolean;
  includesDinner: boolean;
  includesSnack3: boolean;
}

export interface AddRecipeToMealPlanDto {
  mealPlanId: string;
  recipeId: string;
  dayOfWeek: number;
  mealType: MealType;
  healthRatingConstraint?: string;
  cuisineTypeConstraint?: string;
}

export interface RandomizeRecipeDto {
  mealPlanId: string;
  dayOfWeek: number;
  mealType: MealType;
  healthRatingConstraint?: string;
  cuisineTypeConstraint?: string;
  excludeIngredients?: string[];
  optionCount?: number;
}

// Shopping List types
export interface ShoppingListItem {
  ingredientName: string;
  totalQuantity: number;
  unit?: string;
  estimatedCost?: number;
  totalCalories?: number;
}

export interface ShoppingList {
  mealPlanId: string;
  mealPlanName: string;
  servingSize: number;
  items: ShoppingListItem[];
  totalEstimatedCost: number;
  totalCalories: number;
}

// Shared Recipe types
export interface SharedRecipe {
  id: string;
  originalRecipeId: string;
  originalOwnerId: string;
  sharedWithUserId: string;
  sharedAt: string;
  copiedRecipeId?: string;
  originalRecipe: RecipeWithIngredients;
  originalOwner: User;
}

export interface ShareRecipeDto {
  recipeId: string;
  sharedWithUserId: string;
}

// Common types
export interface ApiError {
  message: string;
  statusCode?: number;
}

// Constants
export const CUISINE_TYPES = [
  'American',
  'Mexican',
  'Italian',
  'Chinese',
  'Japanese',
  'Indian',
  'Thai',
  'French',
  'Mediterranean',
  'Korean',
  'Vietnamese',
  'Greek',
  'Other',
] as const;

export const HEALTH_RATINGS = [
  'Healthy',
  'Neutral',
  'Unhealthy',
  'Gluten Free',
  'Vegan',
  'Vegetarian',
  'Keto',
  'Paleo',
  'Spicy',
] as const;

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;
