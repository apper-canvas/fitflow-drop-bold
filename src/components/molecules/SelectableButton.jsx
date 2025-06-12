import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const SelectableButton = ({ label, icon, isSelected, onClick }) => {
  return (
    <Button
      onClick={onClick}
      className={`p-3 rounded-lg border-2 transition-all text-center ${
        isSelected
          ? 'border-primary bg-primary/20 text-primary'
          : 'border-surface500 text-surface400 hover:border-primary'
      }`}
    >
      {icon && <ApperIcon name={icon} size={16} className="mx-auto mb-1" />}
      <Text className="text-xs font-medium">{label}</Text>
    </Button>
  );
};

export default SelectableButton;