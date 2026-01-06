import axios, { AxiosError } from "axios";
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  Recipe,
  RecipeWithIngredients,
  CreateRecipeDto,
  UpdateRecipeDto,
  GetAllRecipesParams,
  SearchRecipesByIngredientsDto,
  Ingredient,
  MealPlan,
  MealPlanWithRecipes,
  CreateMealPlanDto,
  AddRecipeToMealPlanDto,
  RandomizeRecipeDto,
  ShoppingList,
  SharedRecipe,
  ShareRecipeDto,
  MealPlanRecipe,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Error handler
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return (
      axiosError.response?.data?.message ||
      axiosError.message ||
      "An error occurred"
    );
  }
  return "An unexpected error occurred";
};

// ===== USER API =====
export const userApi = {
  getUser: (id: string) =>
    api.get<User>(`/users/${id}`).then((res) => res.data),
  createUser: (data: CreateUserDto) =>
    api.post<User>("/users", data).then((res) => res.data),
  updateUser: (id: string, data: UpdateUserDto) =>
    api.put<User>(`/users/${id}`, data).then((res) => res.data),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
};

// ===== RECIPE API =====
export const recipeApi = {
  getAllRecipes: (params?: GetAllRecipesParams) =>
    api
      .get<Recipe[] | RecipeWithIngredients[]>("/recipes", { params })
      .then((res) => res.data),

  getRecipe: (id: string) =>
    api.get<RecipeWithIngredients>(`/recipes/${id}`).then((res) => res.data),

  createRecipe: (data: CreateRecipeDto) =>
    api.post<RecipeWithIngredients>("/recipes", data).then((res) => res.data),

  updateRecipe: (id: string, data: UpdateRecipeDto) =>
    api.put<Recipe>(`/recipes/${id}`, data).then((res) => res.data),

  deleteRecipe: (id: string) => api.delete(`/recipes/${id}`),

  searchByIngredients: (data: SearchRecipesByIngredientsDto) =>
    api
      .post<RecipeWithIngredients[]>("/recipes/search-by-ingredients", data)
      .then((res) => res.data),

  shareRecipe: (data: ShareRecipeDto) =>
    api.post<SharedRecipe>("/recipes/share", data).then((res) => res.data),
};

// ===== INGREDIENT API =====
export const ingredientApi = {
  getIngredient: (id: string) =>
    api.get<Ingredient>(`/ingredients/${id}`).then((res) => res.data),

  getIngredientsByRecipe: (recipeId: string) =>
    api
      .get<Ingredient[]>(`/ingredients/by-recipe/${recipeId}`)
      .then((res) => res.data),

  deleteIngredient: (id: string) => api.delete(`/ingredients/${id}`),
};

// ===== MEAL PLAN API =====
export const mealPlanApi = {
  createMealPlan: (data: CreateMealPlanDto) =>
    api.post<MealPlan>("/mealplans", data).then((res) => res.data),

  getMealPlan: (id: string) =>
    api.get<MealPlanWithRecipes>(`/mealplans/${id}`).then((res) => res.data),

  addRecipeToMealPlan: (data: AddRecipeToMealPlanDto) =>
    api
      .post<MealPlanRecipe>("/mealplans/add-recipe", data)
      .then((res) => res.data),

  randomizeRecipe: (data: RandomizeRecipeDto) =>
    api.post<Recipe[]>("/mealplans/randomize", data).then((res) => res.data),

  generateShoppingList: (mealPlanId: string) =>
    api
      .get<ShoppingList>(`/mealplans/${mealPlanId}/shopping-list`)
      .then((res) => res.data),
};

// ===== SHARED RECIPES API =====
export const sharedRecipeApi = {
  getSharedRecipes: (userId: string) =>
    api
      .get<SharedRecipe[]>(`/users/${userId}/shared-recipes`)
      .then((res) => res.data),
};

export default api;
