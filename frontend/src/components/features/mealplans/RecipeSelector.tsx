import { useState } from 'react';
import { Button, Card, CardContent, Input, Select } from '../../ui';
import { useRecipes } from '../../../hooks/useRecipes.query';
import { CUISINE_TYPES, HEALTH_RATINGS } from '../../../types';
import { DEMO_USER_ID } from '../../../constants';
import type { Recipe } from '../../../types';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');
  const [healthFilter, setHealthFilter] = useState('');

  const { data: recipes = [], isLoading } = useRecipes({
    userId: DEMO_USER_ID,
    searchTerm: searchTerm || undefined,
    cuisineType: cuisineFilter || undefined,
    healthRating: healthFilter || undefined,
    includeIngredients: false,
  });

  if (!isOpen) return null;

  const handleSelect = (recipe: Recipe) => {
    onSelect(recipe);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
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

          {/* Recipe List */}
          <div className="overflow-y-auto max-h-[60vh] space-y-2">
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
                  className="w-full text-left p-4 bg-white hover:bg-primary-50 border border-neutral-200 hover:border-primary-300 rounded-lg transition-colors"
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
        </CardContent>
      </Card>
    </div>
  );
};
