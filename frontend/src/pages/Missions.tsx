import Challenges from './Challenges';
import Cases from './Cases';
import { useAppStore } from '../store/useAppStore';
import { AnimatePresence, motion } from 'framer-motion';

export default function Missions() {
  const {
    missionsTab: tab,
    setMissionsTab,
    setCurrentPage,
  } = useAppStore();

  return (
    <div>
      <div className="max-w-md mx-auto px-4 pt-3 pb-2 sticky top-0 z-50 bg-gray-50/90 backdrop-blur border-b border-gray-100">
        <div className="mb-2 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Missions</h1>
          <button onClick={() => setCurrentPage('challengeMaker')} className="rounded-xl bg-gradient-to-r from-primary-500 to-pink-500 px-3 py-1.5 text-xs font-semibold text-white">Create Challenge</button>
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-gray-100 p-1">
          <button onClick={() => setMissionsTab('tasks')} className={`rounded-xl py-2 text-sm font-semibold ${tab === 'tasks' ? 'bg-white text-gray-900 shadow-soft' : 'text-gray-500'}`}>
            Tasks
          </button>
          <button onClick={() => setMissionsTab('rewards')} className={`rounded-xl py-2 text-sm font-semibold ${tab === 'rewards' ? 'bg-white text-gray-900 shadow-soft' : 'text-gray-500'}`}>
            Rewards
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
          {tab === 'tasks' ? <Challenges /> : <Cases />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
