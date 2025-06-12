import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import ToggleSwitch from '@/components/atoms/ToggleSwitch';

const NotificationSettings = ({ notifications, onToggle }) => {
  const notificationDescriptions = {
    workoutReminders: 'Get reminded to start your workouts',
    mealReminders: 'Reminders to log your meals',
    progressUpdates: 'Updates on your fitness progress',
    weeklyReports: 'Weekly summary of your activity'
  };

  return (
    <div className="bg-surface rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <Text as="h2" className="text-xl font-heading text-white">Notifications</Text>
        <ApperIcon name="Bell" size={24} className="text-warning" />
      </div>
      
      <div className="space-y-4">
        {Object.entries(notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <Text as="h4" className="text-white font-medium break-words">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </Text>
              <Text className="text-surface400 text-sm">
                {notificationDescriptions[key]}
              </Text>
            </div>
            <ToggleSwitch checked={value} onToggle={() => onToggle(key)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSettings;