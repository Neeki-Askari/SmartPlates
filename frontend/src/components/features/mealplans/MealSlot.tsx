import { useState } from 'react';
import { Button, Select, Card, CardContent } from '../../ui';
import { RecipeSelector } from './RecipeSelector';
import type { MealType, Recipe } from '../../../types';
import { CUISINE_TYPES, HEALTH_RATINGS } from '../../../types';

interface MealSlotProps {
  dayOfWeek: number;
  mealType: MealType;
  mealPlanId: string;
  currentRecipe?: Recipe;
  onRandomize: (
    healthRating?: string,
    cuisineType?: string,
    excludeIngredients?: string[],
    optionCount?: number
  ) => Promise<Recipe[]>;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const MealSlot = ({
  dayOfWeek,
  mealType,
  currentRecipe,
  onRandomize,
  onSelectRecipe,
}: MealSlotProps) => {
  const [healthRating, setHealthRating] = useState<string>('');
  const [cuisineType, setCuisineType] = useState<string>('');
  const [excludeIngredients, setExcludeIngredients] = useState<string>('');
  const [optionCount, setOptionCount] = useState<number>(3);
  const [options, setOptions] = useState<Recipe[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showManualSelector, setShowManualSelector] = useState(false);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [showConstraints, setShowConstraints] = useState(false);

  const handleRandomize = async () => {
    setIsRandomizing(true);
    try {
      const excludedList = excludeIngredients
        .split(',')
        .map((i) => i.trim())
        .filter((i) => i.length > 0);

      const recipes = await onRandomize(
        healthRating || undefined,
        cuisineType || undefined,
        excludedList.length > 0 ? excludedList : undefined,
        optionCount
      );

      setOptions(recipes);
      setShowOptions(true);
    } catch (error) {
      console.error('Error randomizing recipe:', error);
    } finally {
      setIsRandomizing(false);
    }
  };

  const handleSelectOption = (recipe: Recipe) => {
    onSelectRecipe(recipe);
    setShowOptions(false);
    setOptions([]);
  };

  const handleManualSelect = (recipe: Recipe) => {
    onSelectRecipe(recipe);
    setShowManualSelector(false);
  };

  const handleClearRecipe = () => {
    // Clear by selecting a null recipe - you may need to adjust backend to support this
    setShowOptions(false);
    setOptions([]);
  };

  return (
    <>
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          {/* Current Recipe Display */}
          {currentRecipe ? (
            <div className="mb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-neutral-900 truncate">
                    {currentRecipe.title}
                  </h4>
                  {currentRecipe.description && (
                    <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                      {currentRecipe.description}
                    </p>
                  )}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {currentRecipe.cuisineType && (
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                        {currentRecipe.cuisineType}
                      </span>
                    )}
                    {currentRecipe.healthRating && (
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                        {currentRecipe.healthRating}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleClearRecipe}
                  className="ml-2 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Clear recipe"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-3 text-center py-4 bg-neutral-50 rounded-lg border-2 border-dashed border-neutral-300">
              <p className="text-sm text-neutral-500">No recipe selected</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mb-3">
            <Button
              onClick={() => setShowManualSelector(true)}
              size="sm"
              variant="secondary"
              fullWidth
            >
              Choose Recipe
            </Button>
            <Button
              onClick={() => setShowConstraints(!showConstraints)}
              size="sm"
              variant="secondary"
              fullWidth
            >
              {showConstraints ? 'Hide Options' : 'Randomize'}
            </Button>
          </div>

          {/* Constraints Panel (Collapsible) */}
          {showConstraints && (
            <div className="border-t border-neutral-200 pt-3 space-y-3">
              {/* Constraint Filters */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Health
                  </label>
                  <Select
                    value={healthRating}
                    onChange={(e) => setHealthRating(e.target.value)}
                    options={[
                      { value: '', label: 'Any' },
                      ...HEALTH_RATINGS.map((h) => ({ value: h, label: h })),
                    ]}
                    fullWidth
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Cuisine
                  </label>
                  <Select
                    value={cuisineType}
                    onChange={(e) => setCuisineType(e.target.value)}
                    options={[
                      { value: '', label: 'Any' },
                      ...CUISINE_TYPES.map((c) => ({ value: c, label: c })),
                    ]}
                    fullWidth
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Exclude Ingredients */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Exclude Ingredients
                </label>
                <input
                  type="text"
                  value={excludeIngredients}
                  onChange={(e) => setExcludeIngredients(e.target.value)}
                  placeholder="e.g., nuts, dairy"
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Options Count */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Number of Options
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={optionCount}
                  onChange={(e) => setOptionCount(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Generate Options Button */}
              <Button
                onClick={handleRandomize}
                disabled={isRandomizing}
                fullWidth
                size="sm"
              >
                {isRandomizing ? 'Generating...' : 'Generate Options'}
              </Button>

              {/* Options Display */}
              {showOptions && options.length > 0 && (
                <div className="border-t border-neutral-200 pt-3">
                  <p className="text-xs font-medium text-neutral-700 mb-2">
                    Select from options:
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {options.map((recipe) => (
                      <button
                        key={recipe.id}
                        onClick={() => handleSelectOption(recipe)}
                        className="w-full text-left px-3 py-2 bg-neutral-50 hover:bg-primary-50 rounded-lg border border-neutral-200 hover:border-primary-300 transition-colors cursor-pointer"
                      >
                        <div className="font-medium text-sm text-neutral-900">
                          {recipe.title}
                        </div>
                        {recipe.description && (
                          <div className="text-xs text-neutral-600 mt-1 line-clamp-2">
                            {recipe.description}
                          </div>
                        )}
                        <div className="flex gap-2 mt-1.5 flex-wrap">
                          {recipe.cuisineType && (
                            <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                              {recipe.cuisineType}
                            </span>
                          )}
                          {recipe.healthRating && (
                            <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                              {recipe.healthRating}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {showOptions && options.length === 0 && (
                <div className="border-t border-neutral-200 pt-3">
                  <p className="text-xs text-neutral-500 text-center py-4 bg-neutral-50 rounded">
                    No recipes found matching your criteria. Try adjusting the filters.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recipe Selector Modal */}
      <RecipeSelector
        isOpen={showManualSelector}
        onClose={() => setShowManualSelector(false)}
        onSelect={handleManualSelect}
        title="Select a Recipe"
      />
    </>
  );
};
