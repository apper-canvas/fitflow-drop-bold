import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import workoutService from '../services/api/workoutService';

const Workouts = () => {
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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-success bg-success/20';
      case 'medium':
        return 'text-warning bg-warning/20';
      case 'hard':
        return 'text-error bg-error/20';
      default:
        return 'text-surface400 bg-surface600/20';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
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
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-error/20 border border-error rounded-xl p-6 text-center">
          <ApperIcon name="AlertCircle" size={32} className="mx-auto mb-2 text-error" />
          <h3 className="text-lg font-medium text-error mb-2">Failed to load workouts</h3>
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

  if (workouts.length === 0) {
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
              <ApperIcon name="Dumbbell" className="w-16 h-16 text-surface400 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-lg font-medium text-white mb-2">No workouts available</h3>
            <p className="text-surface400 mb-4">Create your first workout to get started</p>
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
            Workouts
          </h1>
          <p className="text-surface400">Choose your training for today</p>
        </motion.div>
      </div>

      {/* Category Filters */}
      <div className="p-6 pb-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'gradient-primary text-white'
                  : 'bg-surface text-surface400 hover:text-white'
              }`}
            >
              <ApperIcon name={category.icon} size={16} />
              {category.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Workouts List */}
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          {filteredWorkouts.map((workout, index) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-surface rounded-xl p-6 cursor-pointer transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-heading text-white mb-2 break-words">
                    {workout.name}
                  </h3>
                  <div className="flex items-center gap-4 text-surface400 text-sm">
                    <span className="flex items-center gap-1">
                      <ApperIcon name="Clock" size={16} />
                      {workout.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <ApperIcon name="Target" size={16} />
                      {workout.exercises?.length || 0} exercises
                    </span>
                    <span className="flex items-center gap-1">
                      <ApperIcon name="Flame" size={16} />
                      {workout.caloriesBurned} cal
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(workout.difficulty)}`}>
                    {workout.difficulty}
                  </span>
                  <ApperIcon name="Play" size={20} className="text-primary" />
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                {workout.targetMuscles?.map((muscle, muscleIndex) => (
                  <span 
                    key={muscleIndex}
                    className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full"
                  >
                    {muscle}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-surface400 text-sm">
                  Last completed: Never
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="gradient-primary px-4 py-2 rounded-lg text-white font-medium text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.success(`Starting ${workout.name}!`);
                  }}
                >
                  Start Workout
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Workouts;