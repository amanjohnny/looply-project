import { useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { AnimatePresence, motion } from 'framer-motion';

import Auth from './pages/Auth';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Groups from './pages/Groups';
import UserProfile from './pages/UserProfile';
import EditProfile from './pages/EditProfile';
import Settings from './pages/Settings';
import Comments from './pages/Comments';
import StoryViewer from './pages/StoryViewer';
import Create from './pages/Create';
import Missions from './pages/Missions';
import ChallengeMaker from './pages/ChallengeMaker';
import SplashScreen from './components/SplashScreen';
import PositorySelectionScreen from './components/PositorySelectionScreen';
import AkbnisAuthScreen from './components/AkbnisAuthScreen';

import { Home, User, MessageCircle, PlusSquare, Trophy } from 'lucide-react';

const navItems = [
  { id: 'feed', icon: Home, label: 'Feed' },
  { id: 'missions', icon: Trophy, label: 'Missions' },
  { id: 'create', icon: PlusSquare, label: 'Create' },
  { id: 'groups', icon: MessageCircle, label: 'Chats' },
  { id: 'profile', icon: User, label: 'Profile' },
];

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

function App() {
  const {
    currentPage,
    isAuthenticated,
    setCurrentPage,
    storyViewerOpen,
    closeStoryViewer,
    activeDirectThreadId,
    activeGroupChatId,
    closeDirectThread,
    closeGroupChat,
  } = useAppStore();
  const [minSplashElapsed, setMinSplashElapsed] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [selectedPository, setSelectedPository] = useState<string | null>(() => localStorage.getItem('looply.selectedPository'));

  useEffect(() => {
    const splashTimer = window.setTimeout(() => {
      setMinSplashElapsed(true);
    }, 5000);

    return () => window.clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const waitForWindowLoad = document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
        window.addEventListener('load', () => resolve(), { once: true });
      });

    const waitForPaint = new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });

    const waitForFonts = 'fonts' in document ? document.fonts.ready : Promise.resolve();

    Promise.all([waitForWindowLoad, waitForPaint, waitForFonts]).then(() => {
      if (!cancelled) {
        setAppReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const showSplash = !(minSplashElapsed && appReady);

  const handlePositoryContinue = (positoryId: string) => {
    localStorage.setItem('looply.selectedPository', positoryId);
    setSelectedPository(positoryId);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();

      const state = useAppStore.getState();
      if (state.storyViewerOpen) {
        closeStoryViewer();
        return;
      }

      if (state.currentPage === 'groups' && state.activeDirectThreadId) {
        closeDirectThread();
        return;
      }

      if (state.currentPage === 'groups' && state.activeGroupChatId) {
        closeGroupChat();
        return;
      }

      if (state.currentPage === 'editProfile') {
        setCurrentPage('profile');
        return;
      }

      if (state.currentPage === 'userProfile') {
        setCurrentPage(state.activeDirectThreadId || state.activeGroupChatId ? 'groups' : 'feed');
        return;
      }

      if (state.currentPage === 'settings' || state.currentPage === 'comments' || state.currentPage === 'missions' || state.currentPage === 'create' || state.currentPage === 'profile' || state.currentPage === 'groups') {
        setCurrentPage('feed');
        return;
      }

      if (state.currentPage === 'challengeMaker') {
        setCurrentPage('missions');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeDirectThread, closeGroupChat, closeStoryViewer, setCurrentPage]);

  if (showSplash) return <SplashScreen />;

  if (!isAuthenticated && !selectedPository) {
    return <PositorySelectionScreen onContinue={handlePositoryContinue} />;
  }

  if (!isAuthenticated && selectedPository === 'akbnispository') {
    return <AkbnisAuthScreen />;
  }

  if (!isAuthenticated) return <Auth />;

  const renderPage = () => {
    switch (currentPage) {
      case 'feed':
        return <Feed />;
      case 'missions':
        return <Missions />;
      case 'create':
        return <Create />;
      case 'groups':
        return <Groups />;
      case 'profile':
        return <Profile />;
      case 'userProfile':
        return <UserProfile />;
      case 'editProfile':
        return <EditProfile />;
      case 'settings':
        return <Settings />;
      case 'comments':
        return <Comments />;
      case 'challengeMaker':
        return <ChallengeMaker />;
      default:
        return <Feed />;
    }
  };

  const hideBottomNav = ['editProfile', 'userProfile', 'settings', 'comments', 'challengeMaker'].includes(currentPage)
    || storyViewerOpen
    || (currentPage === 'groups' && (Boolean(activeDirectThreadId) || Boolean(activeGroupChatId)));

  return (
    <div className="min-h-screen bg-gray-50">
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

      {storyViewerOpen && (
        <div className="fixed inset-0 z-[70]">
          <StoryViewer />
        </div>
      )}

      {!hideBottomNav && <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-50 safe-area-bottom">
        <div className="flex justify-around items-center max-w-md mx-auto px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`relative flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-200 ${isActive ? 'text-primary-500' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-primary-100 rounded-2xl"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon size={22} className={`relative z-10 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[10px] relative z-10 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>}
    </div>
  );
}

export default App;
