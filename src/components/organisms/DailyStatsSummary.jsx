import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const DailyStatsSummary = ({ todaysProgress }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="gradient-primary p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <ApperIcon name="Flame" size={24} className="text-white" />
          <div>
            <Text as="div" className="text-2xl font-bold text-white">
              {todaysProgress?.caloriesBurned || 0}
            </Text>
            <Text className="text-white/80 text-sm">Calories Burned</Text>
          </div>
        </div>
      </div>

      <div className="gradient-accent p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <ApperIcon name="Target" size={24} className="text-white" />
          <div>
            <Text as="div" className="text-2xl font-bold text-white">
              {todaysProgress?.workoutsCompleted || 0}
            </Text>
            <Text className="text-white/80 text-sm">Workouts Done</Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyStatsSummary;