import { MealSlot } from './MealSlot';
import { Card, CardContent } from '../../ui';
import type { MealPlanWithRecipes, MealType, Recipe } from '../../../types';
import { MealTypeLabels, DAYS_OF_WEEK } from '../../../types';
import { useAddRecipeToMealPlan, useRandomizeRecipe } from '../../../hooks/useMealPlans.query';

interface MealPlanWeekViewProps {
  mealPlan: MealPlanWithRecipes;
}

export const MealPlanWeekView = ({ mealPlan }: MealPlanWeekViewProps) => {
  const addRecipeMutation = useAddRecipeToMealPlan();
  const randomizeMutation = useRandomizeRecipe();

  // Determine which meal types are active
  const activeMealTypes: MealType[] = [];
  if (mealPlan.includesBreakfast) activeMealTypes.push(0); // Breakfast
  if (mealPlan.includesSnack1) activeMealTypes.push(1); // Snack1
  if (mealPlan.includesLunch) activeMealTypes.push(2); // Lunch
  if (mealPlan.includesSnack2) activeMealTypes.push(3); // Snack2
  if (mealPlan.includesDinner) activeMealTypes.push(4); // Dinner
  if (mealPlan.includesSnack3) activeMealTypes.push(5); // Snack3

  // Get recipe for a specific day and meal type
  const getRecipeForSlot = (dayOfWeek: number, mealType: MealType): Recipe | undefined => {
    const mealPlanRecipe = mealPlan.mealPlanRecipes?.find(
      (mpr) => mpr.dayOfWeek === dayOfWeek && mpr.mealType === mealType
    );
    return mealPlanRecipe?.recipe;
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
            <div className="text-right">
              <p className="text-sm text-neutral-600">Serving Size</p>
              <p className="text-2xl font-bold text-primary-600">{mealPlan.servingSize}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Week Grid */}
      <div className="space-y-6">
        {/* Day Headers */}
        <div className="grid grid-cols-8 gap-4">
          <div className="font-medium text-neutral-700 text-base"></div>
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="font-semibold text-neutral-900 text-base text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Meal Rows */}
        {activeMealTypes.map((mealType) => (
          <div key={mealType}>
            <div className="grid grid-cols-8 gap-4 items-start">
              {/* Meal Type Label */}
              <div className="flex items-start justify-end pr-4 pt-4">
                <span className="text-base font-semibold text-neutral-900">
                  {MealTypeLabels[mealType]}
                </span>
              </div>

              {/* Day Slots */}
              {[0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => (
                <div key={`${dayOfWeek}-${mealType}`} className="min-w-0">
                  <MealSlot
                    dayOfWeek={dayOfWeek}
                    mealType={mealType}
                    mealPlanId={mealPlan.id}
                    currentRecipe={getRecipeForSlot(dayOfWeek, mealType)}
                    onRandomize={(health, cuisine, exclude, count) =>
                      handleRandomize(dayOfWeek, mealType, health, cuisine, exclude, count)
                    }
                    onSelectRecipe={(recipe) =>
                      handleSelectRecipe(dayOfWeek, mealType, recipe)
                    }
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
