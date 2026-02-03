import { useState, useEffect } from 'react';
import { Modal, Button, Input } from '../../ui';
import type { MealPlanWithRecipes, UpdateMealPlanDto } from '../../../types';

interface MealPlanEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateMealPlanDto) => void;
  mealPlan: MealPlanWithRecipes;
  isLoading?: boolean;
}

export const MealPlanEditModal = ({
  isOpen,
  onClose,
  onSubmit,
  mealPlan,
  isLoading,
}: MealPlanEditModalProps) => {
  const [name, setName] = useState(mealPlan.name);
  const [servingSize, setServingSize] = useState(mealPlan.servingSize);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includesBreakfast, setIncludesBreakfast] = useState(mealPlan.includesBreakfast);
  const [includesSnack1, setIncludesSnack1] = useState(mealPlan.includesSnack1);
  const [includesLunch, setIncludesLunch] = useState(mealPlan.includesLunch);
  const [includesSnack2, setIncludesSnack2] = useState(mealPlan.includesSnack2);
  const [includesDinner, setIncludesDinner] = useState(mealPlan.includesDinner);
  const [includesSnack3, setIncludesSnack3] = useState(mealPlan.includesSnack3);

  // Convert ISO dates to YYYY-MM-DD format for input
  useEffect(() => {
    if (mealPlan.startDate) {
      setStartDate(new Date(mealPlan.startDate).toISOString().split('T')[0]);
    }
    if (mealPlan.endDate) {
      setEndDate(new Date(mealPlan.endDate).toISOString().split('T')[0]);
    }
    setName(mealPlan.name);
    setServingSize(mealPlan.servingSize);
    setIncludesBreakfast(mealPlan.includesBreakfast);
    setIncludesSnack1(mealPlan.includesSnack1);
    setIncludesLunch(mealPlan.includesLunch);
    setIncludesSnack2(mealPlan.includesSnack2);
    setIncludesDinner(mealPlan.includesDinner);
    setIncludesSnack3(mealPlan.includesSnack3);
  }, [mealPlan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: UpdateMealPlanDto = {
      name,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      servingSize,
      includesBreakfast,
      includesSnack1,
      includesLunch,
      includesSnack2,
      includesDinner,
      includesSnack3,
    };

    onSubmit(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Meal Plan Details" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Meal Plan Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Weekly Meal Plan"
            fullWidth
            required
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Start Date
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              End Date
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              required
            />
          </div>
        </div>

        {/* Serving Size */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Number of People
          </label>
          <Input
            type="number"
            min={1}
            max={20}
            value={servingSize}
            onChange={(e) => setServingSize(parseInt(e.target.value))}
            fullWidth
            required
          />
        </div>

        {/* Meal Types */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            Select Meals to Include
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includesBreakfast}
                onChange={(e) => setIncludesBreakfast(e.target.checked)}
                className="mr-2 h-4 w-4 text-primary-600 rounded border-neutral-300"
              />
              <span className="text-sm text-neutral-700">Breakfast</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includesSnack1}
                onChange={(e) => setIncludesSnack1(e.target.checked)}
                className="mr-2 h-4 w-4 text-primary-600 rounded border-neutral-300"
              />
              <span className="text-sm text-neutral-700">Morning Snack</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includesLunch}
                onChange={(e) => setIncludesLunch(e.target.checked)}
                className="mr-2 h-4 w-4 text-primary-600 rounded border-neutral-300"
              />
              <span className="text-sm text-neutral-700">Lunch</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includesSnack2}
                onChange={(e) => setIncludesSnack2(e.target.checked)}
                className="mr-2 h-4 w-4 text-primary-600 rounded border-neutral-300"
              />
              <span className="text-sm text-neutral-700">Afternoon Snack</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includesDinner}
                onChange={(e) => setIncludesDinner(e.target.checked)}
                className="mr-2 h-4 w-4 text-primary-600 rounded border-neutral-300"
              />
              <span className="text-sm text-neutral-700">Dinner</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includesSnack3}
                onChange={(e) => setIncludesSnack3(e.target.checked)}
                className="mr-2 h-4 w-4 text-primary-600 rounded border-neutral-300"
              />
              <span className="text-sm text-neutral-700">Dessert</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
