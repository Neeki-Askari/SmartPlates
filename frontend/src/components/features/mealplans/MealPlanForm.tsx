import { useState } from 'react';
import { Button, Input, Card, CardContent } from '../../ui';
import type { CreateMealPlanDto } from '../../../types';

interface MealPlanFormProps {
  userId: string;
  onSubmit: (data: CreateMealPlanDto) => void;
  onCancel?: () => void;
}

export const MealPlanForm = ({ userId, onSubmit, onCancel }: MealPlanFormProps) => {
  // Calculate default start date (next Sunday)
  const getNextSunday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + daysUntilSunday);
    nextSunday.setHours(0, 0, 0, 0);
    return nextSunday;
  };

  const defaultStart = getNextSunday();
  const defaultEnd = new Date(defaultStart);
  defaultEnd.setDate(defaultStart.getDate() + 6);

  const [name, setName] = useState('');
  const [servingSize, setServingSize] = useState(2);
  const [startDate, setStartDate] = useState(defaultStart.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(defaultEnd.toISOString().split('T')[0]);
  const [includesBreakfast, setIncludesBreakfast] = useState(true);
  const [includesSnack1, setIncludesSnack1] = useState(false);
  const [includesLunch, setIncludesLunch] = useState(true);
  const [includesSnack2, setIncludesSnack2] = useState(false);
  const [includesDinner, setIncludesDinner] = useState(true);
  const [includesSnack3, setIncludesSnack3] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: CreateMealPlanDto = {
      userId,
      name: name || `Meal Plan ${new Date(startDate).toLocaleDateString()}`,
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
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Create New Meal Plan</h2>

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
              onChange={(e) => setServingSize(parseInt(e.target.value) || 1)}
              fullWidth
            />
          </div>

          {/* Meal Selections */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Include Meals
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
          <div className="flex gap-3 justify-end pt-4">
            {onCancel && (
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit">
              Create Meal Plan
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
