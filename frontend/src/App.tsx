import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Home, User, MessageCircle, PlusSquare, Trophy, Sparkles } from 'lucide-react';

const Auth = lazy(() => import('./pages/Auth'));
const Feed = lazy(() => import('./pages/Feed'));
const Profile = lazy(() => import('./pages/Profile'));
const Groups = lazy(() => import('./pages/Groups'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const Settings = lazy(() => import('./pages/Settings'));
const Comments = lazy(() => import('./pages/Comments'));
const StoryViewer = lazy(() => import('./pages/StoryViewer'));
const Create = lazy(() => import('./pages/Create'));
const Missions = lazy(() => import('./pages/Missions'));
const ChallengeMaker = lazy(() => import('./pages/ChallengeMaker'));
const SplashScreen = lazy(() => import('./components/SplashScreen'));
const PositorySelectionScreen = lazy(() => import('./components/PositorySelectionScreen'));
const AkbnisAuthScreen = lazy(() => import('./components/AkbnisAuthScreen'));

type EntryStage = 'splash' | 'transition' | 'pository' | 'akbnisAuth';
type TargetEntryStage = Exclude<EntryStage, 'transition'>;

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

const entryVariants = {
  initial: { opacity: 0, y: 18, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -14, scale: 1.01 },
};

function AppLoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="rounded-2xl border border-gray-100 bg-white/90 px-5 py-4 text-sm font-medium text-gray-500 shadow-sm">
        Optimizing experience...
      </div>
    </div>
  );
}

function EntryTransitionCard({ label }: { label: string }) {
  return (
    <motion.div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fdfbff] px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-primary-100/70 via-pink-100/35 to-transparent blur-3xl" />
      </div>
      <motion.div
        className="relative z-10 flex flex-col items-center gap-3 rounded-3xl border border-white/75 bg-white/65 px-8 py-7 backdrop-blur-xl"
        initial={{ y: 16, opacity: 0, scale: 0.94 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -12, opacity: 0, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        <motion.div
          animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.06, 0.98, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
          className="rounded-2xl bg-gradient-to-br from-primary-500 to-pink-500 p-3 text-white shadow-[0_16px_36px_rgba(236,72,153,0.3)]"
        >
          <Sparkles size={20} />
        </motion.div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-500">Looply</p>
        <p className="text-sm font-medium text-gray-600">{label}</p>
      </motion.div>
    </motion.div>
  );
}

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
  const [entryStage, setEntryStage] = useState<EntryStage>('splash');
  const [nextStage, setNextStage] = useState<TargetEntryStage | null>(null);
  const [minSplashElapsed, setMinSplashElapsed] = useState(false);
  const [appReady, setAppReady] = useState(false);

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
      if (!cancelled) setAppReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (entryStage !== 'splash') return;
    if (minSplashElapsed && appReady) {
      setNextStage('pository');
      setEntryStage('transition');
    }
  }, [appReady, entryStage, minSplashElapsed]);

  useEffect(() => {
    if (entryStage !== 'transition' || !nextStage) return;

    const transitionTimer = window.setTimeout(() => {
      setEntryStage(nextStage);
      setNextStage(null);
    }, 380);

    return () => window.clearTimeout(transitionTimer);
  }, [entryStage, nextStage]);

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

  if (!isAuthenticated) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={`${entryStage}-${nextStage ?? 'none'}`}
          variants={entryVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: 'spring', stiffness: 210, damping: 24, mass: 0.9 }}
          className="min-h-screen"
        >
          <Suspense fallback={<AppLoadingFallback />}>
            {entryStage === 'splash' && <SplashScreen />}
            {entryStage === 'transition' && (
              <EntryTransitionCard label={nextStage === 'akbnisAuth' ? 'Preparing AKBNISPOSITORY access...' : 'Loading available Positories...'} />
            )}
            {entryStage === 'pository' && (
              <PositorySelectionScreen
                onContinueAkbnis={() => {
                  setNextStage('akbnisAuth');
                  setEntryStage('transition');
                }}
              />
            )}
            {entryStage === 'akbnisAuth' && <AkbnisAuthScreen />}
            {!['splash', 'transition', 'pository', 'akbnisAuth'].includes(entryStage) && <Auth />}
          </Suspense>
        </motion.div>
      </AnimatePresence>
    );
  }

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

  const hideBottomNav = useMemo(
    () => ['editProfile', 'userProfile', 'settings', 'comments', 'challengeMaker'].includes(currentPage)
      || storyViewerOpen
      || (currentPage === 'groups' && (Boolean(activeDirectThreadId) || Boolean(activeGroupChatId))),
    [activeDirectThreadId, activeGroupChatId, currentPage, storyViewerOpen],
  );

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
          <Suspense fallback={<AppLoadingFallback />}>
            {renderPage()}
          </Suspense>
        </motion.div>
      </AnimatePresence>

      {storyViewerOpen && (
        <div className="fixed inset-0 z-[70]">
          <Suspense fallback={<AppLoadingFallback />}>
            <StoryViewer />
          </Suspense>
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
