import { useState, useEffect } from 'react';
import { Modal, Button, Input } from '../../ui';
import type { MealPlanWithRecipes, DuplicateMealPlanDto } from '../../../types';

interface MealPlanDuplicateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DuplicateMealPlanDto) => void;
  sourceMealPlan: MealPlanWithRecipes;
  isLoading?: boolean;
}

export const MealPlanDuplicateModal = ({
  isOpen,
  onClose,
  onSubmit,
  sourceMealPlan,
  isLoading,
}: MealPlanDuplicateModalProps) => {
  const getNextWeekDates = () => {
    const sourceStart = new Date(sourceMealPlan.startDate);
    const nextStart = new Date(sourceStart);
    nextStart.setDate(sourceStart.getDate() + 7);

    const sourceEnd = new Date(sourceMealPlan.endDate);
    const nextEnd = new Date(sourceEnd);
    nextEnd.setDate(sourceEnd.getDate() + 7);

    return { nextStart, nextEnd };
  };

  const { nextStart, nextEnd } = getNextWeekDates();

  const [name, setName] = useState(`${sourceMealPlan.name} (Copy)`);
  const [servingSize, setServingSize] = useState(sourceMealPlan.servingSize);
  const [startDate, setStartDate] = useState(nextStart.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(nextEnd.toISOString().split('T')[0]);
  const [includesBreakfast, setIncludesBreakfast] = useState(sourceMealPlan.includesBreakfast);
  const [includesSnack1, setIncludesSnack1] = useState(sourceMealPlan.includesSnack1);
  const [includesLunch, setIncludesLunch] = useState(sourceMealPlan.includesLunch);
  const [includesSnack2, setIncludesSnack2] = useState(sourceMealPlan.includesSnack2);
  const [includesDinner, setIncludesDinner] = useState(sourceMealPlan.includesDinner);
  const [includesSnack3, setIncludesSnack3] = useState(sourceMealPlan.includesSnack3);

  useEffect(() => {
    if (isOpen) {
      const { nextStart, nextEnd } = getNextWeekDates();
      setName(`${sourceMealPlan.name} (Copy)`);
      setServingSize(sourceMealPlan.servingSize);
      setStartDate(nextStart.toISOString().split('T')[0]);
      setEndDate(nextEnd.toISOString().split('T')[0]);
      setIncludesBreakfast(sourceMealPlan.includesBreakfast);
      setIncludesSnack1(sourceMealPlan.includesSnack1);
      setIncludesLunch(sourceMealPlan.includesLunch);
      setIncludesSnack2(sourceMealPlan.includesSnack2);
      setIncludesDinner(sourceMealPlan.includesDinner);
      setIncludesSnack3(sourceMealPlan.includesSnack3);
    }
  }, [isOpen, sourceMealPlan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: DuplicateMealPlanDto = {
      sourceMealPlanId: sourceMealPlan.id,
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
    <Modal isOpen={isOpen} onClose={onClose} title="Duplicate Meal Plan" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-800">
            This will create a new meal plan with all the recipes from "{sourceMealPlan.name}".
            You can customize the details below.
          </p>
        </div>

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
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includesBreakfast}
                onChange={(e) => setIncludesBreakfast(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">Breakfast</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includesSnack1}
                onChange={(e) => setIncludesSnack1(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">Snack 1</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includesLunch}
                onChange={(e) => setIncludesLunch(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">Lunch</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includesSnack2}
                onChange={(e) => setIncludesSnack2(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">Snack 2</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includesDinner}
                onChange={(e) => setIncludesDinner(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">Dinner</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includesSnack3}
                onChange={(e) => setIncludesSnack3(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">Snack 3 (Dessert)</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Duplicating...' : 'Duplicate Meal Plan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
