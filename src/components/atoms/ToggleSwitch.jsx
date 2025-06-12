import { motion } from 'framer-motion';

const ToggleSwitch = ({ checked, onToggle, className = '' }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`w-12 h-6 rounded-full transition-all flex items-center ${checked ? 'bg-primary' : 'bg-surface600'} ${className}`}
    >
      <motion.div
        className="w-5 h-5 bg-white rounded-full shadow-sm"
        animate={{ x: checked ? 26 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );
};

export default ToggleSwitch;