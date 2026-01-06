import { useState } from 'react';
import { Container } from '../components/layout/Container';
import { Button, Card, CardContent, Input, Select } from '../components/ui';
import { useRecipes, useRecipeMutations, useRecipe } from '../hooks/useRecipes';
import { RecipeForm } from '../components/features/recipes/RecipeForm';
import { RecipeDetail } from '../components/features/recipes/RecipeDetail';
import { RecipeCard } from '../components/features/recipes/RecipeCard';
import { CUISINE_TYPES, HEALTH_RATINGS } from '../types';
import { DEMO_USER_ID } from '../constants';

export const RecipesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');
  const [healthFilter, setHealthFilter] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'lastCooked' | 'createdAt'>('createdAt');
  const [showForm, setShowForm] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  // TODO: Replace with actual user ID from auth context
  const userId = DEMO_USER_ID;

  const { recipes, loading, error, refetch } = useRecipes({
    userId,
    searchTerm: searchTerm || undefined,
    cuisineType: cuisineFilter || undefined,
    healthRating: healthFilter || undefined,
    sortBy,
    includeIngredients: false,
  });

  const { recipe: selectedRecipe, loading: recipeLoading } = useRecipe(selectedRecipeId);
  const { createRecipe, deleteRecipe } = useRecipeMutations();

  const handleCreateRecipe = async (data: any) => {
    await createRecipe(data);
    refetch();
  };

  const handleDelete = async () => {
    if (selectedRecipeId) {
      await deleteRecipe(selectedRecipeId);
      setSelectedRecipeId(null);
      refetch();
    }
  };

  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Recipe Library</h1>
        <p className="text-neutral-600">Manage and organize all your recipes in one place</p>
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

      {/* Recipe Form Modal */}
      <RecipeForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreateRecipe}
        userId={userId}
      />

      {/* Recipe Detail Modal */}
      <RecipeDetail
        isOpen={!!selectedRecipeId && !recipeLoading}
        onClose={() => setSelectedRecipeId(null)}
        recipe={selectedRecipe}
        onDelete={handleDelete}
      />
    </Container>
  );
};
