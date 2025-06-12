import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const MetricTrendChart = ({ progressData, selectedMetric, metrics, animationDelay = 0.4 }) => {
  const currentMetric = metrics.find(m => m.id === selectedMetric);

  const getChartData = () => {
    const sortedData = [...progressData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const dates = sortedData.map(entry => 
      new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );

    let values = [];
    let color = '#6366F1'; // Default for weight

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
        name: currentMetric?.label || 'Value',
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
              const unit = currentMetric?.unit || '';
              return `${value}${unit}`;
            }
          }
        }
      }
    };
  };

  if (progressData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: animationDelay }}
        className="bg-surface rounded-xl p-6 mb-6 text-center"
      >
        <ApperIcon name="TrendingUp" className="w-16 h-16 text-surface400 mx-auto mb-4" />
        <Text as="h3" className="text-lg font-medium text-white mb-2">No progress data yet</Text>
        <Text className="text-surface400">Start logging your progress to see trends</Text>
      </motion.div>
    );
  }

  const chartOptions = getChartData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: animationDelay }}
      className="bg-surface rounded-xl p-6 mb-6"
    >
      <Text as="h3" className="text-xl font-heading text-white mb-4">
        {currentMetric?.label} Trend
      </Text>
      <Chart
        options={chartOptions.options}
        series={chartOptions.series}
        type="area"
        height={300}
      />
    </motion.div>
  );
};

export default MetricTrendChart;