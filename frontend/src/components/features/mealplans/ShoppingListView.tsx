import { Card, CardContent, Button } from '../../ui';
import { useSaveShoppingList } from '../../../hooks/useShoppingLists.query';
import type { ShoppingList } from '../../../types';

interface ShoppingListViewProps {
  shoppingList: ShoppingList;
  onClose?: () => void;
  onSave?: () => void;
}

export const ShoppingListView = ({ shoppingList, onClose, onSave }: ShoppingListViewProps) => {
  const saveShoppingListMutation = useSaveShoppingList();

  const handleSave = async () => {
    try {
      await saveShoppingListMutation.mutateAsync(shoppingList);
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Error saving shopping list:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['Ingredient', 'Quantity', 'Unit', 'Est. Cost', 'Calories'];
    const rows = shoppingList.items.map((item) => [
      item.ingredientName,
      item.totalQuantity.toString(),
      item.unit || '',
      item.estimatedCost ? `$${item.estimatedCost.toFixed(2)}` : '',
      item.totalCalories?.toString() || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
      '',
      `Total Cost,,,${shoppingList.totalEstimatedCost.toFixed(2)}`,
      `Total Calories,,,,${shoppingList.totalCalories}`,
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopping-list-${shoppingList.mealPlanName}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">Shopping List</h2>
              <p className="text-sm text-neutral-600 mt-1">{shoppingList.mealPlanName}</p>
              <p className="text-sm text-neutral-600">
                Serving size: {shoppingList.servingSize} people
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saveShoppingListMutation.isPending}
              >
                {saveShoppingListMutation.isPending ? 'Saving...' : 'Save List'}
              </Button>
              <Button variant="secondary" size="sm" onClick={handlePrint}>
                Print
              </Button>
              <Button variant="secondary" size="sm" onClick={handleExport}>
                Export CSV
              </Button>
              {onClose && (
                <Button variant="secondary" size="sm" onClick={onClose}>
                  Close
                </Button>
              )}
            </div>
          </div>

          {/* Success message */}
          {saveShoppingListMutation.isSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                Shopping list saved successfully!
              </p>
            </div>
          )}

          {/* Error message */}
          {saveShoppingListMutation.isError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                Error saving shopping list. Please try again.
              </p>
            </div>
          )}

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">
                    Ingredient
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">
                    Quantity
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">
                    Unit
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">
                    Est. Cost
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">
                    Calories
                  </th>
                </tr>
              </thead>
              <tbody>
                {shoppingList.items.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-neutral-100 hover:bg-neutral-50"
                  >
                    <td className="py-3 px-4 text-sm text-neutral-900">
                      {item.ingredientName}
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-900 text-right">
                      {item.totalQuantity}
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-600">
                      {item.unit || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-900 text-right">
                      {item.estimatedCost ? `$${item.estimatedCost.toFixed(2)}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-900 text-right">
                      {item.totalCalories || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-neutral-300 font-semibold">
                  <td className="py-3 px-4 text-sm text-neutral-900" colSpan={3}>
                    Total
                  </td>
                  <td className="py-3 px-4 text-sm text-neutral-900 text-right">
                    ${shoppingList.totalEstimatedCost.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm text-neutral-900 text-right">
                    {shoppingList.totalCalories}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-neutral-600">Total Ingredients</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {shoppingList.items.length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-neutral-600">Avg. Cost per Person</p>
                <p className="text-2xl font-bold text-neutral-900">
                  ${(shoppingList.totalEstimatedCost / shoppingList.servingSize).toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Print Styles */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-area, .print-area * {
              visibility: visible;
            }
            .print-area {
              position: absolute;
              left: 0;
              top: 0;
            }
          }
        `}
      </style>
    </div>
  );
};
