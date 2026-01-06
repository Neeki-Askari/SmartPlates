import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeApi, handleApiError } from '../services/api';
import type {
  Recipe,
  RecipeWithIngredients,
  CreateRecipeDto,
  UpdateRecipeDto,
  GetAllRecipesParams,
} from '../types';

// Query keys factory
export const recipeKeys = {
  all: ['recipes'] as const,
  lists: () => [...recipeKeys.all, 'list'] as const,
  list: (params?: GetAllRecipesParams) => [...recipeKeys.lists(), params] as const,
  details: () => [...recipeKeys.all, 'detail'] as const,
  detail: (id: string) => [...recipeKeys.details(), id] as const,
};

// Fetch all recipes with optional filters
export const useRecipes = (params?: GetAllRecipesParams) => {
  return useQuery({
    queryKey: recipeKeys.list(params),
    queryFn: async () => {
      const data = await recipeApi.getAllRecipes(params);
      return data;
    },
    enabled: !!params?.userId, // Only fetch if userId is provided
  });
};

// Fetch single recipe
export const useRecipe = (id: string | null) => {
  return useQuery({
    queryKey: recipeKeys.detail(id || ''),
    queryFn: async () => {
      if (!id) throw new Error('Recipe ID is required');
      return await recipeApi.getRecipe(id);
    },
    enabled: !!id,
  });
};

// Create recipe mutation
export const useCreateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRecipeDto) => {
      return await recipeApi.createRecipe(data);
    },
    onSuccess: () => {
      // Invalidate and refetch recipes list
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
    onError: (error: unknown) => {
      throw new Error(handleApiError(error));
    },
  });
};

// Update recipe mutation
export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateRecipeDto }) => {
      return await recipeApi.updateRecipe(id, data);
    },
    onSuccess: (_, variables) => {
      // Invalidate the specific recipe and lists
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
    onError: (error: unknown) => {
      throw new Error(handleApiError(error));
    },
  });
};

// Delete recipe mutation
export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await recipeApi.deleteRecipe(id);
    },
    onSuccess: () => {
      // Invalidate recipes list
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
    onError: (error: unknown) => {
      throw new Error(handleApiError(error));
    },
  });
};
