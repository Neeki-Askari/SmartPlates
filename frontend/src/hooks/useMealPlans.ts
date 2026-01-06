import { useState, useEffect } from 'react';
import { mealPlanApi, handleApiError } from '../services/api';
import type {
  MealPlanWithRecipes,
  CreateMealPlanDto,
  AddRecipeToMealPlanDto,
  RandomizeRecipeDto,
  ShoppingList,
  Recipe,
  MealPlanRecipe,
} from '../types';

export const useMealPlan = (id: string | null) => {
  const [mealPlan, setMealPlan] = useState<MealPlanWithRecipes | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMealPlan = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const data = await mealPlanApi.getMealPlan(id);
      setMealPlan(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMealPlan();
  }, [id]);

  return { mealPlan, loading, error, refetch: fetchMealPlan };
};

export const useMealPlanMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMealPlan = async (data: CreateMealPlanDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mealPlanApi.createMealPlan(data);
      return result;
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const addRecipeToMealPlan = async (data: AddRecipeToMealPlanDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mealPlanApi.addRecipeToMealPlan(data);
      return result;
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const randomizeRecipe = async (data: RandomizeRecipeDto): Promise<Recipe[]> => {
    setLoading(true);
    setError(null);
    try {
      const result = await mealPlanApi.randomizeRecipe(data);
      return result;
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return {
    createMealPlan,
    addRecipeToMealPlan,
    randomizeRecipe,
    loading,
    error,
  };
};

export const useShoppingList = (mealPlanId: string | null) => {
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShoppingList = async () => {
    if (!mealPlanId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await mealPlanApi.generateShoppingList(mealPlanId);
      setShoppingList(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShoppingList();
  }, [mealPlanId]);

  return { shoppingList, loading, error, refetch: fetchShoppingList };
};
