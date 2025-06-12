import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';
import ApperIcon from '../components/ApperIcon';
import progressService from '../services/api/progressService';

const Progress = () => {
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

  const logWeight = async () => {
    if (!newWeight || isNaN(newWeight)) {
      toast.error('Please enter a valid weight');
      return;
    }

    try {
      const newEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        weight: parseFloat(newWeight),
        workoutsCompleted: 0,
        caloriesBurned: 0,
        caloriesConsumed: 0,
        measurements: {}
      };

      await progressService.create(newEntry);
      setProgressData(prev => [newEntry, ...prev]);
      setNewWeight('');
      toast.success('Weight logged successfully!');
    } catch (error) {
      toast.error('Failed to log weight');
    }
  };

  const getChartData = () => {
    const sortedData = [...progressData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const dates = sortedData.map(entry => 
      new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );

    let values = [];
    let color = '#6366F1';

    switch (selectedMetric) {
      case 'weight':
        values = sortedData.map(entry => entry.weight || 0);
        color = '#6366F1';
        break;
      case 'workouts':
        values = sortedData.map(entry => entry.workoutsCompleted || 0);
        color = '#8B5CF6';
        break;
      case 'calories':
        values = sortedData.map(entry => entry.caloriesBurned || 0);
        color = '#EC4899';
        break;
      default:
        values = sortedData.map(entry => entry.weight || 0);
    }

    return {
      series: [{
        name: metrics.find(m => m.id === selectedMetric)?.label || 'Value',
        data: values
      }],
      options: {
        chart: {
          type: 'area',
          height: 350,
          background: 'transparent',
          toolbar: { show: false }
        },
        theme: { mode: 'dark' },
        colors: [color],
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 100]
          }
        },
        dataLabels: { enabled: false },
        stroke: {
          curve: 'smooth',
          width: 3
        },
        xaxis: {
          categories: dates,
          labels: {
            style: { colors: '#94a3b8' }
          },
          axisBorder: { show: false },
          axisTicks: { show: false }
        },
        yaxis: {
          labels: {
            style: { colors: '#94a3b8' }
          }
        },
        grid: {
          borderColor: '#334155',
          strokeDashArray: 3
        },
        tooltip: {
          theme: 'dark',
          y: {
            formatter: (value) => {
              const unit = metrics.find(m => m.id === selectedMetric)?.unit || '';
              return `${value}${unit}`;
            }
          }
        }
      }
    };
  };

  const getCurrentValue = () => {
    if (progressData.length === 0) return 0;
    
    const latest = progressData[0];
    switch (selectedMetric) {
      case 'weight':
        return latest.weight || 0;
      case 'workouts':
        return latest.workoutsCompleted || 0;
      case 'calories':
        return latest.caloriesBurned || 0;
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
        currentVal = current.workoutsCompleted || 0;
        previousVal = previous.workoutsCompleted || 0;
        break;
      case 'calories':
        currentVal = current.caloriesBurned || 0;
        previousVal = previous.caloriesBurned || 0;
        break;
    }
    
    return currentVal - previousVal;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface rounded w-1/2"></div>
          <div className="h-32 bg-surface rounded"></div>
          <div className="h-64 bg-surface rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-surface rounded"></div>
            <div className="h-24 bg-surface rounded"></div>
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
          <h3 className="text-lg font-medium text-error mb-2">Failed to load progress</h3>
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
          <h1 className="text-display-md font-display text-white mb-2">
            Progress
          </h1>
          <p className="text-surface400">Track your fitness journey</p>
        </motion.div>
      </div>

      {/* Quick Log Weight */}
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-surface rounded-xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading text-white">Log Weight</h2>
            <ApperIcon name="Scale" size={24} className="text-primary" />
          </div>
          
          <div className="flex gap-3">
            <input
              type="number"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="Enter weight"
              className="flex-1 bg-surface600 border border-surface500 rounded-lg px-4 py-2 text-white placeholder-surface400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logWeight}
              className="gradient-primary px-6 py-2 rounded-lg text-white font-medium"
            >
              Log
            </motion.button>
          </div>
        </motion.div>

        {/* Metric Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6"
        >
          {metrics.map((metric) => (
            <motion.button
              key={metric.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMetric(metric.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedMetric === metric.id
                  ? 'gradient-primary text-white'
                  : 'bg-surface text-surface400 hover:text-white'
              }`}
            >
              <ApperIcon name={metric.icon} size={16} />
              {metric.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Current Value Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-surface rounded-xl p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-surface400 mb-1">
                Current {currentMetric?.label}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">
                  {currentValue}
                </span>
                <span className="text-surface400">
                  {currentMetric?.unit}
                </span>
              </div>
              {change !== 0 && (
                <div className={`flex items-center gap-1 mt-2 ${
                  change > 0 ? 'text-success' : 'text-error'
                }`}>
                  <ApperIcon 
                    name={change > 0 ? 'TrendingUp' : 'TrendingDown'} 
                    size={16} 
                  />
                  <span className="text-sm font-medium">
                    {Math.abs(change)}{currentMetric?.unit} from last entry
                  </span>
                </div>
              )}
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: `${currentMetric?.color}20` }}>
              <ApperIcon 
                name={currentMetric?.icon || 'Scale'} 
                size={24} 
                style={{ color: currentMetric?.color }}
              />
            </div>
          </div>
        </motion.div>

        {/* Chart */}
        {progressData.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-surface rounded-xl p-6 mb-6"
          >
            <h3 className="text-xl font-heading text-white mb-4">
              {currentMetric?.label} Trend
            </h3>
            <Chart
              options={getChartData().options}
              series={getChartData().series}
              type="area"
              height={300}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-surface rounded-xl p-6 mb-6 text-center"
          >
            <ApperIcon name="TrendingUp" className="w-16 h-16 text-surface400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No progress data yet</h3>
            <p className="text-surface400">Start logging your progress to see trends</p>
          </motion.div>
        )}

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-surface rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-heading text-white">Achievements</h3>
            <ApperIcon name="Trophy" size={24} className="text-warning" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface600 rounded-lg p-4 text-center">
              <ApperIcon name="Target" size={24} className="mx-auto mb-2 text-primary" />
              <div className="text-lg font-bold text-white">
                {progressData.reduce((sum, entry) => sum + (entry.workoutsCompleted || 0), 0)}
              </div>
              <p className="text-surface400 text-sm">Total Workouts</p>
            </div>
            
            <div className="bg-surface600 rounded-lg p-4 text-center">
              <ApperIcon name="Flame" size={24} className="mx-auto mb-2 text-accent" />
              <div className="text-lg font-bold text-white">
                {progressData.reduce((sum, entry) => sum + (entry.caloriesBurned || 0), 0)}
              </div>
              <p className="text-surface400 text-sm">Calories Burned</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Progress;