import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Text from '@/components/atoms/Text';
import FeedbackCard from '@/components/molecules/FeedbackCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import UserProfileCard from '@/components/organisms/UserProfileCard';
import NotificationSettings from '@/components/organisms/NotificationSettings';
import SettingsSectionList from '@/components/organisms/SettingsSectionList';
import EditProfileModal from '@/components/organisms/EditProfileModal';
import userService from '@/services/api/userService';

const SettingsPage = () => {
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
        <SkeletonLoader>
          <div className="h-8 bg-surface rounded w-1/2"></div>
          <div className="h-32 bg-surface rounded"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-surface rounded"></div>
            ))}
          </div>
        </SkeletonLoader>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <FeedbackCard
          type="error"
          title="Failed to load settings"
          message={error}
          onAction={() => window.location.reload()}
          actionLabel="Try Again"
        />
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
          <Text as="h1" className="text-display-md font-display text-white mb-2">
            Settings
          </Text>
          <Text className="text-surface400">Manage your app preferences</Text>
        </motion.div>
      </div>

      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <UserProfileCard user={user} onEditProfile={() => setEditingProfile(true)} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <NotificationSettings notifications={notifications} onToggle={handleNotificationToggle} />
        </motion.div>

        <SettingsSectionList sections={settingSections} />
      </div>

      <EditProfileModal
        isOpen={editingProfile}
        onClose={() => setEditingProfile(false)}
        formData={formData}
        setFormData={setFormData}
        onSave={handleProfileSave}
        fitnessLevels={fitnessLevels}
      />
    </div>
  );
};

export default SettingsPage;