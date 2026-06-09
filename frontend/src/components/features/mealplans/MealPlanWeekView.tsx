import { MealSlot } from './MealSlot';
import { Button, Card, CardContent } from '../../ui';
import type { MealPlanRecipe, MealPlanWithRecipes, MealType, Recipe } from '../../../types';
import { MealTypeLabels, DAYS_OF_WEEK } from '../../../types';
import {
  useAddRecipeToMealPlan,
  useRandomizeRecipe,
  useRemoveRecipeFromMealPlan,
} from '../../../hooks/useMealPlans.query';

interface MealPlanWeekViewProps {
  mealPlan: MealPlanWithRecipes;
  onEdit?: () => void;
  onDuplicate?: () => void;
}

export const MealPlanWeekView = ({ mealPlan, onEdit, onDuplicate }: MealPlanWeekViewProps) => {
  const addRecipeMutation = useAddRecipeToMealPlan();
  const randomizeMutation = useRandomizeRecipe();
  const removeRecipeMutation = useRemoveRecipeFromMealPlan();

  // Determine which meal types are active
  const activeMealTypes: MealType[] = [];
  if (mealPlan.includesBreakfast) activeMealTypes.push(0); // Breakfast
  if (mealPlan.includesSnack1) activeMealTypes.push(1); // Snack1
  if (mealPlan.includesLunch) activeMealTypes.push(2); // Lunch
  if (mealPlan.includesSnack2) activeMealTypes.push(3); // Snack2
  if (mealPlan.includesDinner) activeMealTypes.push(4); // Dinner
  if (mealPlan.includesSnack3) activeMealTypes.push(5); // Snack3

  // Get all recipes assigned to a specific day and meal type
  const getRecipesForSlot = (dayOfWeek: number, mealType: MealType): MealPlanRecipe[] => {
    return (
      mealPlan.mealPlanRecipes?.filter(
        (mpr) => mpr.dayOfWeek === dayOfWeek && mpr.mealType === mealType
      ) ?? []
    );
  };

  // Handle removing a single recipe entry from a slot
  const handleRemoveRecipe = async (mealPlanRecipeId: string) => {
    await removeRecipeMutation.mutateAsync({
      mealPlanId: mealPlan.id,
      mealPlanRecipeId,
    });
  };

  // Handle randomize
  const handleRandomize = async (
    dayOfWeek: number,
    mealType: MealType,
    healthRating?: string,
    cuisineType?: string,
    excludeIngredients?: string[],
    optionCount?: number
  ): Promise<Recipe[]> => {
    const result = await randomizeMutation.mutateAsync({
      mealPlanId: mealPlan.id,
      dayOfWeek,
      mealType,
      healthRatingConstraint: healthRating,
      cuisineTypeConstraint: cuisineType,
      excludeIngredients,
      optionCount,
    });
    return result;
  };

  // Handle select recipe
  const handleSelectRecipe = async (
    dayOfWeek: number,
    mealType: MealType,
    recipe: Recipe
  ) => {
    await addRecipeMutation.mutateAsync({
      mealPlanId: mealPlan.id,
      recipeId: recipe.id,
      dayOfWeek,
      mealType,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">{mealPlan.name}</h2>
              <p className="text-sm text-neutral-600 mt-1">
                {new Date(mealPlan.startDate).toLocaleDateString()} -{' '}
                {new Date(mealPlan.endDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-neutral-600">Serving Size</p>
                <p className="text-2xl font-bold text-primary-600">{mealPlan.servingSize}</p>
              </div>
              {(onDuplicate || onEdit) && (
                <div className="flex gap-2">
                  {onDuplicate && (
                    <Button variant="secondary" size="sm" onClick={onDuplicate}>
                      Duplicate
                    </Button>
                  )}
                  {onEdit && (
                    <Button variant="secondary" size="sm" onClick={onEdit}>
                      Edit Details
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Week Grid */}
      <div className="space-y-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="font-semibold text-neutral-900 text-sm text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Meal Rows */}
        {activeMealTypes.map((mealType) => (
          <div key={mealType}>
            {/* Meal Type Label above the row */}
            <div className="mb-1">
              <span className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                {MealTypeLabels[mealType]}
              </span>
            </div>

            {/* Day Slots */}
            <div className="grid grid-cols-7 gap-2 items-start">
              {[0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => (
                <div key={`${dayOfWeek}-${mealType}`} className="min-w-0">
                  <MealSlot
                    dayOfWeek={dayOfWeek}
                    mealType={mealType}
                    mealPlanId={mealPlan.id}
                    recipes={getRecipesForSlot(dayOfWeek, mealType)}
                    onRandomize={(health, cuisine, exclude, count) =>
                      handleRandomize(dayOfWeek, mealType, health, cuisine, exclude, count)
                    }
                    onSelectRecipe={(recipe) =>
                      handleSelectRecipe(dayOfWeek, mealType, recipe)
                    }
                    onRemoveRecipe={handleRemoveRecipe}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
