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
  MealPlanSummary,
  CreateMealPlanDto,
  UpdateMealPlanDto,
  DuplicateMealPlanDto,
  AddRecipeToMealPlanDto,
  RandomizeRecipeDto,
  ShoppingList,
  SavedShoppingList,
  SavedShoppingListSummary,
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

// Store token getter function (will be set by App.tsx)
let getAccessToken: (() => Promise<string>) | null = null;

export const setTokenGetter = (tokenGetter: () => Promise<string>) => {
  getAccessToken = tokenGetter;
};

// Add request interceptor to include Auth0 token
api.interceptors.request.use(
  async (config) => {
    if (getAccessToken) {
      try {
        const token = await getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        // Token retrieval failed, continue without token
        console.error('Failed to get access token:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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

// ===== AUTH API =====
export const authApi = {
  syncUser: () =>
    api.post<User>("/auth/sync").then((res) => res.data),
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

  getUserMealPlans: (userId: string) =>
    api.get<MealPlanSummary[]>(`/users/${userId}/mealplans`).then((res) => res.data),

  updateMealPlan: (id: string, data: UpdateMealPlanDto) =>
    api.put<MealPlanSummary>(`/mealplans/${id}`, data).then((res) => res.data),

  deleteMealPlan: (id: string) =>
    api.delete(`/mealplans/${id}`),

  duplicateMealPlan: (data: DuplicateMealPlanDto) =>
    api.post<MealPlanWithRecipes>("/mealplans/duplicate", data).then((res) => res.data),

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

// ===== SHOPPING LIST API =====
export const shoppingListApi = {
  saveShoppingList: (shoppingList: ShoppingList) =>
    api.post<SavedShoppingList>("/shopping-lists/save", shoppingList).then((res) => res.data),

  getUserShoppingLists: (userId: string) =>
    api.get<SavedShoppingListSummary[]>(`/users/${userId}/shopping-lists`).then((res) => res.data),

  getSavedShoppingList: (id: string) =>
    api.get<SavedShoppingList>(`/shopping-lists/${id}`).then((res) => res.data),

  deleteSavedShoppingList: (id: string) =>
    api.delete(`/shopping-lists/${id}`),
};

// ===== SHARED RECIPES API =====
export const sharedRecipeApi = {
  getSharedRecipes: (userId: string) =>
    api
      .get<SharedRecipe[]>(`/users/${userId}/shared-recipes`)
      .then((res) => res.data),
};

export default api;
