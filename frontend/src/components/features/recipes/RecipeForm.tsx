import { useState } from 'react';
import { Button, Input, TextArea, Select, Modal, ModalFooter } from '../../ui';
import { CUISINE_TYPES, HEALTH_RATINGS, type CreateRecipeDto, type UpdateRecipeDto, type IngredientInput, type RecipeWithIngredients } from '../../../types';

interface RecipeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRecipeDto | UpdateRecipeDto) => Promise<void>;
  userId?: string;
  recipe?: RecipeWithIngredients | null;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userId,
  recipe,
}) => {
  const [title, setTitle] = useState(recipe?.title || '');
  const [description, setDescription] = useState(recipe?.description || '');
  const [instructions, setInstructions] = useState(recipe?.instructions || '');
  const [cuisineType, setCuisineType] = useState(recipe?.cuisineType || '');
  const [healthRating, setHealthRating] = useState(recipe?.healthRating || '');
  const [comments, setComments] = useState(recipe?.comments || '');
  const [recipeLink, setRecipeLink] = useState(recipe?.recipeLink || '');
  const [originalServings, setOriginalServings] = useState(recipe?.originalServings || 4);
  const [proportionFactor, setProportionFactor] = useState(recipe?.proportionFactor || 1.0);
  const [isPublic, setIsPublic] = useState(recipe?.isPublic ?? true);
  const [ingredients, setIngredients] = useState<IngredientInput[]>(
    recipe?.ingredients?.length
      ? recipe.ingredients.map(i => ({
          name: i.name,
          quantity: i.quantity ?? undefined,
          unit: i.unit ?? '',
          costPerUnit: i.costPerUnit ?? undefined,
          caloriesPerUnit: i.caloriesPerUnit ?? undefined,
          sizeBought: i.sizeBought ?? undefined,
          proportionFactor: i.proportionFactor,
        }))
      : [{ name: '', quantity: undefined, unit: '', proportionFactor: 1.0 }]
  );
  const [loading, setLoading] = useState(false);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: undefined, unit: '', proportionFactor: 1.0 }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, field: keyof IngredientInput, value: any) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        userId: userId ?? '',
        title,
        description,
        instructions,
        cuisineType,
        healthRating,
        comments,
        recipeLink,
        originalServings,
        proportionFactor,
        isPublic,
        ingredients: ingredients.filter(ing => ing.name.trim() !== ''),
      });
      onClose();
    } catch (error) {
      console.error('Failed to save recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={recipe ? `Edit: ${recipe.title}` : 'Add New Recipe'} size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <Input
            label="Recipe Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            placeholder="e.g., Spaghetti Carbonara"
          />

          <TextArea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            rows={3}
            placeholder="Brief description of the recipe..."
          />

          <TextArea
            label="Instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            fullWidth
            rows={6}
            placeholder="Step-by-step cooking instructions..."
          />
        </div>

        {/* Categorization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Cuisine Type"
            value={cuisineType}
            onChange={(e) => setCuisineType(e.target.value)}
            fullWidth
            options={[
              { value: '', label: 'Select cuisine...' },
              ...CUISINE_TYPES.map((c) => ({ value: c, label: c })),
            ]}
          />

          <Select
            label="Health Rating"
            value={healthRating}
            onChange={(e) => setHealthRating(e.target.value)}
            fullWidth
            options={[
              { value: '', label: 'Select rating...' },
              ...HEALTH_RATINGS.map((h) => ({ value: h, label: h })),
            ]}
          />
        </div>

        {/* Visibility Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-neutral-700">Visibility</span>
          <button
            type="button"
            role="switch"
            aria-checked={isPublic}
            onClick={() => setIsPublic(!isPublic)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isPublic ? 'bg-primary-600' : 'bg-neutral-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isPublic ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-sm text-neutral-500">
            {isPublic ? 'Public — visible to everyone' : 'Private — only visible to you'}
          </span>
        </div>

        {/* Servings and Proportions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Original Servings"
            type="number"
            min="1"
            value={originalServings}
            onChange={(e) => setOriginalServings(parseInt(e.target.value))}
            required
            fullWidth
          />

          <Input
            label="Proportion Factor"
            type="number"
            step="0.1"
            min="0.1"
            value={proportionFactor}
            onChange={(e) => setProportionFactor(parseFloat(e.target.value))}
            fullWidth
            helperText="Adjust recipe proportions (1.0 = standard)"
          />
        </div>

        {/* Additional Info */}
        <div className="space-y-4">
          <Input
            label="Recipe Link (Optional)"
            value={recipeLink}
            onChange={(e) => setRecipeLink(e.target.value)}
            fullWidth
            placeholder="https://..."
          />

          <TextArea
            label="Comments (Optional)"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            fullWidth
            rows={2}
            placeholder="Personal notes, tips, variations..."
          />
        </div>

        {/* Ingredients */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-neutral-900">Ingredients</h3>
            <Button type="button" onClick={handleAddIngredient} size="sm" variant="outline">
              + Add Ingredient
            </Button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 items-start p-3 bg-neutral-50 rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-2">
                  <Input
                    placeholder="Name"
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    className="md:col-span-2"
                    fullWidth
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Qty"
                    value={ingredient.quantity || ''}
                    onChange={(e) =>
                      handleIngredientChange(index, 'quantity', e.target.value ? parseFloat(e.target.value) : undefined)
                    }
                    fullWidth
                  />
                  <Input
                    placeholder="Unit"
                    value={ingredient.unit || ''}
                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                    fullWidth
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Cost"
                    value={ingredient.costPerUnit || ''}
                    onChange={(e) =>
                      handleIngredientChange(index, 'costPerUnit', e.target.value ? parseFloat(e.target.value) : undefined)
                    }
                    fullWidth
                  />
                </div>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveIngredient(index)}
                  disabled={ingredients.length === 1}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>

        <ModalFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Save Recipe
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
