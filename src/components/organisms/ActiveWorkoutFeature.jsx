import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import InfoCard from '@/components/molecules/InfoCard';
import ProgressBar from '@/components/molecules/ProgressBar';
import FeedbackCard from '@/components/molecules/FeedbackCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import workoutService from '@/services/api/workoutService';

const ActiveWorkoutFeature = () => {
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [completedSets, setCompletedSets] = useState({});
  const [loading, setLoading] = useState(false);
  const [quickStartWorkouts, setQuickStartWorkouts] = useState([]);

  useEffect(() => {
    const fetchQuickStartWorkouts = async () => {
      setLoading(true);
      try {
        const allWorkouts = await workoutService.getAll();
        // Take first 3 workouts for quick start
        setQuickStartWorkouts(allWorkouts.slice(0, 3));
      } catch (err) {
        toast.error('Failed to load quick start workouts.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuickStartWorkouts();
  }, []);

  // Workout Timer effect
  useEffect(() => {
    let interval;
    if (activeWorkout && !isResting) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeWorkout, isResting]);

  // Rest Timer effect
  useEffect(() => {
    let interval;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            toast.success("Rest time over! Let's go!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const startWorkout = async (workoutId) => {
    setLoading(true);
    try {
      const workout = await workoutService.getById(workoutId);
      setActiveWorkout(workout);
      setCurrentExerciseIndex(0);
      setWorkoutTimer(0);
      setCompletedSets({});
      toast.success(`Started ${workout.name}!`);
    } catch (error) {
      toast.error('Failed to start workout');
    } finally {
      setLoading(false);
    }
  };

  const completeSet = (exerciseId, setIndex) => {
    const key = `${exerciseId}-${setIndex}`;
    setCompletedSets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    if (!completedSets[key]) {
      toast.success('Set completed!');
    }
  };

  const startRest = (seconds = 60) => {
    setIsResting(true);
    setRestTimer(seconds);
    toast.info(`Rest for ${seconds} seconds`);
  };

  const nextExercise = () => {
    if (activeWorkout && currentExerciseIndex < activeWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      toast.info('Moving to next exercise');
      setIsResting(false); // End rest if any
    } else {
      finishWorkout();
    }
  };

  const finishWorkout = async () => {
    try {
      if (!activeWorkout) return;
      const completedWorkout = {
        ...activeWorkout,
        completedAt: new Date().toISOString(),
        duration: workoutTimer,
        exercises: activeWorkout.exercises.map(exercise => ({
          ...exercise,
          completed: true // Mark all as completed for simplicity
        }))
      };
      
      await workoutService.update(activeWorkout.id, completedWorkout);
      
      toast.success('🎉 Workout completed! Great job!');
      setActiveWorkout(null);
      setCurrentExerciseIndex(0);
      setWorkoutTimer(0);
      setCompletedSets({});
    } catch (error) {
      toast.error('Failed to save workout');
    }
  };

  const stopWorkout = () => {
    setActiveWorkout(null);
    setCurrentExerciseIndex(0);
    setWorkoutTimer(0);
    setCompletedSets({});
    setIsResting(false);
    setRestTimer(0);
    toast.info('Workout stopped');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonLoader>
          <div className="h-8 bg-surface rounded w-3/4"></div>
          <div className="h-20 bg-surface rounded"></div>
          <div className="h-20 bg-surface rounded"></div>
        </SkeletonLoader>
      </div>
    );
  }

  if (!activeWorkout) {
    return (
      <div className="p-6">
        <Text as="h2" className="text-display-sm font-display text-white mb-6">
          Quick Start Workout
        </Text>
        
        <div className="grid gap-4">
          {quickStartWorkouts.map((workout, index) => (
            <InfoCard
              key={workout.id}
              className={`gradient-${index % 3 === 0 ? 'primary' : index % 3 === 1 ? 'accent' : 'success'}`}
              title={workout.name}
              description={`${workout.duration} min • ${workout.exercises?.length || 0} exercises`}
              iconName="Play"
              onClick={() => startWorkout(workout.id)}
            />
          ))}
        </div>
      </div>
    );
  }

  const exercise = activeWorkout.exercises[currentExerciseIndex];

  return (
    <div className="p-6">
      {/* Workout Header */}
      <div className="bg-surface rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Text as="h2" className="text-display-sm font-display text-white">
              {activeWorkout.name}
            </Text>
            <Text className="text-surface400">
              Exercise {currentExerciseIndex + 1} of {activeWorkout.exercises.length}
            </Text>
          </div>
          <div className="text-right">
            <Text as="div" className="text-2xl font-bold text-primary">
              {formatTime(workoutTimer)}
            </Text>
            <Text className="text-surface400 text-sm">Total Time</Text>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar
          label="Workout Progress"
          currentValue={currentExerciseIndex + 1}
          targetValue={activeWorkout.exercises.length}
          unit=""
          barColorClass="gradient-primary"
          animationDelay={0} // No delay for workout progress bar
        />
      </div>

      {/* Rest Timer */}
      {isResting && (
        <FeedbackCard
          type="info"
          title={formatTime(restTimer)}
          message="Rest Time"
          iconName="Timer"
          className="bg-warning rounded-xl text-center"
        />
      )}

      {/* Current Exercise */}
      <div className="bg-surface rounded-xl p-6 mb-6">
        <Text as="h3" className="text-xl font-heading text-white mb-4">
          {exercise.name}
        </Text>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <Text as="div" className="text-2xl font-bold text-primary">
              {exercise.sets}
            </Text>
            <Text className="text-surface400 text-sm">Sets</Text>
          </div>
          <div className="text-center">
            <Text as="div" className="text-2xl font-bold text-secondary">
              {exercise.reps}
            </Text>
            <Text className="text-surface400 text-sm">Reps</Text>
          </div>
          <div className="text-center">
            <Text as="div" className="text-2xl font-bold text-accent">
              {exercise.weight}
            </Text>
            <Text className="text-surface400 text-sm">Weight</Text>
          </div>
        </div>

        {/* Sets Tracker */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {Array.from({ length: exercise.sets }).map((_, index) => {
            const key = `${exercise.id}-${index}`;
            const isCompleted = completedSets[key];
            
            return (
              <Button
                key={index}
                onClick={() => completeSet(exercise.id, index)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isCompleted
                    ? 'bg-success border-success text-white'
                    : 'border-surface600 text-surface400 hover:border-primary'
                }`}
              >
                <Text as="div" className="font-bold">Set {index + 1}</Text>
                {isCompleted && (
                  <ApperIcon name="Check" size={16} className="mx-auto mt-1" />
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => startRest(exercise.restTime)}
          className="bg-surface600 text-white p-4 rounded-xl font-medium flex items-center justify-center gap-2"
        >
          <ApperIcon name="Timer" size={20} />
          Rest ({exercise.restTime}s)
        </Button>

        <Button
          onClick={nextExercise}
          className="gradient-primary text-white p-4 rounded-xl font-medium flex items-center justify-center gap-2"
        >
          <ApperIcon name="ArrowRight" size={20} />
          {currentExerciseIndex < activeWorkout.exercises.length - 1 ? 'Next' : 'Finish'}
        </Button>
      </div>

      {/* Emergency Stop */}
      <Button
        onClick={stopWorkout}
        className="w-full mt-4 bg-error/20 border border-error text-error p-3 rounded-xl font-medium"
      >
        Stop Workout
      </Button>
    </div>
  );
};

export default ActiveWorkoutFeature;