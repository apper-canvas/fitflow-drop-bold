import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import workoutService from '../services/api/workoutService';
import exerciseService from '../services/api/exerciseService';

const MainFeature = () => {
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [completedSets, setCompletedSets] = useState({});
  const [loading, setLoading] = useState(false);

  // Timer effect for workout
  useEffect(() => {
    let interval;
    if (activeWorkout && !isResting) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeWorkout, isResting]);

  // Rest timer effect
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
      setCurrentExercise(0);
      setTimer(0);
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
    if (currentExercise < activeWorkout.exercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
      toast.info('Moving to next exercise');
    } else {
      finishWorkout();
    }
  };

  const finishWorkout = async () => {
    try {
      // Log workout completion
      const completedWorkout = {
        ...activeWorkout,
        completedAt: new Date().toISOString(),
        duration: timer,
        exercises: activeWorkout.exercises.map(exercise => ({
          ...exercise,
          completed: true
        }))
      };
      
      await workoutService.update(activeWorkout.id, completedWorkout);
      
      toast.success('🎉 Workout completed! Great job!');
      setActiveWorkout(null);
      setCurrentExercise(0);
      setTimer(0);
      setCompletedSets({});
    } catch (error) {
      toast.error('Failed to save workout');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface rounded w-3/4"></div>
          <div className="h-20 bg-surface rounded"></div>
          <div className="h-20 bg-surface rounded"></div>
        </div>
      </div>
    );
  }

  if (!activeWorkout) {
    return (
      <div className="p-6">
        <h2 className="text-display-sm font-display text-white mb-6">
          Quick Start Workout
        </h2>
        
        <div className="grid gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => startWorkout('1')}
            className="gradient-primary p-6 rounded-xl text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg text-white">Upper Body Blast</h3>
                <p className="text-white/80 text-sm">45 min • 8 exercises</p>
              </div>
              <ApperIcon name="Play" size={24} className="text-white" />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => startWorkout('2')}
            className="gradient-accent p-6 rounded-xl text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg text-white">HIIT Cardio</h3>
                <p className="text-white/80 text-sm">30 min • 6 exercises</p>
              </div>
              <ApperIcon name="Play" size={24} className="text-white" />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => startWorkout('3')}
            className="gradient-success p-6 rounded-xl text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg text-white">Lower Body Power</h3>
                <p className="text-white/80 text-sm">50 min • 10 exercises</p>
              </div>
              <ApperIcon name="Play" size={24} className="text-white" />
            </div>
          </motion.button>
        </div>
      </div>
    );
  }

  const exercise = activeWorkout.exercises[currentExercise];

  return (
    <div className="p-6">
      {/* Workout Header */}
      <div className="bg-surface rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-display-sm font-display text-white">
              {activeWorkout.name}
            </h2>
            <p className="text-surface400">
              Exercise {currentExercise + 1} of {activeWorkout.exercises.length}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {formatTime(timer)}
            </div>
            <p className="text-surface400 text-sm">Total Time</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-surface600 rounded-full h-2">
          <motion.div
            className="gradient-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ 
              width: `${((currentExercise + 1) / activeWorkout.exercises.length) * 100}%` 
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Rest Timer */}
      {isResting && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-warning rounded-xl p-6 mb-6 text-center"
        >
          <ApperIcon name="Timer" size={32} className="mx-auto mb-2 text-white" />
          <div className="text-3xl font-bold text-white mb-2">
            {formatTime(restTimer)}
          </div>
          <p className="text-white/80">Rest Time</p>
        </motion.div>
      )}

      {/* Current Exercise */}
      <div className="bg-surface rounded-xl p-6 mb-6">
        <h3 className="text-xl font-heading text-white mb-4">
          {exercise.name}
        </h3>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {exercise.sets}
            </div>
            <p className="text-surface400 text-sm">Sets</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">
              {exercise.reps}
            </div>
            <p className="text-surface400 text-sm">Reps</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {exercise.weight}
            </div>
            <p className="text-surface400 text-sm">Weight</p>
          </div>
        </div>

        {/* Sets Tracker */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {Array.from({ length: exercise.sets }).map((_, index) => {
            const key = `${exercise.id}-${index}`;
            const isCompleted = completedSets[key];
            
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => completeSet(exercise.id, index)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isCompleted
                    ? 'bg-success border-success text-white'
                    : 'border-surface600 text-surface400 hover:border-primary'
                }`}
              >
                <div className="font-bold">Set {index + 1}</div>
                {isCompleted && (
                  <ApperIcon name="Check" size={16} className="mx-auto mt-1" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => startRest(exercise.restTime)}
          className="bg-surface600 text-white p-4 rounded-xl font-medium flex items-center justify-center gap-2"
        >
          <ApperIcon name="Timer" size={20} />
          Rest ({exercise.restTime}s)
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={nextExercise}
          className="gradient-primary text-white p-4 rounded-xl font-medium flex items-center justify-center gap-2"
        >
          <ApperIcon name="ArrowRight" size={20} />
          {currentExercise < activeWorkout.exercises.length - 1 ? 'Next' : 'Finish'}
        </motion.button>
      </div>

      {/* Emergency Stop */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setActiveWorkout(null);
          setCurrentExercise(0);
          setTimer(0);
          setCompletedSets({});
          toast.info('Workout stopped');
        }}
        className="w-full mt-4 bg-error/20 border border-error text-error p-3 rounded-xl font-medium"
      >
        Stop Workout
      </motion.button>
    </div>
  );
};

export default MainFeature;