import { Modal, Button, Card, CardHeader, CardTitle, CardContent } from '../../ui';
import type { RecipeWithIngredients } from '../../../types';

interface RecipeDetailProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: RecipeWithIngredients | null;
  onEdit?: () => void;
  onDelete?: () => void;
  currentUserId?: string;
  onCopy?: (id: string) => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({
  isOpen,
  onClose,
  recipe,
  onEdit,
  onDelete,
  currentUserId,
  onCopy,
}) => {
  if (!recipe) return null;

  const totalCost = recipe.ingredients.reduce(
    (sum, ing) => sum + (ing.costPerUnit && ing.quantity ? ing.costPerUnit * ing.quantity : 0),
    0
  );

  const totalCalories = recipe.ingredients.reduce(
    (sum, ing) => sum + (ing.caloriesPerUnit && ing.quantity ? ing.caloriesPerUnit * ing.quantity : 0),
    0
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={recipe.title} size="xl">
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex flex-wrap gap-2">
          {recipe.cuisineType && (
            <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
              {recipe.cuisineType}
            </span>
          )}
          {recipe.healthRating && (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
              {recipe.healthRating}
            </span>
          )}
          {!recipe.isPublic && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
              Private
            </span>
          )}
          <span className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-full">
            Serves {recipe.originalServings}
          </span>
        </div>

        {/* Description */}
        {recipe.description && (
          <div>
            <h4 className="text-sm font-semibold text-neutral-700 mb-2">Description</h4>
            <p className="text-neutral-600">{recipe.description}</p>
          </div>
        )}

        {/* Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recipe.ingredients.map((ing, index) => (
                <div
                  key={ing.id}
                  className="flex justify-between items-center py-2 border-b border-neutral-100 last:border-0"
                >
                  <span className="text-neutral-900">
                    {index + 1}. {ing.name}
                  </span>
                  <div className="flex items-center gap-4 text-sm text-neutral-600">
                    {ing.quantity && ing.unit && (
                      <span>
                        {ing.quantity} {ing.unit}
                      </span>
                    )}
                    {ing.costPerUnit && <span>${ing.costPerUnit.toFixed(2)}</span>}
                    {ing.caloriesPerUnit && <span>{ing.caloriesPerUnit} cal</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <div className="flex justify-between text-sm font-semibold">
                <span>Total:</span>
                <div className="flex gap-4">
                  {totalCost > 0 && <span>${totalCost.toFixed(2)}</span>}
                  {totalCalories > 0 && <span>{Math.round(totalCalories)} calories</span>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        {recipe.instructions && (
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-neutral-700">{recipe.instructions}</div>
            </CardContent>
          </Card>
        )}

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {recipe.recipeLink && (
            <div>
              <span className="font-semibold text-neutral-700">Recipe Link:</span>
              <a
                href={recipe.recipeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-primary-600 hover:underline"
              >
                View Recipe
              </a>
            </div>
          )}

          {recipe.userId === currentUserId && recipe.lastCookedDate && (
            <div>
              <span className="font-semibold text-neutral-700">Last Cooked:</span>
              <span className="ml-2 text-neutral-600">
                {new Date(recipe.lastCookedDate).toLocaleDateString()}
              </span>
            </div>
          )}

          {recipe.proportionFactor !== 1.0 && (
            <div>
              <span className="font-semibold text-neutral-700">Proportion Factor:</span>
              <span className="ml-2 text-neutral-600">{recipe.proportionFactor}x</span>
            </div>
          )}
        </div>

        {/* Comments */}
        {recipe.comments && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-yellow-900 mb-1">Notes</h4>
            <p className="text-sm text-yellow-800">{recipe.comments}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
          {recipe.isPublic && recipe.userId !== currentUserId && onCopy && (
            <Button variant="outline" onClick={() => onCopy(recipe.id)}>
              Copy to my recipes
            </Button>
          )}
          {recipe.userId === currentUserId && onDelete && (
            <Button variant="danger" onClick={onDelete}>
              Delete Recipe
            </Button>
          )}
          {recipe.userId === currentUserId && onEdit && (
            <Button onClick={onEdit}>
              Edit Recipe
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
