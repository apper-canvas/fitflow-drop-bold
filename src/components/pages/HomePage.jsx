import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Text from '@/components/atoms/Text';
import DailyStatsSummary from '@/components/organisms/DailyStatsSummary';
import TodaysWorkoutPreview from '@/components/organisms/TodaysWorkoutPreview';
import TodaysMealsSummary from '@/components/organisms/TodaysMealsSummary';
import ActiveWorkoutFeature from '@/components/organisms/ActiveWorkoutFeature';
import FeedbackCard from '@/components/molecules/FeedbackCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import workoutService from '@/services/api/workoutService';
import mealService from '@/services/api/mealService';
import progressService from '@/services/api/progressService';

const HomePage = () => {
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
        
// Get most recent data from database
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
        <SkeletonLoader>
          <div className="h-8 bg-surface rounded w-3/4"></div>
          <div className="h-32 bg-surface rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-surface rounded"></div>
            <div className="h-24 bg-surface rounded"></div>
          </div>
          <div className="h-40 bg-surface rounded"></div>
        </SkeletonLoader>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <FeedbackCard
          type="error"
          title="Something went wrong"
          message={error}
          onAction={() => window.location.reload()}
          actionLabel="Try Again"
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
            Good Morning! 👋
          </Text>
          <Text className="text-surface400 text-lg">{formatDate()}</Text>
        </motion.div>
      </div>

      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <DailyStatsSummary todaysProgress={todaysProgress} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TodaysWorkoutPreview workout={todaysWorkout} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <TodaysMealsSummary meals={todaysMeals} />
        </motion.div>
      </div>

      {/* Active Workout Feature */}
      <ActiveWorkoutFeature />
    </div>
  );
};

export default HomePage;