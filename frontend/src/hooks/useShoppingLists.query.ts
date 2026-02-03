import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shoppingListApi, handleApiError } from '../services/api';
import type {
  ShoppingList,
  SavedShoppingList,
  SavedShoppingListSummary,
} from '../types';

// Query keys factory
export const shoppingListKeys = {
  all: ['shoppingLists'] as const,
  lists: () => [...shoppingListKeys.all, 'list'] as const,
  list: (userId: string) => [...shoppingListKeys.lists(), userId] as const,
  details: () => [...shoppingListKeys.all, 'detail'] as const,
  detail: (id: string) => [...shoppingListKeys.details(), id] as const,
};

// Fetch user's saved shopping lists
export const useUserShoppingLists = (userId: string | null) => {
  return useQuery({
    queryKey: shoppingListKeys.list(userId || ''),
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      try {
        return await shoppingListApi.getUserShoppingLists(userId);
      } catch (error) {
        console.error('Error fetching shopping lists:', error);
        return [];
      }
    },
    enabled: !!userId,
  });
};

// Fetch single saved shopping list
export const useSavedShoppingList = (id: string | null) => {
  return useQuery({
    queryKey: shoppingListKeys.detail(id || ''),
    queryFn: async () => {
      if (!id) throw new Error('Shopping list ID is required');
      return await shoppingListApi.getSavedShoppingList(id);
    },
    enabled: !!id,
  });
};

// Save shopping list mutation
export const useSaveShoppingList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ShoppingList) => {
      return await shoppingListApi.saveShoppingList(data);
    },
    onSuccess: (data) => {
      // Add to cache and invalidate lists
      queryClient.setQueryData(shoppingListKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: shoppingListKeys.lists() });
    },
    onError: (error: unknown) => {
      throw new Error(handleApiError(error));
    },
  });
};

// Delete saved shopping list mutation
export const useDeleteShoppingList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await shoppingListApi.deleteSavedShoppingList(id);
    },
    onSuccess: () => {
      // Invalidate all shopping list lists
      queryClient.invalidateQueries({ queryKey: shoppingListKeys.lists() });
    },
    onError: (error: unknown) => {
      throw new Error(handleApiError(error));
    },
  });
};
