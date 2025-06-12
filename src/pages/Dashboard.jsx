import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import MainFeature from '../components/MainFeature';
import workoutService from '../services/api/workoutService';
import mealService from '../services/api/mealService';
import progressService from '../services/api/progressService';

const Dashboard = () => {
  const [todaysWorkout, setTodaysWorkout] = useState(null);
  const [todaysMeals, setTodaysMeals] = useState([]);
  const [todaysProgress, setTodaysProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [workouts, meals, progress] = await Promise.all([
          workoutService.getAll(),
          mealService.getAll(),
          progressService.getAll()
        ]);
        
        setTodaysWorkout(workouts[0] || null);
        setTodaysMeals(meals.slice(0, 3));
        setTodaysProgress(progress[0] || null);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface rounded w-3/4"></div>
          <div className="h-32 bg-surface rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-surface rounded"></div>
            <div className="h-24 bg-surface rounded"></div>
          </div>
          <div className="h-40 bg-surface rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-error/20 border border-error rounded-xl p-6 text-center">
          <ApperIcon name="AlertCircle" size={32} className="mx-auto mb-2 text-error" />
          <h3 className="text-lg font-medium text-error mb-2">Something went wrong</h3>
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
            Good Morning! 👋
          </h1>
          <p className="text-surface400 text-lg">{formatDate()}</p>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="gradient-primary p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <ApperIcon name="Flame" size={24} className="text-white" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {todaysProgress?.caloriesBurned || 0}
                </div>
                <p className="text-white/80 text-sm">Calories Burned</p>
              </div>
            </div>
          </div>

          <div className="gradient-accent p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <ApperIcon name="Target" size={24} className="text-white" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {todaysProgress?.workoutsCompleted || 0}
                </div>
                <p className="text-white/80 text-sm">Workouts Done</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Today's Workout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-surface rounded-xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading text-white">Today's Workout</h2>
            <ApperIcon name="Dumbbell" size={24} className="text-primary" />
          </div>
          
          {todaysWorkout ? (
            <div>
              <h3 className="text-lg font-medium text-white mb-2">
                {todaysWorkout.name}
              </h3>
              <div className="flex items-center gap-4 text-surface400 text-sm mb-4">
                <span className="flex items-center gap-1">
                  <ApperIcon name="Clock" size={16} />
                  {todaysWorkout.duration} min
                </span>
                <span className="flex items-center gap-1">
                  <ApperIcon name="Zap" size={16} />
                  {todaysWorkout.difficulty}
                </span>
              </div>
              <div className="flex gap-2">
                {todaysWorkout.targetMuscles?.map((muscle, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <ApperIcon name="Calendar" size={32} className="mx-auto mb-2 text-surface400" />
              <p className="text-surface400">No workout scheduled for today</p>
            </div>
          )}
        </motion.div>

        {/* Meals Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-surface rounded-xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading text-white">Today's Meals</h2>
            <ApperIcon name="Apple" size={24} className="text-secondary" />
          </div>
          
          {todaysMeals.length > 0 ? (
            <div className="space-y-3">
              {todaysMeals.map((meal, index) => (
                <div key={meal.id} className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{meal.name}</h4>
                    <p className="text-surface400 text-sm">
                      {meal.calories} cal • {meal.protein}g protein
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-surface400">
                      {meal.prepTime} min
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-surface600">
                <div className="flex justify-between text-sm">
                  <span className="text-surface400">Total Calories</span>
                  <span className="text-white font-medium">
                    {todaysMeals.reduce((sum, meal) => sum + meal.calories, 0)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <ApperIcon name="UtensilsCrossed" size={32} className="mx-auto mb-2 text-surface400" />
              <p className="text-surface400">No meals planned for today</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Active Workout Feature */}
      <MainFeature />
    </div>
  );
};

export default Dashboard;