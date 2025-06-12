import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import FormField from '@/components/molecules/FormField';
import SelectableButton from '@/components/molecules/SelectableButton';

const EditProfileModal = ({ 
  isOpen, 
  onClose, 
  formData, 
  setFormData, 
  onSave, 
  fitnessLevels 
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <Text as="h3" className="text-xl font-heading text-white">Edit Profile</Text>
          <Button onClick={onClose} className="text-surface400 hover:text-white" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <div className="space-y-4">
          <FormField
            label="Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter your name"
          />
          <FormField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email"
          />
          <FormField
            label="Height (inches)"
            type="number"
            value={formData.height}
            onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
            placeholder="Enter your height"
          />
          <FormField
            label="Target Weight (lbs)"
            type="number"
            value={formData.targetWeight}
            onChange={(e) => setFormData(prev => ({ ...prev, targetWeight: e.target.value }))}
            placeholder="Enter your target weight"
          />

          <div>
            <Text as="label" className="block text-sm font-medium text-surface400 mb-2">
              Fitness Level
            </Text>
            <div className="grid grid-cols-3 gap-2">
              {fitnessLevels.map((level) => (
                <SelectableButton
                  key={level.value}
                  label={level.label}
                  icon={level.icon}
                  isSelected={formData.fitnessLevel === level.value}
                  onClick={() => setFormData(prev => ({ ...prev, fitnessLevel: level.value }))}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={onClose} className="flex-1 bg-surface600 text-white p-3 rounded-lg font-medium">
            Cancel
          </Button>
          <Button onClick={onSave} className="flex-1 gradient-primary text-white p-3 rounded-lg font-medium">
            Save Changes
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditProfileModal;