import { useState, useEffect, useCallback, useMemo } from 'react';
import { recipeApi, handleApiError } from '../services/api';
import type {
  Recipe,
  RecipeWithIngredients,
  CreateRecipeDto,
  UpdateRecipeDto,
  GetAllRecipesParams,
} from '../types';

export const useRecipes = (params?: GetAllRecipesParams) => {
  const [recipes, setRecipes] = useState<Recipe[] | RecipeWithIngredients[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stabilize params with useMemo to prevent infinite loops
  const stableParams = useMemo(() => params, [
    params?.userId,
    params?.cuisineType,
    params?.healthRating,
    params?.searchTerm,
    params?.sortBy,
    params?.includeIngredients,
    params?.page,
    params?.pageSize,
  ]);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await recipeApi.getAllRecipes(stableParams);
      setRecipes(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, [stableParams]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return { recipes, loading, error, refetch: fetchRecipes };
};

export const useRecipe = (id: string | null) => {
  const [recipe, setRecipe] = useState<RecipeWithIngredients | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await recipeApi.getRecipe(id);
        setRecipe(data);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  return { recipe, loading, error };
};

export const useRecipeMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRecipe = async (data: CreateRecipeDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await recipeApi.createRecipe(data);
      return result;
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const updateRecipe = async (id: string, data: UpdateRecipeDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await recipeApi.updateRecipe(id, data);
      return result;
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await recipeApi.deleteRecipe(id);
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return {
    createRecipe,
    updateRecipe,
    deleteRecipe,
    loading,
    error,
  };
};
