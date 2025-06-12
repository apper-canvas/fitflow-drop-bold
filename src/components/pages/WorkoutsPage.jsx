import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Text from '@/components/atoms/Text';
import CategoryFilter from '@/components/molecules/CategoryFilter';
import FeedbackCard from '@/components/molecules/FeedbackCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import WorkoutList from '@/components/organisms/WorkoutList';
import workoutService from '@/services/api/workoutService';

const WorkoutsPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Workouts', icon: 'Grid3X3' },
    { id: 'strength', label: 'Strength', icon: 'Dumbbell' },
    { id: 'cardio', label: 'Cardio', icon: 'Heart' },
    { id: 'flexibility', label: 'Flexibility', icon: 'User' },
    { id: 'hiit', label: 'HIIT', icon: 'Zap' }
  ];

  useEffect(() => {
    const loadWorkouts = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await workoutService.getAll();
        setWorkouts(result);
      } catch (err) {
        setError(err.message || 'Failed to load workouts');
        toast.error('Failed to load workouts');
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, []);

  const filteredWorkouts = selectedCategory === 'all' 
    ? workouts 
    : workouts.filter(workout => 
        workout.category?.toLowerCase() === selectedCategory ||
        workout.name.toLowerCase().includes(selectedCategory)
      );

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonLoader>
          <div className="h-8 bg-surface rounded w-1/2"></div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-surface rounded w-20"></div>
            ))}
          </div>
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-surface rounded"></div>
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
          title="Failed to load workouts"
          message={error}
          onAction={() => window.location.reload()}
          actionLabel="Try Again"
        />
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="p-6">
        <FeedbackCard
          type="empty"
          title="No workouts available"
          message="Create your first workout to get started"
          iconName="Dumbbell"
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
            Workouts
          </Text>
          <Text className="text-surface400">Choose your training for today</Text>
        </motion.div>
      </div>

      <div className="p-6 pb-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </motion.div>
      </div>

      <div className="p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <WorkoutList workouts={filteredWorkouts} />
        </motion.div>
      </div>
    </div>
  );
};

export default WorkoutsPage;