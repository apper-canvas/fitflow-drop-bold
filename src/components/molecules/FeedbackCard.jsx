import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const FeedbackCard = ({ type, title, message, onAction, actionLabel, iconName }) => {
  const baseClasses = 'rounded-xl p-6 text-center';
  let dynamicClasses = '';
  let iconColorClass = '';

  switch (type) {
    case 'error':
      dynamicClasses = 'bg-error/20 border border-error';
      iconColorClass = 'text-error';
      iconName = iconName || 'AlertCircle';
      break;
    case 'empty':
      dynamicClasses = 'bg-surface rounded-xl';
      iconColorClass = 'text-surface400';
      iconName = iconName || 'Info';
      break;
    case 'loading':
      dynamicClasses = 'bg-surface rounded-xl'; // Animation will be handled by SkeletonLoader
      iconName = iconName || 'Loader'; // Placeholder, animation handled separately
      break;
    default:
      dynamicClasses = 'bg-surface/20 border border-surface';
      iconColorClass = 'text-surface400';
      iconName = iconName || 'Info';
  }

  return (
    <div className={`${baseClasses} ${dynamicClasses}`}>
      {type === 'loading' ? (
         <div className="animate-pulse space-y-4">
            <div className="h-8 bg-surface rounded w-1/2 mx-auto"></div>
            <div className="h-20 bg-surface rounded"></div>
            <div className="h-10 bg-surface rounded w-1/3 mx-auto"></div>
         </div>
      ) : (
        <>
          {iconName && <ApperIcon name={iconName} size={32} className={`mx-auto mb-2 ${iconColorClass}`} />}
          <Text as="h3" className={`text-lg font-medium mb-2 ${type === 'error' ? 'text-error' : 'text-white'}`}>
            {title}
          </Text>
          <Text className={`${type === 'error' ? 'text-error/80' : 'text-surface400'} mb-4`}>
            {message}
          </Text>
          {onAction && actionLabel && (
            <Button
              onClick={onAction}
              className={`${type === 'error' ? 'bg-error' : 'gradient-primary'} text-white px-4 py-2 rounded-lg font-medium`}
            >
              {actionLabel}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default FeedbackCard;