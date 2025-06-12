import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const WorkoutList = ({ workouts }) => {
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

  return (
    <div className="space-y-4">
      {workouts.map((workout, index) => (
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
              <Text as="h3" className="text-xl font-heading text-white mb-2 break-words">
                {workout.name}
              </Text>
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
            <Text className="text-surface400 text-sm">
              Last completed: Never
            </Text>
            <Button
              className="gradient-primary px-4 py-2 rounded-lg text-white font-medium text-sm"
              onClick={(e) => {
                e.stopPropagation();
                toast.success(`Starting ${workout.name}!`);
              }}
            >
              Start Workout
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default WorkoutList;