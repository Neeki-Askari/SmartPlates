// This is the React Query version of RecipesPage
// After installing @tanstack/react-query, rename this file to RecipesPage.tsx to use it

import { useState } from 'react';
import { Container } from '../components/layout/Container';
import { Button, Card, CardContent, Input, Select } from '../components/ui';
import {
  useRecipes,
  useRecipe,
  useCreateRecipe,
  useUpdateRecipe,
  useDeleteRecipe,
} from '../hooks/useRecipes.query';
import { RecipeForm } from '../components/features/recipes/RecipeForm';
import { RecipeDetail } from '../components/features/recipes/RecipeDetail';
import { RecipeCard } from '../components/features/recipes/RecipeCard';
import { CUISINE_TYPES, HEALTH_RATINGS } from '../types';
import { useUser } from '../contexts/UserContext';

export const RecipesPage = () => {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');
  const [healthFilter, setHealthFilter] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'lastCooked' | 'createdAt'>('createdAt');
  const [showForm, setShowForm] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [showMyRecipesOnly, setShowMyRecipesOnly] = useState(true);

  // Get user ID from synced user (this is the database Guid)
  const userId = user?.id;

  // React Query hooks
  const {
    data: recipes = [],
    isLoading: loading,
    error: queryError,
    refetch,
  } = useRecipes({
    userId: showMyRecipesOnly ? userId : undefined,
    searchTerm: searchTerm || undefined,
    cuisineType: cuisineFilter || undefined,
    healthRating: healthFilter || undefined,
    sortBy,
    includeIngredients: false,
  });

  const { data: selectedRecipe, isLoading: recipeLoading } = useRecipe(selectedRecipeId);
  const { data: editingRecipe, isLoading: editingRecipeLoading } = useRecipe(editingRecipeId);
  const createRecipeMutation = useCreateRecipe();
  const updateRecipeMutation = useUpdateRecipe();
  const deleteRecipeMutation = useDeleteRecipe();

  const error = queryError ? String(queryError) : null;

  const handleCreateRecipe = async (data: any) => {
    await createRecipeMutation.mutateAsync(data);
    setShowForm(false);
  };

  const handleUpdateRecipe = async (data: any) => {
    if (editingRecipeId) {
      await updateRecipeMutation.mutateAsync({ id: editingRecipeId, data });
      setEditingRecipeId(null);
    }
  };

  const handleDelete = async () => {
    if (selectedRecipeId) {
      await deleteRecipeMutation.mutateAsync(selectedRecipeId);
      setSelectedRecipeId(null);
    }
  };

  const handleEdit = (recipeId: string) => {
    setEditingRecipeId(recipeId);
    setSelectedRecipeId(null);
    setShowForm(false);
  };

  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Recipe Library</h1>
            <p className="text-neutral-600">Manage and organize all your recipes in one place</p>
          </div>

          {/* Toggle between My Recipes and All Recipes */}
          <div className="flex items-center bg-neutral-100 rounded-lg p-1">
            <button
              onClick={() => setShowMyRecipesOnly(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                showMyRecipesOnly
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              My Recipes
            </button>
            <button
              onClick={() => setShowMyRecipesOnly(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                !showMyRecipesOnly
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All Recipes
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
            <Select
              fullWidth
              value={cuisineFilter}
              onChange={(e) => setCuisineFilter(e.target.value)}
              options={[
                { value: '', label: 'All Cuisines' },
                ...CUISINE_TYPES.map(c => ({ value: c, label: c })),
              ]}
            />
            <Select
              fullWidth
              value={healthFilter}
              onChange={(e) => setHealthFilter(e.target.value)}
              options={[
                { value: '', label: 'All Health Ratings' },
                ...HEALTH_RATINGS.map(h => ({ value: h, label: h })),
              ]}
            />
            <Select
              fullWidth
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              options={[
                { value: 'createdAt', label: 'Newest First' },
                { value: 'name', label: 'Name (A-Z)' },
                { value: 'lastCooked', label: 'Recently Cooked' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-neutral-600">
          {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found
        </p>
        <Button onClick={() => setShowForm(true)}>+ Add New Recipe</Button>
      </div>

      {/* Recipe grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-neutral-600">Loading recipes...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-600 mb-4">No recipes found. Start by adding your first recipe!</p>
          <Button onClick={() => setShowForm(true)}>+ Add New Recipe</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => setSelectedRecipeId(recipe.id)}
            />
          ))}
        </div>
      )}

      {/* Create Recipe Form Modal */}
      <RecipeForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreateRecipe}
        userId={userId}
      />

      {/* Edit Recipe Form Modal */}
      <RecipeForm
        isOpen={!!editingRecipeId && !editingRecipeLoading}
        onClose={() => setEditingRecipeId(null)}
        onSubmit={handleUpdateRecipe}
        userId={userId}
        recipe={editingRecipe}
      />

      {/* Recipe Detail Modal */}
      <RecipeDetail
        isOpen={!!selectedRecipeId && !recipeLoading}
        onClose={() => setSelectedRecipeId(null)}
        recipe={selectedRecipe}
        onDelete={handleDelete}
        onEdit={() => selectedRecipeId && handleEdit(selectedRecipeId)}
      />
    </Container>
  );
};
