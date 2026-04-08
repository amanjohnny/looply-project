import { useAppStore } from './store/useAppStore';
import { AnimatePresence, motion } from 'framer-motion';

// Pages
import Auth from './pages/Auth';
import Feed from './pages/Feed';
import Cases from './pages/Cases';
import Profile from './pages/Profile';
import Challenges from './pages/Challenges';
import Groups from './pages/Groups';
import UserProfile from './pages/UserProfile';
import EditProfile from './pages/EditProfile';

// Icons
import { Home, Box, User, List, Users } from 'lucide-react';

const navItems = [
  { id: 'feed', icon: Home, label: 'Home' },
  { id: 'challenges', icon: List, label: 'Tasks' },
  { id: 'cases', icon: Box, label: 'Cases' },
  { id: 'groups', icon: Users, label: 'Groups' },
  { id: 'profile', icon: User, label: 'Profile' },
];

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

function App() {
  const { currentPage, isAuthenticated, setCurrentPage } = useAppStore();

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <Auth />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'feed':
        return <Feed />;
      case 'challenges':
        return <Challenges />;
      case 'cases':
        return <Cases />;
      case 'groups':
        return <Groups />;
      case 'profile':
        return <Profile />;
      case 'userProfile':
        return <UserProfile />;
      case 'editProfile':
        return <EditProfile />;
      default:
        return <Feed />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content with Page Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="min-h-screen"
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-50 safe-area-bottom">
        <div className="flex justify-around items-center max-w-md mx-auto px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`relative flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-200 ${
                  isActive 
                    ? 'text-primary-500' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-primary-100 rounded-2xl"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon 
                  size={22} 
                  className={`relative z-10 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} 
                />
                <span className="text-[10px] relative z-10 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default App;
