import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const TodaysMealsSummary = ({ meals }) => {
  return (
    <div className="bg-surface rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <Text as="h2" className="text-xl font-heading text-white">Today's Meals</Text>
        <ApperIcon name="Apple" size={24} className="text-secondary" />
      </div>
      
      {meals.length > 0 ? (
        <div className="space-y-3">
          {meals.map((meal) => (
            <div key={meal.id} className="flex items-center justify-between">
              <div>
                <Text as="h4" className="text-white font-medium">{meal.name}</Text>
                <Text className="text-surface400 text-sm">
                  {meal.calories} cal • {meal.protein}g protein
                </Text>
              </div>
              <div className="text-right">
                <Text className="text-sm text-surface400">
                  {meal.prepTime} min
                </Text>
              </div>
            </div>
          ))}
          <div className="pt-2 border-t border-surface600">
            <div className="flex justify-between text-sm">
              <Text as="span" className="text-surface400">Total Calories</Text>
              <Text as="span" className="text-white font-medium">
                {meals.reduce((sum, meal) => sum + meal.calories, 0)}
              </Text>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <ApperIcon name="UtensilsCrossed" size={32} className="mx-auto mb-2 text-surface400" />
          <Text className="text-surface400">No meals planned for today</Text>
        </div>
      )}
    </div>
  );
};

export default TodaysMealsSummary;