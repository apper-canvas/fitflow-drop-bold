import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Text from '@/components/atoms/Text';
import CategoryFilter from '@/components/molecules/CategoryFilter';
import MetricCard from '@/components/molecules/MetricCard';
import FeedbackCard from '@/components/molecules/FeedbackCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import WeightLogger from '@/components/organisms/WeightLogger';
import MetricTrendChart from '@/components/organisms/MetricTrendChart';
import AchievementsSection from '@/components/organisms/AchievementsSection';
import progressService from '@/services/api/progressService';

const ProgressPage = () => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('weight');
  const [newWeight, setNewWeight] = useState('');

  const metrics = [
    { id: 'weight', label: 'Weight', icon: 'Scale', unit: 'lbs', color: '#6366F1' },
    { id: 'workouts', label: 'Workouts', icon: 'Dumbbell', unit: '', color: '#8B5CF6' },
    { id: 'calories', label: 'Calories Burned', icon: 'Flame', unit: 'cal', color: '#EC4899' }
  ];

  useEffect(() => {
    const loadProgress = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await progressService.getAll();
        setProgressData(result);
      } catch (err) {
        setError(err.message || 'Failed to load progress data');
        toast.error('Failed to load progress data');
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
}, []);

  const handleLogWeight = async () => {
    if (!newWeight || isNaN(parseFloat(newWeight))) {
      toast.error('Please enter a valid weight');
      return;
    }

    try {
      const newEntry = {
        Name: `Weight Entry ${new Date().toLocaleDateString()}`,
        date: new Date().toISOString(),
        weight: parseFloat(newWeight),
        workouts_completed: 0,
        calories_burned: 0,
        calories_consumed: 0
      };

      const createdEntry = await progressService.create(newEntry);
      setProgressData(prev => [createdEntry, ...prev]);
      setNewWeight('');
      toast.success('Weight logged successfully!');
    } catch (error) {
      toast.error('Failed to log weight');
    }
  };

  const getCurrentValue = () => {
    if (progressData.length === 0) return 0;
    
    const latest = progressData[0];
    switch (selectedMetric) {
      case 'weight':
        return latest.weight || 0;
      case 'workouts':
        return latest.workouts_completed || 0;
      case 'calories':
        return latest.calories_burned || 0;
      default:
        return 0;
    }
  };

  const getChangeFromPrevious = () => {
    if (progressData.length < 2) return 0;
    
    const [current, previous] = progressData;
    let currentVal = 0, previousVal = 0;
    
    switch (selectedMetric) {
      case 'weight':
        currentVal = current.weight || 0;
        previousVal = previous.weight || 0;
        break;
      case 'workouts':
        currentVal = current.workouts_completed || 0;
        previousVal = previous.workouts_completed || 0;
        break;
      case 'calories':
        currentVal = current.calories_burned || 0;
        previousVal = previous.calories_burned || 0;
        break;
    }
    
    return currentVal - previousVal;
  };

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonLoader>
          <div className="h-8 bg-surface rounded w-1/2"></div>
          <div className="h-32 bg-surface rounded"></div>
          <div className="h-64 bg-surface rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-surface rounded"></div>
            <div className="h-24 bg-surface rounded"></div>
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
          title="Failed to load progress"
          message={error}
          onAction={() => window.location.reload()}
          actionLabel="Try Again"
        />
      </div>
    );
  }

  const currentMetric = metrics.find(m => m.id === selectedMetric);
  const currentValue = getCurrentValue();
  const change = getChangeFromPrevious();

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
            Progress
          </Text>
          <Text className="text-surface400">Track your fitness journey</Text>
        </motion.div>
      </div>

      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <WeightLogger 
            newWeight={newWeight} 
            onWeightChange={(e) => setNewWeight(e.target.value)} 
            onLogWeight={handleLogWeight} 
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CategoryFilter 
            categories={metrics}
            selectedCategory={selectedMetric}
            onSelectCategory={setSelectedMetric}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <MetricCard
            label={`Current ${currentMetric?.label}`}
            value={currentValue}
            unit={currentMetric?.unit}
            icon={currentMetric?.icon}
            iconColor={currentMetric?.color}
            changeValue={change}
            changeUnit={currentMetric?.unit}
            changeDirectionIcon={change > 0 ? 'TrendingUp' : 'TrendingDown'}
          />
        </motion.div>

        <MetricTrendChart 
          progressData={progressData} 
          selectedMetric={selectedMetric} 
          metrics={metrics} 
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <AchievementsSection progressData={progressData} />
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressPage;