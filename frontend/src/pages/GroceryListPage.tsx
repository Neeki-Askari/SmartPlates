import { useState } from 'react';
import { Container } from '../components/layout/Container';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { ShoppingListView } from '../components/features/mealplans/ShoppingListView';
import { useUserShoppingLists, useSavedShoppingList, useDeleteShoppingList } from '../hooks/useShoppingLists.query';
import { useUser } from '../contexts/UserContext';

export const GroceryListPage = () => {
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const { user } = useUser();
  const userId = user?.id ?? '';

  const { data: savedLists, isLoading: listsLoading } = useUserShoppingLists(userId);
  const { data: selectedList, isLoading: listLoading } = useSavedShoppingList(selectedListId);
  const deleteShoppingListMutation = useDeleteShoppingList();

  const handleSelectList = (id: string) => {
    setSelectedListId(id);
  };

  const handleDeleteList = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shopping list?')) return;

    try {
      await deleteShoppingListMutation.mutateAsync(id);
      if (selectedListId === id) {
        setSelectedListId(null);
      }
    } catch (error) {
      console.error('Error deleting shopping list:', error);
    }
  };

  // Show selected shopping list
  if (selectedListId && selectedList) {
    return (
      <Container>
        <div className="mb-6">
          <Button variant="secondary" onClick={() => setSelectedListId(null)}>
            ← Back to All Lists
          </Button>
        </div>

        <ShoppingListView
          shoppingList={selectedList}
          onClose={() => setSelectedListId(null)}
        />
      </Container>
    );
  }

  // Show loading state
  if (listLoading) {
    return (
      <Container>
        <div className="text-center py-12">
          <p className="text-neutral-600">Loading shopping list...</p>
        </div>
      </Container>
    );
  }

  // Default view - list all saved shopping lists
  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Grocery Lists</h1>
        <p className="text-neutral-600">View and manage your saved shopping lists</p>
      </div>

      {listsLoading ? (
        <div className="text-center py-12">
          <p className="text-neutral-600">Loading shopping lists...</p>
        </div>
      ) : savedLists && savedLists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedLists.map((list) => (
            <Card key={list.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1" onClick={() => handleSelectList(list.id)}>
                    <CardTitle className="text-lg mb-1 cursor-pointer hover:text-primary-600">
                      {list.mealPlanName}
                    </CardTitle>
                    <p className="text-sm text-neutral-500">
                      {new Date(list.startDate).toLocaleDateString()} - {new Date(list.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteList(list.id);
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </CardHeader>
              <CardContent onClick={() => handleSelectList(list.id)} className="cursor-pointer">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Items:</span>
                    <span className="font-medium">{list.itemCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Total Cost:</span>
                    <span className="font-medium">${list.totalEstimatedCost.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-neutral-200">
                    <p className="text-neutral-500 text-xs">
                      Saved: {new Date(list.createdAt).toLocaleDateString()}
                    </p>
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Saved Shopping Lists</h3>
            <p className="text-neutral-600 mb-4">
              Generate and save a shopping list from a meal plan to see it here.
            </p>
          </div>
        </div>
      )}
    </Container>
  );
};
