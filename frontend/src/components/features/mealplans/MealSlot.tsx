import { useState } from 'react';
import { Button, Card, CardContent, Modal } from '../../ui';
import { RecipeSelector } from './RecipeSelector';
import { RecipeDetail } from '../recipes/RecipeDetail';
import { RecipeForm } from '../recipes/RecipeForm';
import { useRecipe, useUpdateRecipe } from '../../../hooks/useRecipes.query';
import { useUser } from '../../../contexts/UserContext';
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
  const [showRandomizeModal, setShowRandomizeModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const { user } = useUser();
  const { data: fullRecipe } = useRecipe(showDetailModal || showEditModal ? (currentRecipe?.id ?? null) : null);
  const updateRecipeMutation = useUpdateRecipe();

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
    setShowRandomizeModal(false);
  };

  const handleManualSelect = (recipe: Recipe) => {
    onSelectRecipe(recipe);
    setShowManualSelector(false);
  };

  const handleClearRecipe = () => {
    setShowOptions(false);
    setOptions([]);
  };

  return (
    <>
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-2">
          {/* Current Recipe Display */}
          {currentRecipe ? (
            <div className="mb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4
                    className="font-semibold text-primary-600 text-sm leading-snug cursor-pointer hover:underline"
                    onClick={() => setShowDetailModal(true)}
                  >
                    {currentRecipe.title}
                  </h4>
                  {currentRecipe.description && (
                    <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                      {currentRecipe.description}
                    </p>
                  )}
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {currentRecipe.cuisineType && (
                      <span className="text-xs px-1 py-0.5 bg-blue-100 text-blue-700 rounded leading-tight">
                        {currentRecipe.cuisineType}
                      </span>
                    )}
                    {currentRecipe.healthRating && (
                      <span className="text-xs px-1 py-0.5 bg-green-100 text-green-700 rounded leading-tight">
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
            <div className="mb-2 text-center py-2 bg-neutral-50 rounded-lg border-2 border-dashed border-neutral-300">
              <p className="text-xs text-neutral-400">Empty</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => setShowManualSelector(true)}
              size="sm"
              variant="secondary"
              fullWidth
            >
              Choose Recipe
            </Button>
            <Button
              onClick={() => { setShowOptions(false); setOptions([]); setShowRandomizeModal(true); }}
              size="sm"
              variant="secondary"
              fullWidth
            >
              Randomize
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Randomize Modal */}
      <Modal
        isOpen={showRandomizeModal}
        onClose={() => { setShowRandomizeModal(false); setShowOptions(false); setOptions([]); }}
        title="Randomize Recipe"
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Health Rating
              </label>
              <select
                value={healthRating}
                onChange={(e) => setHealthRating(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg bg-white text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Any health rating</option>
                {HEALTH_RATINGS.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Cuisine Type
              </label>
              <select
                value={cuisineType}
                onChange={(e) => setCuisineType(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg bg-white text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Any cuisine</option>
                {CUISINE_TYPES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Exclude Ingredients
              <span className="font-normal text-neutral-500 ml-1">(comma separated)</span>
            </label>
            <input
              type="text"
              value={excludeIngredients}
              onChange={(e) => setExcludeIngredients(e.target.value)}
              placeholder="e.g. nuts, dairy, gluten"
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Number of Options
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={optionCount}
              onChange={(e) => setOptionCount(parseInt(e.target.value) || 1)}
              className="w-32 px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <Button onClick={handleRandomize} disabled={isRandomizing} fullWidth>
            {isRandomizing ? 'Generating...' : 'Generate Options'}
          </Button>

          {showOptions && options.length > 0 && (
            <div className="border-t border-neutral-200 pt-4">
              <p className="text-sm font-medium text-neutral-700 mb-3">Pick a recipe:</p>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {options.map((recipe) => (
                  <button
                    key={recipe.id}
                    onClick={() => handleSelectOption(recipe)}
                    className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-primary-50 rounded-lg border border-neutral-200 hover:border-primary-300 transition-colors cursor-pointer"
                  >
                    <div className="font-medium text-sm text-neutral-900">{recipe.title}</div>
                    {recipe.description && (
                      <div className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{recipe.description}</div>
                    )}
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      {recipe.cuisineType && (
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">{recipe.cuisineType}</span>
                      )}
                      {recipe.healthRating && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">{recipe.healthRating}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showOptions && options.length === 0 && (
            <div className="border-t border-neutral-200 pt-4">
              <p className="text-sm text-neutral-500 text-center py-6 bg-neutral-50 rounded-lg">
                No recipes found matching your criteria. Try adjusting the filters.
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Recipe Detail Modal */}
      <RecipeDetail
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        recipe={fullRecipe ?? null}
        currentUserId={user?.id}
        onEdit={fullRecipe?.userId === user?.id ? () => { setShowDetailModal(false); setShowEditModal(true); } : undefined}
      />

      {/* Edit Recipe Form Modal */}
      <RecipeForm
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={async (data) => {
          if (fullRecipe) {
            await updateRecipeMutation.mutateAsync({ id: fullRecipe.id, data });
            setShowEditModal(false);
          }
        }}
        userId={user?.id}
        recipe={fullRecipe}
      />

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
