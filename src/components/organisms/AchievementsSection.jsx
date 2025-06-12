import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const AchievementsSection = ({ progressData }) => {
  const totalWorkouts = progressData.reduce((sum, entry) => sum + (entry.workoutsCompleted || 0), 0);
  const totalCaloriesBurned = progressData.reduce((sum, entry) => sum + (entry.caloriesBurned || 0), 0);

  return (
    <div className="bg-surface rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <Text as="h3" className="text-xl font-heading text-white">Achievements</Text>
        <ApperIcon name="Trophy" size={24} className="text-warning" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface600 rounded-lg p-4 text-center">
          <ApperIcon name="Target" size={24} className="mx-auto mb-2 text-primary" />
          <Text as="div" className="text-lg font-bold text-white">
            {totalWorkouts}
          </Text>
          <Text className="text-surface400 text-sm">Total Workouts</Text>
        </div>
        
        <div className="bg-surface600 rounded-lg p-4 text-center">
          <ApperIcon name="Flame" size={24} className="mx-auto mb-2 text-accent" />
          <Text as="div" className="text-lg font-bold text-white">
            {totalCaloriesBurned}
          </Text>
          <Text className="text-surface400 text-sm">Calories Burned</Text>
        </div>
      </div>
    </div>
  );
};

export default AchievementsSection;