import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mealPlanApi, handleApiError } from '../services/api';
import type {
  MealPlanWithRecipes,
  CreateMealPlanDto,
  AddRecipeToMealPlanDto,
  RandomizeRecipeDto,
  ShoppingList,
  Recipe,
} from '../types';

// Query keys factory
export const mealPlanKeys = {
  all: ['mealPlans'] as const,
  details: () => [...mealPlanKeys.all, 'detail'] as const,
  detail: (id: string) => [...mealPlanKeys.details(), id] as const,
  shoppingList: (id: string) => [...mealPlanKeys.all, 'shoppingList', id] as const,
};

// Fetch single meal plan with recipes
export const useMealPlan = (id: string | null) => {
  return useQuery({
    queryKey: mealPlanKeys.detail(id || ''),
    queryFn: async () => {
      if (!id) throw new Error('Meal plan ID is required');
      return await mealPlanApi.getMealPlan(id);
    },
    enabled: !!id,
  });
};

// Create meal plan mutation
export const useCreateMealPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMealPlanDto) => {
      return await mealPlanApi.createMealPlan(data);
    },
    onSuccess: (data) => {
      // Invalidate and add to cache
      queryClient.setQueryData(mealPlanKeys.detail(data.id), data);
    },
    onError: (error: unknown) => {
      throw new Error(handleApiError(error));
    },
  });
};

// Add recipe to meal plan mutation
export const useAddRecipeToMealPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddRecipeToMealPlanDto) => {
      return await mealPlanApi.addRecipeToMealPlan(data);
    },
    onSuccess: (_, variables) => {
      // Invalidate the meal plan to refetch with new recipe
      queryClient.invalidateQueries({
        queryKey: mealPlanKeys.detail(variables.mealPlanId)
      });
    },
    onError: (error: unknown) => {
      throw new Error(handleApiError(error));
    },
  });
};

// Randomize recipe options mutation
export const useRandomizeRecipe = () => {
  return useMutation({
    mutationFn: async (data: RandomizeRecipeDto): Promise<Recipe[]> => {
      return await mealPlanApi.randomizeRecipe(data);
    },
    onError: (error: unknown) => {
      throw new Error(handleApiError(error));
    },
  });
};

// Fetch shopping list
export const useShoppingList = (mealPlanId: string | null) => {
  return useQuery({
    queryKey: mealPlanKeys.shoppingList(mealPlanId || ''),
    queryFn: async () => {
      if (!mealPlanId) throw new Error('Meal plan ID is required');
      return await mealPlanApi.generateShoppingList(mealPlanId);
    },
    enabled: !!mealPlanId,
  });
};
