import { motion } from 'framer-motion';
import Text from '@/components/atoms/Text';

const ProgressBar = ({ label, currentValue, targetValue, unit, barColorClass = 'gradient-primary', animationDelay = 0.5 }) => {
  const progress = (currentValue / targetValue) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-2">
        <Text as="span" className="text-surface400">{label}</Text>
        <Text as="span" className="text-white">
          {currentValue} / {targetValue} {unit}
        </Text>
      </div>
      <div className="w-full bg-surface600 rounded-full h-3">
        <motion.div
          className={`${barColorClass} h-3 rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 1, delay: animationDelay }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;