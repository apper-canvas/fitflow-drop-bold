import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import userService from '../services/api/userService';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    height: '',
    targetWeight: '',
    fitnessLevel: 'beginner'
  });

  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    mealReminders: true,
    progressUpdates: true,
    weeklyReports: false
  });

  const fitnessLevels = [
    { value: 'beginner', label: 'Beginner', icon: 'User' },
    { value: 'intermediate', label: 'Intermediate', icon: 'Users' },
    { value: 'advanced', label: 'Advanced', icon: 'Crown' }
  ];

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const users = await userService.getAll();
        const userData = users[0] || null;
        
        if (userData) {
          setUser(userData);
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            height: userData.height || '',
            targetWeight: userData.targetWeight || '',
            fitnessLevel: userData.fitnessLevel || 'beginner'
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to load user data');
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleProfileSave = async () => {
    try {
      let updatedUser;
      
      if (user) {
        updatedUser = await userService.update(user.id, { ...user, ...formData });
      } else {
        updatedUser = await userService.create({
          id: Date.now().toString(),
          ...formData,
          goals: ['Weight Loss', 'Muscle Gain'],
          dietaryRestrictions: []
        });
      }
      
      setUser(updatedUser);
      setEditingProfile(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success('Notification settings updated');
  };

  const settingSections = [
    {
      title: 'Profile',
      icon: 'User',
      items: [
        { label: 'Edit Profile', icon: 'Edit', action: () => setEditingProfile(true) },
        { label: 'Goals & Preferences', icon: 'Target', action: () => toast.info('Coming soon!') },
        { label: 'Dietary Restrictions', icon: 'Apple', action: () => toast.info('Coming soon!') }
      ]
    },
    {
      title: 'App Settings',
      icon: 'Settings',
      items: [
        { label: 'Units', icon: 'Ruler', action: () => toast.info('Coming soon!') },
        { label: 'Theme', icon: 'Palette', action: () => toast.info('Coming soon!') },
        { label: 'Language', icon: 'Globe', action: () => toast.info('Coming soon!') }
      ]
    },
    {
      title: 'Data & Privacy',
      icon: 'Shield',
      items: [
        { label: 'Export Data', icon: 'Download', action: () => toast.info('Coming soon!') },
        { label: 'Privacy Policy', icon: 'FileText', action: () => toast.info('Coming soon!') },
        { label: 'Terms of Service', icon: 'Scroll', action: () => toast.info('Coming soon!') }
      ]
    },
    {
      title: 'Support',
      icon: 'HelpCircle',
      items: [
        { label: 'Help Center', icon: 'BookOpen', action: () => toast.info('Coming soon!') },
        { label: 'Contact Support', icon: 'MessageCircle', action: () => toast.info('Coming soon!') },
        { label: 'Rate App', icon: 'Star', action: () => toast.info('Coming soon!') }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface rounded w-1/2"></div>
          <div className="h-32 bg-surface rounded"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-surface rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-display-md font-display text-white mb-2">
            Settings
          </h1>
          <p className="text-surface400">Manage your app preferences</p>
        </motion.div>
      </div>

      <div className="p-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-surface rounded-xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading text-white">Your Profile</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditingProfile(true)}
              className="text-primary hover:text-primary/80"
            >
              <ApperIcon name="Edit" size={20} />
            </motion.button>
          </div>
          
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white break-words">
                    {user.name || 'Anonymous User'}
                  </h3>
                  <p className="text-surface400 text-sm break-words">
                    {user.email || 'No email set'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">
                    {user.fitnessLevel || 'Not set'}
                  </div>
                  <p className="text-surface400 text-sm">Fitness Level</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-secondary">
                    {user.targetWeight || 'Not set'}
                  </div>
                  <p className="text-surface400 text-sm">Target Weight</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <ApperIcon name="UserPlus" size={32} className="mx-auto mb-2 text-surface400" />
              <p className="text-surface400 mb-4">Set up your profile to get started</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditingProfile(true)}
                className="gradient-primary text-white px-4 py-2 rounded-lg font-medium"
              >
                Create Profile
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-surface rounded-xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading text-white">Notifications</h2>
            <ApperIcon name="Bell" size={24} className="text-warning" />
          </div>
          
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium break-words">
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </h4>
                  <p className="text-surface400 text-sm">
                    {key === 'workoutReminders' && 'Get reminded to start your workouts'}
                    {key === 'mealReminders' && 'Reminders to log your meals'}
                    {key === 'progressUpdates' && 'Updates on your fitness progress'}
                    {key === 'weeklyReports' && 'Weekly summary of your activity'}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNotificationToggle(key)}
                  className={`w-12 h-6 rounded-full transition-all ${
                    value ? 'bg-primary' : 'bg-surface600'
                  }`}
                >
                  <motion.div
                    className="w-5 h-5 bg-white rounded-full shadow-sm"
                    animate={{ x: value ? 26 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-4">
          {settingSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + (sectionIndex * 0.1) }}
              className="bg-surface rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <ApperIcon name={section.icon} size={20} className="text-primary" />
                <h3 className="text-lg font-heading text-white">{section.title}</h3>
              </div>
              
              <div className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <motion.button
                    key={item.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-surface600 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <ApperIcon name={item.icon} size={16} className="text-surface400" />
                      <span className="text-white break-words">{item.label}</span>
                    </div>
                    <ApperIcon name="ChevronRight" size={16} className="text-surface400" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editingProfile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setEditingProfile(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-surface rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-heading text-white">Edit Profile</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditingProfile(false)}
                className="text-surface400 hover:text-white"
              >
                <ApperIcon name="X" size={20} />
              </motion.button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface400 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-surface600 border border-surface500 rounded-lg px-4 py-2 text-white placeholder-surface400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-surface600 border border-surface500 rounded-lg px-4 py-2 text-white placeholder-surface400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface400 mb-2">
                  Height (inches)
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                  className="w-full bg-surface600 border border-surface500 rounded-lg px-4 py-2 text-white placeholder-surface400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your height"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface400 mb-2">
                  Target Weight (lbs)
                </label>
                <input
                  type="number"
                  value={formData.targetWeight}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetWeight: e.target.value }))}
                  className="w-full bg-surface600 border border-surface500 rounded-lg px-4 py-2 text-white placeholder-surface400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your target weight"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface400 mb-2">
                  Fitness Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {fitnessLevels.map((level) => (
                    <motion.button
                      key={level.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFormData(prev => ({ ...prev, fitnessLevel: level.value }))}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        formData.fitnessLevel === level.value
                          ? 'border-primary bg-primary/20 text-primary'
                          : 'border-surface500 text-surface400 hover:border-primary'
                      }`}
                    >
                      <ApperIcon name={level.icon} size={16} className="mx-auto mb-1" />
                      <div className="text-xs font-medium">{level.label}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditingProfile(false)}
                className="flex-1 bg-surface600 text-white p-3 rounded-lg font-medium"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleProfileSave}
                className="flex-1 gradient-primary text-white p-3 rounded-lg font-medium"
              >
                Save Changes
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Settings;