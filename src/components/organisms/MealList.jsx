import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const MealList = ({ meals, onLogMeal }) => {
  const getMacroBarWidth = (value, total) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  return (
    <div className="space-y-4">
      {meals.map((meal, index) => (
        <motion.div
          key={meal.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-surface rounded-xl p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <Text as="h3" className="text-xl font-heading text-white mb-2 break-words">
                {meal.name}
              </Text>
              <div className="flex items-center gap-4 text-surface400 text-sm">
                <span className="flex items-center gap-1">
                  <ApperIcon name="Clock" size={16} />
                  {meal.prepTime} min
                </span>
                <span className="flex items-center gap-1">
                  <ApperIcon name="Flame" size={16} />
                  {meal.calories} cal
                </span>
              </div>
            </div>
            <div className="text-right">
              {meal.consumed ? (
                <span className="flex items-center gap-1 text-success text-sm">
                  <ApperIcon name="Check" size={16} />
                  Logged
                </span>
              ) : (
                <Button
                  onClick={() => onLogMeal(meal.id)}
                  className="gradient-primary px-4 py-2 rounded-lg text-white font-medium text-sm"
                >
                  Log Meal
                </Button>
              )}
            </div>
          </div>

          {/* Macro Breakdown */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <Text as="span" className="text-surface400">Protein</Text>
              <Text as="span" className="text-primary font-medium">{meal.protein}g</Text>
            </div>
            <div className="w-full bg-surface600 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full"
                style={{ width: `${getMacroBarWidth(meal.protein, meal.protein + meal.carbs + meal.fats)}%` }}
              />
            </div>

            <div className="flex justify-between text-sm">
              <Text as="span" className="text-surface400">Carbs</Text>
              <Text as="span" className="text-secondary font-medium">{meal.carbs}g</Text>
            </div>
            <div className="w-full bg-surface600 rounded-full h-2">
              <div 
                className="bg-secondary h-2 rounded-full"
                style={{ width: `${getMacroBarWidth(meal.carbs, meal.protein + meal.carbs + meal.fats)}%` }}
              />
            </div>

            <div className="flex justify-between text-sm">
              <Text as="span" className="text-surface400">Fats</Text>
              <Text as="span" className="text-accent font-medium">{meal.fats}g</Text>
            </div>
            <div className="w-full bg-surface600 rounded-full h-2">
              <div 
                className="bg-accent h-2 rounded-full"
                style={{ width: `${getMacroBarWidth(meal.fats, meal.protein + meal.carbs + meal.fats)}%` }}
              />
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <Text as="h4" className="text-sm font-medium text-surface400 mb-2">Ingredients</Text>
            <div className="flex flex-wrap gap-2">
              {meal.ingredients?.slice(0, 3).map((ingredient, ingredientIndex) => (
                <span 
                  key={ingredientIndex}
                  className="px-2 py-1 bg-surface600 text-surface300 text-xs rounded-full"
                >
                  {ingredient}
                </span>
              ))}
              {meal.ingredients?.length > 3 && (
                <span className="px-2 py-1 bg-surface600 text-surface300 text-xs rounded-full">
                  +{meal.ingredients.length - 3} more
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MealList;