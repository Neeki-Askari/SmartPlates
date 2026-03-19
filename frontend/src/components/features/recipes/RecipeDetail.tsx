import { Modal, Button } from '../../ui';
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

  const isOwner = recipe.userId === currentUserId;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={recipe.title} size="xl">
      <div className="space-y-6">

        {/* Tags row */}
        <div className="flex flex-wrap gap-2">
          {recipe.cuisineType && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
              {recipe.cuisineType}
            </span>
          )}
          {recipe.healthRating && (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
              {recipe.healthRating}
            </span>
          )}
          <span className="px-3 py-1 bg-neutral-100 text-neutral-600 text-sm rounded-full">
            {recipe.originalServings} servings
          </span>
          {!recipe.isPublic && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
              Private
            </span>
          )}
          {isOwner && recipe.lastCookedDate && (
            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">
              Last cooked {new Date(recipe.lastCookedDate).toLocaleDateString()}
            </span>
          )}
          {recipe.recipeLink && (
            <a
              href={recipe.recipeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full hover:bg-primary-200 transition-colors"
            >
              🔗 Source
            </a>
          )}
        </div>

        {/* Description */}
        {recipe.description && (
          <p className="text-neutral-600 text-base leading-relaxed border-l-4 border-primary-200 pl-4">
            {recipe.description}
          </p>
        )}

        {/* Two-column layout: ingredients + stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Ingredients — takes 2 cols */}
          <div className="md:col-span-2">
            <h3 className="text-base font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              🧂 Ingredients
            </h3>
            <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-lg overflow-hidden">
              {recipe.ingredients.map((ing, index) => (
                <div
                  key={ing.id}
                  className={`flex justify-between items-center px-4 py-2.5 ${index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}
                >
                  <span className="text-neutral-800 text-sm">
                    <span className="text-neutral-400 mr-2 text-xs">{index + 1}.</span>
                    {ing.name}
                  </span>
                  <div className="flex items-center gap-3 text-sm text-neutral-500 shrink-0 ml-4">
                    {ing.quantity && ing.unit && (
                      <span className="font-medium text-neutral-700">{ing.quantity} {ing.unit}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats sidebar */}
          <div>
            <h3 className="text-base font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              📊 Details
            </h3>
            <div className="border border-neutral-200 rounded-lg overflow-hidden divide-y divide-neutral-100">
              <div className="px-4 py-3 bg-white">
                <p className="text-xs text-neutral-500 mb-0.5">Servings</p>
                <p className="font-semibold text-neutral-900">{recipe.originalServings}</p>
              </div>
              {recipe.proportionFactor !== 1.0 && (
                <div className="px-4 py-3 bg-neutral-50">
                  <p className="text-xs text-neutral-500 mb-0.5">Portion Factor</p>
                  <p className="font-semibold text-neutral-900">{recipe.proportionFactor}x</p>
                </div>
              )}
              <div className="px-4 py-3 bg-white">
                <p className="text-xs text-neutral-500 mb-0.5">Added</p>
                <p className="font-semibold text-neutral-700 text-sm">
                  {new Date(recipe.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        {recipe.instructions && (
          <div>
            <h3 className="text-base font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              📋 Instructions
            </h3>
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 whitespace-pre-line text-neutral-700 text-sm leading-relaxed">
              {recipe.instructions}
            </div>
          </div>
        )}

        {/* Notes */}
        {recipe.comments && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-yellow-900 mb-1">📝 Notes</h4>
            <p className="text-sm text-yellow-800">{recipe.comments}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
          <div>
            {recipe.isPublic && !isOwner && onCopy && (
              <Button variant="outline" onClick={() => onCopy(recipe.id)}>
                Copy to my recipes
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            {isOwner && onDelete && (
              <Button variant="danger" onClick={onDelete}>
                Delete
              </Button>
            )}
            {isOwner && onEdit && (
              <Button onClick={onEdit}>
                Edit Recipe
              </Button>
            )}
          </div>
        </div>

      </div>
    </Modal>
  );
};
