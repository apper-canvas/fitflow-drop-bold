import Dashboard from '../pages/Dashboard';
import Workouts from '../pages/Workouts';
import Meals from '../pages/Meals';
import Progress from '../pages/Progress';
import Settings from '../pages/Settings';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  workouts: {
    id: 'workouts',
    label: 'Workouts',
    path: '/workouts',
    icon: 'Dumbbell',
    component: Workouts
  },
  meals: {
    id: 'meals',
    label: 'Meals',
    path: '/meals',
    icon: 'Apple',
    component: Meals
  },
  progress: {
    id: 'progress',
    label: 'Progress',
    path: '/progress',
    icon: 'TrendingUp',
    component: Progress
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
};

export const routeArray = Object.values(routes);