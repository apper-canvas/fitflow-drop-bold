import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import mealService from '../services/api/mealService';

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState('all');
  const [dailyCalories, setDailyCalories] = useState(0);
  const [targetCalories] = useState(2000);

  const mealTypes = [
    { id: 'all', label: 'All Meals', icon: 'UtensilsCrossed' },
    { id: 'breakfast', label: 'Breakfast', icon: 'Coffee' },
    { id: 'lunch', label: 'Lunch', icon: 'Apple' },
    { id: 'dinner', label: 'Dinner', icon: 'Utensils' },
    { id: 'snack', label: 'Snacks', icon: 'Cookie' }
  ];

  useEffect(() => {
    const loadMeals = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await mealService.getAll();
        setMeals(result);
        
        // Calculate daily calories from consumed meals
        const consumedToday = result.filter(meal => meal.consumed);
        const totalCalories = consumedToday.reduce((sum, meal) => sum + meal.calories, 0);
        setDailyCalories(totalCalories);
      } catch (err) {
        setError(err.message || 'Failed to load meals');
        toast.error('Failed to load meals');
      } finally {
        setLoading(false);
      }
    };

    loadMeals();
  }, []);

  const filteredMeals = selectedMealType === 'all' 
    ? meals 
    : meals.filter(meal => 
        meal.type?.toLowerCase() === selectedMealType ||
        meal.name.toLowerCase().includes(selectedMealType)
      );

  const logMeal = async (mealId) => {
    try {
      const meal = meals.find(m => m.id === mealId);
      const updatedMeal = { ...meal, consumed: true, consumedAt: new Date().toISOString() };
      
      await mealService.update(mealId, updatedMeal);
      
      setMeals(prev => prev.map(m => m.id === mealId ? updatedMeal : m));
      setDailyCalories(prev => prev + meal.calories);
      
      toast.success(`Logged ${meal.name}!`);
    } catch (error) {
      toast.error('Failed to log meal');
    }
  };

  const getMacroBarWidth = (value, total) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  const calorieProgress = (dailyCalories / targetCalories) * 100;

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface rounded w-1/2"></div>
          <div className="h-24 bg-surface rounded"></div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-surface rounded w-20"></div>
            ))}
          </div>
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-surface rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-error/20 border border-error rounded-xl p-6 text-center">
          <ApperIcon name="AlertCircle" size={32} className="mx-auto mb-2 text-error" />
          <h3 className="text-lg font-medium text-error mb-2">Failed to load meals</h3>
          <p className="text-error/80 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="bg-error text-white px-4 py-2 rounded-lg font-medium"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  if (meals.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <ApperIcon name="Apple" className="w-16 h-16 text-surface400 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-lg font-medium text-white mb-2">No meals available</h3>
            <p className="text-surface400 mb-4">Add your first meal to get started</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-display-md font-display text-white mb-2">
            Nutrition
          </h1>
          <p className="text-surface400">Track your meals and macros</p>
        </motion.div>
      </div>

      {/* Daily Overview */}
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-surface rounded-xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading text-white">Daily Progress</h2>
            <ApperIcon name="Target" size={24} className="text-primary" />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-surface400">Calories</span>
              <span className="text-white">
                {dailyCalories} / {targetCalories} cal
              </span>
            </div>
            <div className="w-full bg-surface600 rounded-full h-3">
              <motion.div
                className="gradient-primary h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(calorieProgress, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {meals.filter(m => m.consumed).reduce((sum, m) => sum + m.protein, 0)}g
              </div>
              <p className="text-surface400 text-sm">Protein</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {meals.filter(m => m.consumed).reduce((sum, m) => sum + m.carbs, 0)}g
              </div>
              <p className="text-surface400 text-sm">Carbs</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {meals.filter(m => m.consumed).reduce((sum, m) => sum + m.fats, 0)}g
              </div>
              <p className="text-surface400 text-sm">Fats</p>
            </div>
          </div>
        </motion.div>

        {/* Meal Type Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6"
        >
          {mealTypes.map((type) => (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMealType(type.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedMealType === type.id
                  ? 'gradient-primary text-white'
                  : 'bg-surface text-surface400 hover:text-white'
              }`}
            >
              <ApperIcon name={type.icon} size={16} />
              {type.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Meals List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4"
        >
          {filteredMeals.map((meal, index) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-surface rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-heading text-white mb-2 break-words">
                    {meal.name}
                  </h3>
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
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => logMeal(meal.id)}
                      className="gradient-primary px-4 py-2 rounded-lg text-white font-medium text-sm"
                    >
                      Log Meal
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Macro Breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-surface400">Protein</span>
                  <span className="text-primary font-medium">{meal.protein}g</span>
                </div>
                <div className="w-full bg-surface600 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${getMacroBarWidth(meal.protein, meal.protein + meal.carbs + meal.fats)}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-surface400">Carbs</span>
                  <span className="text-secondary font-medium">{meal.carbs}g</span>
                </div>
                <div className="w-full bg-surface600 rounded-full h-2">
                  <div 
                    className="bg-secondary h-2 rounded-full"
                    style={{ width: `${getMacroBarWidth(meal.carbs, meal.protein + meal.carbs + meal.fats)}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-surface400">Fats</span>
                  <span className="text-accent font-medium">{meal.fats}g</span>
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
                <h4 className="text-sm font-medium text-surface400 mb-2">Ingredients</h4>
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
        </motion.div>
      </div>
    </div>
  );
};

export default Meals;