import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';

const WeightLogger = ({ newWeight, onWeightChange, onLogWeight }) => {
  return (
    <div className="bg-surface rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <Text as="h2" className="text-xl font-heading text-white">Log Weight</Text>
        <ApperIcon name="Scale" size={24} className="text-primary" />
      </div>
      
      <div className="flex gap-3">
        <Input
          type="number"
          value={newWeight}
          onChange={onWeightChange}
          placeholder="Enter weight"
          className="flex-1"
        />
        <Button
          onClick={onLogWeight}
          className="gradient-primary px-6 py-2 rounded-lg text-white font-medium"
        >
          Log
        </Button>
      </div>
    </div>
  );
};

export default WeightLogger;