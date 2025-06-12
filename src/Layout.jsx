import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from './components/ApperIcon';
import { routeArray } from './config/routes';

const Layout = () => {
  const location = useLocation();
  
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto pb-20">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-surface600 z-40">
        <div className="flex justify-around items-center py-2">
          {routeArray.map((route) => {
            const isActive = location.pathname === route.path;
            
            return (
              <NavLink
                key={route.id}
                to={route.path}
                className="flex flex-col items-center py-2 px-3 min-w-0 flex-1"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center ${
                    isActive ? 'text-primary' : 'text-surface400'
                  }`}
                >
                  <ApperIcon
                    name={route.icon}
                    size={20}
                    className={`transition-colors ${
                      isActive ? 'text-primary' : 'text-surface400'
                    }`}
                  />
                  <span className="text-xs mt-1 font-medium truncate">
                    {route.label}
                  </span>
                </motion.div>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;