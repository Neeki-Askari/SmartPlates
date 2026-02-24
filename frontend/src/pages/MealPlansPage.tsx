import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { MealPlanForm } from '../components/features/mealplans/MealPlanForm';
import { MealPlanWeekView } from '../components/features/mealplans/MealPlanWeekView';
import { ShoppingListView } from '../components/features/mealplans/ShoppingListView';
import { MealPlanEditModal } from '../components/features/mealplans/MealPlanEditModal';
import { MealPlanDuplicateModal } from '../components/features/mealplans/MealPlanDuplicateModal';
import { useCreateMealPlan, useMealPlan, useUserMealPlans, useUpdateMealPlan, useDuplicateMealPlan, useDeleteMealPlan, useShoppingList } from '../hooks/useMealPlans.query';
import { useUser } from '../contexts/UserContext';
import type { CreateMealPlanDto, UpdateMealPlanDto, DuplicateMealPlanDto } from '../types';

export const MealPlansPage = () => {
  const location = useLocation();
  const [currentMealPlanId, setCurrentMealPlanId] = useState<string | null>(null);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEditMealPlan, setShowEditMealPlan] = useState(false);
  const [showDuplicateMealPlan, setShowDuplicateMealPlan] = useState(false);

  const { user } = useUser();
  const userId = user?.id ?? '';

  // Reset to meal plans list when navigating to /mealplans
  useEffect(() => {
    if (location.pathname === '/mealplans') {
      setCurrentMealPlanId(null);
      setShowShoppingList(false);
      setShowForm(false);
      setShowEditMealPlan(false);
      setShowDuplicateMealPlan(false);
    }
  }, [location.pathname]);

  // React Query hooks
  const createMealPlanMutation = useCreateMealPlan();
  const updateMealPlanMutation = useUpdateMealPlan();
  const duplicateMealPlanMutation = useDuplicateMealPlan();
  const deleteMealPlanMutation = useDeleteMealPlan();
  const { data: mealPlan, isLoading: mealPlanLoading } = useMealPlan(currentMealPlanId);
  const { data: userMealPlans, isLoading: mealPlansListLoading } = useUserMealPlans(userId);
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

  const handleSelectMealPlan = (id: string) => {
    setCurrentMealPlanId(id);
    setShowShoppingList(false);
    setShowForm(false);
  };

  const handleDeleteMealPlan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this meal plan?')) return;

    try {
      await deleteMealPlanMutation.mutateAsync(id);
      if (currentMealPlanId === id) {
        setCurrentMealPlanId(null);
      }
    } catch (error) {
      console.error('Error deleting meal plan:', error);
    }
  };

  const handleUpdateMealPlan = async (data: UpdateMealPlanDto) => {
    if (!currentMealPlanId) return;

    try {
      await updateMealPlanMutation.mutateAsync({ id: currentMealPlanId, data });
      setShowEditMealPlan(false);
    } catch (error) {
      console.error('Error updating meal plan:', error);
    }
  };

  const handleDuplicateMealPlan = async (data: DuplicateMealPlanDto) => {
    try {
      const duplicatedMealPlan = await duplicateMealPlanMutation.mutateAsync(data);
      setShowDuplicateMealPlan(false);
      setCurrentMealPlanId(duplicatedMealPlan.id);
    } catch (error) {
      console.error('Error duplicating meal plan:', error);
    }
  };

  // Show meal plan week view if one is selected
  if (currentMealPlanId && mealPlan && !showShoppingList) {
    return (
      <Container maxWidth="full">
        {/* Meal Plan Info Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">{mealPlan.name}</h2>
                <div className="flex gap-6 text-sm text-neutral-600">
                  <div>
                    <span className="font-medium">Date Range:</span>{' '}
                    {new Date(mealPlan.startDate).toLocaleDateString()} -{' '}
                    {new Date(mealPlan.endDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Serving Size:</span> {mealPlan.servingSize} people
                  </div>
                  <div>
                    <span className="font-medium">Recipes:</span> {mealPlan.mealPlanRecipes?.length || 0}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setShowDuplicateMealPlan(true)}>
                  Duplicate
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setShowEditMealPlan(true)}>
                  Edit Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mb-6 flex justify-between items-center">
          <Button variant="secondary" onClick={() => setCurrentMealPlanId(null)}>
            ← Back to Meal Plans
          </Button>
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

        {/* Edit Meal Plan Modal */}
        <MealPlanEditModal
          isOpen={showEditMealPlan}
          onClose={() => setShowEditMealPlan(false)}
          onSubmit={handleUpdateMealPlan}
          mealPlan={mealPlan}
          isLoading={updateMealPlanMutation.isPending}
        />

        {/* Duplicate Meal Plan Modal */}
        <MealPlanDuplicateModal
          isOpen={showDuplicateMealPlan}
          onClose={() => setShowDuplicateMealPlan(false)}
          onSubmit={handleDuplicateMealPlan}
          sourceMealPlan={mealPlan}
          isLoading={duplicateMealPlanMutation.isPending}
        />
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

  // Default view - list saved meal plans or empty state
  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Weekly Meal Plans</h1>
        <p className="text-neutral-600">Plan your meals for the week and randomize based on preferences</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-neutral-600">
            {userMealPlans && userMealPlans.length > 0
              ? `You have ${userMealPlans.length} saved meal plan${userMealPlans.length > 1 ? 's' : ''}`
              : 'Select or create a meal plan to get started'}
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>+ Create New Meal Plan</Button>
      </div>

      {mealPlansListLoading ? (
        <div className="text-center py-12">
          <p className="text-neutral-600">Loading meal plans...</p>
        </div>
      ) : userMealPlans && userMealPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {userMealPlans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1" onClick={() => handleSelectMealPlan(plan.id)}>
                    <CardTitle className="text-lg mb-1">{plan.name}</CardTitle>
                    <p className="text-sm text-neutral-500">
                      {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMealPlan(plan.id);
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </CardHeader>
              <CardContent onClick={() => handleSelectMealPlan(plan.id)}>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Serving Size:</span>
                    <span className="font-medium">{plan.servingSize} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Recipes:</span>
                    <span className="font-medium">{plan.recipeCount}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-neutral-600 mb-1">Meals included:</p>
                    <div className="flex flex-wrap gap-1">
                      {plan.includesBreakfast && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">Breakfast</span>
                      )}
                      {plan.includesLunch && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">Lunch</span>
                      )}
                      {plan.includesDinner && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">Dinner</span>
                      )}
                      {(plan.includesSnack1 || plan.includesSnack2 || plan.includesSnack3) && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Snacks</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
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
      )}

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
