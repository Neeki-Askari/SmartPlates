import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, Input, Select, Modal } from '../../ui';
import { RecipeForm } from '../recipes/RecipeForm';
import { useRecipes, useCreateRecipe } from '../../../hooks/useRecipes.query';
import { CUISINE_TYPES, HEALTH_RATINGS } from '../../../types';
import { useUser } from '../../../contexts/UserContext';
import type { CreateRecipeDto, Recipe, UpdateRecipeDto } from '../../../types';

interface RecipeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (recipe: Recipe) => void;
  title?: string;
}

export const RecipeSelector = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Select a Recipe',
}: RecipeSelectorProps) => {
  const { user } = useUser();
  const { isAuthenticated } = useAuth0();
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');
  const [healthFilter, setHealthFilter] = useState('');
  const [mineOnly, setMineOnly] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: recipes = [], isLoading } = useRecipes({
    // Show all available recipes (public + your own) by default; filter to just yours when toggled.
    userId: mineOnly ? user?.id : undefined,
    searchTerm: searchTerm || undefined,
    cuisineType: cuisineFilter || undefined,
    healthRating: healthFilter || undefined,
    includeIngredients: false,
  });

  const createRecipeMutation = useCreateRecipe();

  const handleSelect = (recipe: Recipe) => {
    onSelect(recipe);
    onClose();
  };

  // Create a new recipe and immediately select it for this meal slot
  const handleCreateRecipe = async (data: CreateRecipeDto | UpdateRecipeDto) => {
    const newRecipe = await createRecipeMutation.mutateAsync(data as CreateRecipeDto);
    setShowAddForm(false);
    handleSelect(newRecipe);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={title} size="xl">
        {/* Add a recipe inline */}
        <div className="flex justify-end mb-4">
          <Button
            onClick={() => setShowAddForm(true)}
            disabled={!isAuthenticated}
            title={!isAuthenticated ? 'Log in to add a recipe' : undefined}
          >
            + Add New Recipe
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
          <Select
            value={cuisineFilter}
            onChange={(e) => setCuisineFilter(e.target.value)}
            options={[
              { value: '', label: 'All Cuisines' },
              ...CUISINE_TYPES.map((c) => ({ value: c, label: c })),
            ]}
            fullWidth
          />
          <Select
            value={healthFilter}
            onChange={(e) => setHealthFilter(e.target.value)}
            options={[
              { value: '', label: 'All Health Ratings' },
              ...HEALTH_RATINGS.map((h) => ({ value: h, label: h })),
            ]}
            fullWidth
          />
        </div>

        {/* My recipes only toggle */}
        <label className="flex items-center gap-2 mb-6 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={mineOnly}
            onChange={(e) => setMineOnly(e.target.checked)}
            className="w-4 h-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500"
          />
          <span className="text-sm text-neutral-700">My recipes only</span>
        </label>

        {/* Recipe List */}
        <div className="overflow-y-auto max-h-[55vh] space-y-2">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-neutral-600">Loading recipes...</p>
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-600">No recipes found</p>
            </div>
          ) : (
            recipes.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => handleSelect(recipe)}
                className="w-full text-left p-4 bg-white hover:bg-primary-50 border border-neutral-200 hover:border-primary-300 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900">{recipe.title}</h3>
                    {recipe.description && (
                      <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
                        {recipe.description}
                      </p>
                    )}
                    <div className="flex gap-3 mt-2">
                      {recipe.cuisineType && (
                        <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-700 rounded">
                          {recipe.cuisineType}
                        </span>
                      )}
                      {recipe.healthRating && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                          {recipe.healthRating}
                        </span>
                      )}
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {recipe.originalServings} servings
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Modal>

      {/* Add New Recipe Form — mounted only while open so it always starts blank */}
      {showAddForm && (
        <RecipeForm
          isOpen
          onClose={() => setShowAddForm(false)}
          onSubmit={handleCreateRecipe}
          userId={user?.id}
        />
      )}
    </>
  );
};
