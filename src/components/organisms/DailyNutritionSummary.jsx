import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import ProgressBar from '@/components/molecules/ProgressBar';

const DailyNutritionSummary = ({ meals, dailyCalories, targetCalories }) => {
  const totalProtein = meals.filter(m => m.consumed).reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs = meals.filter(m => m.consumed).reduce((sum, m) => sum + m.carbs, 0);
  const totalFats = meals.filter(m => m.consumed).reduce((sum, m) => sum + m.fats, 0);

  return (
    <div className="bg-surface rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <Text as="h2" className="text-xl font-heading text-white">Daily Progress</Text>
        <ApperIcon name="Target" size={24} className="text-primary" />
      </div>
      
      <ProgressBar
        label="Calories"
        currentValue={dailyCalories}
        targetValue={targetCalories}
        unit="cal"
      />

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <Text as="div" className="text-2xl font-bold text-primary">
            {totalProtein}g
          </Text>
          <Text className="text-surface400 text-sm">Protein</Text>
        </div>
        <div className="text-center">
          <Text as="div" className="text-2xl font-bold text-secondary">
            {totalCarbs}g
          </Text>
          <Text className="text-surface400 text-sm">Carbs</Text>
        </div>
        <div className="text-center">
          <Text as="div" className="text-2xl font-bold text-accent">
            {totalFats}g
          </Text>
          <Text className="text-surface400 text-sm">Fats</Text>
        </div>
      </div>
    </div>
  );
};

export default DailyNutritionSummary;