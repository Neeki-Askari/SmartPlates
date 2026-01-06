import { useState } from 'react';
import { Container } from '../components/layout/Container';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { MealPlanForm } from '../components/features/mealplans/MealPlanForm';
import { MealPlanWeekView } from '../components/features/mealplans/MealPlanWeekView';
import { ShoppingListView } from '../components/features/mealplans/ShoppingListView';
import { useCreateMealPlan, useMealPlan, useShoppingList } from '../hooks/useMealPlans.query';
import { DEMO_USER_ID } from '../constants';
import type { CreateMealPlanDto } from '../types';

export const MealPlansPage = () => {
  const [currentMealPlanId, setCurrentMealPlanId] = useState<string | null>(null);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // TODO: Replace with actual user ID from auth context
  const userId = DEMO_USER_ID;

  // React Query hooks
  const createMealPlanMutation = useCreateMealPlan();
  const { data: mealPlan, isLoading: mealPlanLoading } = useMealPlan(currentMealPlanId);
  const { data: shoppingList, isLoading: shoppingListLoading } = useShoppingList(
    showShoppingList ? currentMealPlanId : null
  );

  const handleCreateMealPlan = async (data: CreateMealPlanDto) => {
    try {
      const newMealPlan = await createMealPlanMutation.mutateAsync(data);
      setCurrentMealPlanId(newMealPlan.id);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating meal plan:', error);
    }
  };

  const handleViewShoppingList = () => {
    setShowShoppingList(true);
  };

  const handleNewMealPlan = () => {
    setCurrentMealPlanId(null);
    setShowShoppingList(false);
    setShowForm(true);
  };

  // Show meal plan week view if one is selected
  if (currentMealPlanId && mealPlan && !showShoppingList) {
    return (
      <Container maxWidth="full">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Meal Plan</h1>
            <p className="text-neutral-600">
              Plan your meals for the week and randomize options
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleNewMealPlan}>
              New Meal Plan
            </Button>
            <Button onClick={handleViewShoppingList}>
              Generate Shopping List
            </Button>
          </div>
        </div>

        <MealPlanWeekView mealPlan={mealPlan} />
      </Container>
    );
  }

  // Show shopping list if requested
  if (showShoppingList && currentMealPlanId) {
    if (shoppingListLoading) {
      return (
        <Container>
          <div className="text-center py-12">
            <p className="text-neutral-600">Generating shopping list...</p>
          </div>
        </Container>
      );
    }

    if (!shoppingList) {
      return (
        <Container>
          <div className="text-center py-12">
            <p className="text-red-600">Error generating shopping list</p>
            <Button onClick={() => setShowShoppingList(false)} className="mt-4">
              Back to Meal Plan
            </Button>
          </div>
        </Container>
      );
    }

    return (
      <Container>
        <ShoppingListView
          shoppingList={shoppingList}
          onClose={() => setShowShoppingList(false)}
        />
      </Container>
    );
  }

  // Show form if user clicked create
  if (showForm) {
    return (
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Meal Planning</h1>
          <p className="text-neutral-600">
            Create a weekly meal plan and generate shopping lists
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <MealPlanForm
            userId={userId}
            onSubmit={handleCreateMealPlan}
            onCancel={() => setShowForm(false)}
          />
        </div>

        {createMealPlanMutation.isPending && (
          <div className="mt-4 text-center">
            <p className="text-neutral-600">Creating meal plan...</p>
          </div>
        )}

        {createMealPlanMutation.isError && (
          <div className="mt-4">
            <Card>
              <CardContent className="p-4 bg-red-50">
                <p className="text-red-600">
                  Error creating meal plan. Please try again.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </Container>
    );
  }

  // Show loading state
  if (mealPlanLoading) {
    return (
      <Container>
        <div className="text-center py-12">
          <p className="text-neutral-600">Loading meal plan...</p>
        </div>
      </Container>
    );
  }

  // Default view - empty state
  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Weekly Meal Plans</h1>
        <p className="text-neutral-600">Plan your meals for the week and randomize based on preferences</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-neutral-600">Select or create a meal plan to get started</p>
        </div>
        <Button onClick={() => setShowForm(true)}>+ Create New Meal Plan</Button>
      </div>

      <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-neutral-300">
        <div className="max-w-md mx-auto">
          <svg
            className="w-16 h-16 text-neutral-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Meal Plans Yet</h3>
          <p className="text-neutral-600 mb-4">
            Create your first meal plan to organize your weekly meals.
          </p>
          <Button onClick={() => setShowForm(true)}>+ Create Meal Plan</Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              <li className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-600 font-semibold text-sm mr-3 flex-shrink-0">
                  1
                </span>
                <span className="text-neutral-700">Create a meal plan and set the number of people you're cooking for</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-600 font-semibold text-sm mr-3 flex-shrink-0">
                  2
                </span>
                <span className="text-neutral-700">Select which meals you want to plan (breakfast, lunch, dinner, snacks)</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-600 font-semibold text-sm mr-3 flex-shrink-0">
                  3
                </span>
                <span className="text-neutral-700">Manually assign recipes or use randomization with cuisine and health filters</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-600 font-semibold text-sm mr-3 flex-shrink-0">
                  4
                </span>
                <span className="text-neutral-700">Generate a shopping list with all ingredients, costs, and calories</span>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-neutral-700">Randomize recipes based on cuisine and health ratings</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-neutral-700">Exclude recipes with specific ingredients (allergies, preferences)</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-neutral-700">Automatic portion sizing based on number of people</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-neutral-700">Track which meals you've cooked and when</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};
