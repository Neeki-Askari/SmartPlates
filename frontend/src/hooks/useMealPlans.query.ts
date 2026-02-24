import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mealPlanApi, handleApiError } from '../services/api';
import type {
  MealPlanWithRecipes,
  MealPlanSummary,
  CreateMealPlanDto,
  UpdateMealPlanDto,
  DuplicateMealPlanDto,
  AddRecipeToMealPlanDto,
  RandomizeRecipeDto,
  ShoppingList,
  Recipe,
} from '../types';

// Query keys factory
export const mealPlanKeys = {
  all: ['mealPlans'] as const,
  lists: () => [...mealPlanKeys.all, 'list'] as const,
  list: (userId: string) => [...mealPlanKeys.lists(), userId] as const,
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

// Fetch user's meal plans
export const useUserMealPlans = (userId: string | null) => {
  return useQuery({
    queryKey: mealPlanKeys.list(userId || ''),
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      try {
        return await mealPlanApi.getUserMealPlans();
      } catch (error) {
        console.error('Error fetching meal plans:', error);
        return [];
      }
    },
    enabled: !!userId,
  });
};

// Update meal plan mutation
export const useUpdateMealPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateMealPlanDto }) => {
      return await mealPlanApi.updateMealPlan(id, data);
    },
    onSuccess: (data, variables) => {
      // Invalidate the specific meal plan and the list
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.lists() });
    },
    onError: (error: unknown) => {
      throw new Error(handleApiError(error));
    },
  });
};

// Duplicate meal plan mutation
export const useDuplicateMealPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DuplicateMealPlanDto) => {
      return await mealPlanApi.duplicateMealPlan(data);
    },
    onSuccess: (data) => {
      // Add to cache and invalidate lists
      queryClient.setQueryData(mealPlanKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.lists() });
    },
    onError: (error: unknown) => {
      throw new Error(handleApiError(error));
    },
  });
};

// Delete meal plan mutation
export const useDeleteMealPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await mealPlanApi.deleteMealPlan(id);
    },
    onSuccess: () => {
      // Invalidate all meal plan lists
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.lists() });
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
