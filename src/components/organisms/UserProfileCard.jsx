import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const UserProfileCard = ({ user, onEditProfile }) => {
  return (
    <div className="bg-surface rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <Text as="h2" className="text-xl font-heading text-white">Your Profile</Text>
        <Button onClick={onEditProfile} className="text-primary hover:text-primary/80">
          <ApperIcon name="Edit" size={20} />
        </Button>
      </div>
      
      {user ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={20} className="text-white" />
            </div>
            <div>
              <Text as="h3" className="text-lg font-medium text-white break-words">
                {user.name || 'Anonymous User'}
              </Text>
              <Text className="text-surface400 text-sm break-words">
                {user.email || 'No email set'}
              </Text>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <Text as="div" className="text-lg font-bold text-primary">
                {user.fitnessLevel || 'Not set'}
              </Text>
              <Text className="text-surface400 text-sm">Fitness Level</Text>
            </div>
            <div className="text-center">
              <Text as="div" className="text-lg font-bold text-secondary">
                {user.targetWeight || 'Not set'}
              </Text>
              <Text className="text-surface400 text-sm">Target Weight</Text>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <ApperIcon name="UserPlus" size={32} className="mx-auto mb-2 text-surface400" />
          <Text className="text-surface400 mb-4">Set up your profile to get started</Text>
          <Button onClick={onEditProfile} className="gradient-primary text-white px-4 py-2 rounded-lg font-medium">
            Create Profile
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserProfileCard;