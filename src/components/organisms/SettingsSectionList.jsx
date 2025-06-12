import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const SettingsSectionList = ({ sections }) => {
  return (
    <div className="space-y-4">
      {sections.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 + (sectionIndex * 0.1) }}
          className="bg-surface rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <ApperIcon name={section.icon} size={20} className="text-primary" />
            <Text as="h3" className="text-lg font-heading text-white">{section.title}</Text>
          </div>
          
          <div className="space-y-2">
            {section.items.map((item) => (
              <Button
                key={item.label}
                onClick={item.action}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-surface600 transition-all text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <ApperIcon name={item.icon} size={16} className="text-surface400" />
                  <Text as="span" className="text-white break-words">{item.label}</Text>
                </div>
                <ApperIcon name="ChevronRight" size={16} className="text-surface400" />
              </Button>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SettingsSectionList;