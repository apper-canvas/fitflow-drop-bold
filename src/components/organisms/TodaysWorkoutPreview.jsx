import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const TodaysWorkoutPreview = ({ workout }) => {
  return (
    <div className="bg-surface rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <Text as="h2" className="text-xl font-heading text-white">Today's Workout</Text>
        <ApperIcon name="Dumbbell" size={24} className="text-primary" />
      </div>
      
      {workout ? (
        <div>
          <Text as="h3" className="text-lg font-medium text-white mb-2">
            {workout.name}
          </Text>
          <div className="flex items-center gap-4 text-surface400 text-sm mb-4">
            <span className="flex items-center gap-1">
              <ApperIcon name="Clock" size={16} />
              {workout.duration} min
            </span>
            <span className="flex items-center gap-1">
              <ApperIcon name="Zap" size={16} />
              {workout.difficulty}
            </span>
          </div>
          <div className="flex gap-2">
            {workout.targetMuscles?.map((muscle, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <ApperIcon name="Calendar" size={32} className="mx-auto mb-2 text-surface400" />
          <Text className="text-surface400">No workout scheduled for today</Text>
        </div>
      )}
    </div>
  );
};

export default TodaysWorkoutPreview;