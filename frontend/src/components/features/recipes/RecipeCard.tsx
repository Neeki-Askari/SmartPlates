import { Card, CardHeader, CardTitle, CardContent } from '../../ui';
import type { Recipe, RecipeWithIngredients } from '../../../types';

interface RecipeCardProps {
  recipe: Recipe | RecipeWithIngredients;
  onClick?: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  const isRecipeWithIngredients = (r: Recipe | RecipeWithIngredients): r is RecipeWithIngredients => {
    return 'ingredients' in r;
  };

  const ingredientCount = isRecipeWithIngredients(recipe) ? recipe.ingredients.length : 0;

  return (
    <Card hover onClick={onClick}>
      <CardHeader>
        <CardTitle className="truncate">{recipe.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-neutral-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {recipe.description || 'No description provided'}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.cuisineType && (
            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
              {recipe.cuisineType}
            </span>
          )}
          {recipe.healthRating && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
              {recipe.healthRating}
            </span>
          )}
          {ingredientCount > 0 && (
            <span className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded">
              {ingredientCount} ingredients
            </span>
          )}
        </div>

        <div className="flex justify-between items-center text-sm text-neutral-500">
          <span>Serves: {recipe.originalServings}</span>
          {recipe.lastCookedDate ? (
            <span className="text-xs">
              Cooked: {new Date(recipe.lastCookedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          ) : (
            <span className="text-xs text-neutral-400">Never cooked</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
