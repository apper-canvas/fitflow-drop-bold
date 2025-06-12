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
  const [offlineStatus, setOfflineStatus] = useState({ isOffline: false, pendingSyncItems: 0 });

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
        
        // Update offline status
        const status = workoutService.getOfflineStatus();
        setOfflineStatus(status);
        
        if (status.isOffline && result.length > 0) {
          toast.info('Viewing cached workouts - you\'re offline');
        }
      } catch (err) {
        setError(err.message || 'Failed to load workouts');
        
        // If offline, try to show helpful message
        if (!navigator.onLine) {
          setError('You\'re offline. Showing cached workouts if available.');
          toast.warning('You\'re offline - limited functionality available');
        } else {
          toast.error('Failed to load workouts');
        }
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();

    // Listen for online/offline changes
    const handleOnline = async () => {
      setOfflineStatus(prev => ({ ...prev, isOffline: false }));
      toast.success('Back online! Syncing data...');
      
      try {
        const syncResult = await workoutService.syncOfflineData();
        if (syncResult.success && syncResult.message !== 'No data to sync') {
          toast.success(syncResult.message);
          // Reload workouts after sync
          loadWorkouts();
        }
      } catch (err) {
        toast.error('Failed to sync offline data');
      }
    };

    const handleOffline = () => {
      setOfflineStatus(prev => ({ ...prev, isOffline: true }));
      toast.warning('You\'re now offline - workouts will be cached locally');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
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

  if (error && workouts.length === 0) {
    return (
      <div className="p-6">
        <FeedbackCard
          type={offlineStatus.isOffline ? "warning" : "error"}
          title={offlineStatus.isOffline ? "Offline Mode" : "Failed to load workouts"}
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
          message={offlineStatus.isOffline ? "No cached workouts found" : "Create your first workout to get started"}
          iconName="Dumbbell"
          className="py-12"
        />
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden">
      {/* Offline Status Banner */}
      {offlineStatus.isOffline && (
        <div className="bg-warning/20 border-l-4 border-warning p-4 mx-6 mt-6 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Text className="text-warning font-medium">Offline Mode</Text>
            </div>
            <div className="ml-3">
              <Text className="text-sm text-warning">
                You're offline. Workouts can still be completed and will sync when reconnected.
                {offlineStatus.pendingSyncItems > 0 && ` (${offlineStatus.pendingSyncItems} items pending sync)`}
              </Text>
            </div>
          </div>
        </div>
      )}

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
          <WorkoutList 
            workouts={filteredWorkouts} 
            isOffline={offlineStatus.isOffline}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default WorkoutsPage;