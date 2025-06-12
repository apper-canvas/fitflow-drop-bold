import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

// Mock workout service for offline/online completion
const workoutService = {
  completeWorkout: async (workoutId, completionData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store completion data locally (works offline)
    const completions = JSON.parse(localStorage.getItem('workoutCompletions') || '{}');
    completions[workoutId] = {
      ...completionData,
      completedAt: new Date().toISOString(),
      id: workoutId
    };
    localStorage.setItem('workoutCompletions', JSON.stringify(completions));
    
    return { success: true, data: completions[workoutId] };
  }
};

const WorkoutList = ({ workouts, isOffline = false }) => {
  const [completingWorkouts, setCompletingWorkouts] = useState(new Set());
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

  const handleStartWorkout = async (workout, e) => {
    e.stopPropagation();
    
    if (completingWorkouts.has(workout.id)) {
      return; // Already processing
    }

    setCompletingWorkouts(prev => new Set([...prev, workout.id]));

    try {
      // Simulate workout completion with some basic data
      const completionData = {
        duration: workout.duration || 30,
        caloriesBurned: workout.caloriesBurned || 200,
        exercises: workout.exercises || [],
        notes: `Completed ${isOffline ? 'offline' : 'online'}`
      };

      // Complete the workout (works offline)
      await workoutService.completeWorkout(workout.id, completionData);

      if (isOffline) {
        toast.success(`${workout.name} completed offline! Will sync when back online.`, {
          position: "top-center",
          autoClose: 4000
        });
      } else {
        toast.success(`Great job! ${workout.name} completed successfully!`, {
          position: "top-center",
          autoClose: 3000
        });
      }
    } catch (error) {
      toast.error(`Failed to complete workout: ${error.message}`);
    } finally {
      setCompletingWorkouts(prev => {
        const newSet = new Set(prev);
        newSet.delete(workout.id);
        return newSet;
      });
    }
  };

  return (
    <div className="space-y-4">
      {workouts.map((workout, index) => {
        const isCompleting = completingWorkouts.has(workout.id);
        
        return (
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
                <div className="flex items-center gap-2 mb-2">
                  <Text as="h3" className="text-xl font-heading text-white break-words">
                    {workout.name}
                  </Text>
                  {isOffline && (
                    <span className="px-2 py-1 bg-warning/20 text-warning text-xs rounded-full">
                      Offline
                    </span>
                  )}
                </div>
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
                <ApperIcon 
                  name={isCompleting ? "Loader2" : "Play"} 
                  size={20} 
                  className={`text-primary ${isCompleting ? 'animate-spin' : ''}`} 
                />
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
                {isOffline ? 'Available offline' : 'Last completed: Never'}
              </Text>
              <Button
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  isCompleting 
                    ? 'bg-surface600 text-surface400 cursor-not-allowed' 
                    : 'gradient-primary text-white hover:opacity-90'
                }`}
                onClick={(e) => handleStartWorkout(workout, e)}
                disabled={isCompleting}
              >
                {isCompleting 
                  ? 'Completing...' 
                  : isOffline 
                    ? 'Complete Offline' 
                    : 'Start Workout'
                }
              </Button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default WorkoutList;