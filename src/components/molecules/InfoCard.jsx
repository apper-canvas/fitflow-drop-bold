import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const InfoCard = ({ title, description, iconName, iconColor, onClick, className = '', animationDelay = 0, ...props }) => {
  const isClickable = !!onClick;
  const Wrapper = isClickable ? Button : motion.div;

  const wrapperProps = isClickable
    ? {
        onClick,
        className: `${className} p-6 rounded-xl text-left ${isClickable ? 'cursor-pointer transition-all' : ''}`,
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: animationDelay },
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        ...props,
      }
    : {
        className: `${className} p-6 rounded-xl ${isClickable ? 'cursor-pointer transition-all' : ''}`,
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: animationDelay },
        ...props,
      };

  return (
    <Wrapper {...wrapperProps}>
      <div className="flex items-center justify-between">
        <div>
          <Text as="h3" className="font-heading text-lg text-white">
            {title}
          </Text>
          <Text className="text-white/80 text-sm">
            {description}
          </Text>
        </div>
        {iconName && <ApperIcon name={iconName} size={24} className={iconColor || 'text-white'} />}
      </div>
    </Wrapper>
  );
};

export default InfoCard;