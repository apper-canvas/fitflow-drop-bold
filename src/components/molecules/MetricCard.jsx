import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const MetricCard = ({ label, value, unit, icon, iconColor, changeValue = 0, changeUnit = '', changeDirectionIcon, className = '', animationDelay = 0 }) => {
  const showChange = changeValue !== 0;
  const changeClasses = changeValue > 0 ? 'text-success' : 'text-error';

  return (
    <div className={`bg-surface rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <Text as="h3" className="text-lg font-medium text-surface400 mb-1">
            {label}
          </Text>
          <div className="flex items-baseline gap-2">
            <Text as="span" className="text-3xl font-bold text-white">
              {value}
            </Text>
            {unit && (
              <Text as="span" className="text-surface400">
                {unit}
              </Text>
            )}
          </div>
          {showChange && (
            <div className={`flex items-center gap-1 mt-2 ${changeClasses}`}>
              {changeDirectionIcon && <ApperIcon name={changeDirectionIcon} size={16} />}
              <Text as="span" className="text-sm font-medium">
                {Math.abs(changeValue)}{changeUnit} from last entry
              </Text>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-full" style={{ backgroundColor: `${iconColor}20` }}>
            <ApperIcon name={icon} size={24} style={{ color: iconColor }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;