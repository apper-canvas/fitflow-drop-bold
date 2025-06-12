import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Text from '@/components/atoms/Text';
import CategoryFilter from '@/components/molecules/CategoryFilter';
import FeedbackCard from '@/components/molecules/FeedbackCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import DailyNutritionSummary from '@/components/organisms/DailyNutritionSummary';
import MealList from '@/components/organisms/MealList';
import mealService from '@/services/api/mealService';

const MealsPage = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState('all');
  const [dailyCalories, setDailyCalories] = useState(0);
  const [targetCalories] = useState(2000); // This could eventually come from user settings

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
        meal.Name?.toLowerCase().includes(selectedMealType)
      );

const handleLogMeal = async (mealId) => {
    try {
      const meal = meals.find(m => m.Id === mealId);
      if (!meal) return;

      const updatedMeal = { consumed: true, consumed_at: new Date().toISOString() };
      
      await mealService.update(mealId, updatedMeal);
      
      setMeals(prev => prev.map(m => m.Id === mealId ? { ...m, ...updatedMeal } : m));
      setDailyCalories(prev => prev + (meal.calories || 0));
      
      toast.success(`Logged ${meal.Name}!`);
    } catch (error) {
      toast.error('Failed to log meal');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonLoader>
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
        </SkeletonLoader>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <FeedbackCard
          type="error"
          title="Failed to load meals"
          message={error}
          onAction={() => window.location.reload()}
          actionLabel="Try Again"
        />
      </div>
    );
  }

  if (meals.length === 0) {
    return (
      <div className="p-6">
        <FeedbackCard
          type="empty"
          title="No meals available"
          message="Add your first meal to get started"
          iconName="Apple"
          className="py-12"
        />
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
          <Text as="h1" className="text-display-md font-display text-white mb-2">
            Nutrition
          </Text>
          <Text className="text-surface400">Track your meals and macros</Text>
        </motion.div>
      </div>

      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <DailyNutritionSummary 
            meals={meals} 
            dailyCalories={dailyCalories} 
            targetCalories={targetCalories} 
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CategoryFilter
            categories={mealTypes}
            selectedCategory={selectedMealType}
            onSelectCategory={setSelectedMealType}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <MealList meals={filteredMeals} onLogMeal={handleLogMeal} />
        </motion.div>
      </div>
    </div>
  );
};

export default MealsPage;