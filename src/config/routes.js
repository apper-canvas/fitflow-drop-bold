import HomePage from '@/components/pages/HomePage';
import WorkoutsPage from '@/components/pages/WorkoutsPage';
import MealsPage from '@/components/pages/MealsPage';
import ProgressPage from '@/components/pages/ProgressPage';
import SettingsPage from '@/components/pages/SettingsPage';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
component: HomePage
  },
  workouts: {
    id: 'workouts',
    label: 'Workouts',
    path: '/workouts',
    icon: 'Dumbbell',
component: WorkoutsPage
  },
  meals: {
    id: 'meals',
    label: 'Meals',
    path: '/meals',
    icon: 'Apple',
component: MealsPage
  },
  progress: {
    id: 'progress',
    label: 'Progress',
    path: '/progress',
    icon: 'TrendingUp',
component: ProgressPage
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
component: SettingsPage
  }
};

export const routeArray = Object.values(routes);