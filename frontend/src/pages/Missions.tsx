import Challenges from './Challenges';
import Cases from './Cases';
import { useAppStore } from '../store/useAppStore';

export default function Missions() {
  const { missionsTab: tab, setMissionsTab } = useAppStore();

  return (
    <div>
      <div className="max-w-md mx-auto px-4 pt-3 pb-2 sticky top-0 z-50 bg-gray-50/90 backdrop-blur border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Missions</h1>
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-gray-100 p-1">
          <button onClick={() => setMissionsTab('tasks')} className={`rounded-xl py-2 text-sm font-semibold ${tab === 'tasks' ? 'bg-white text-gray-900 shadow-soft' : 'text-gray-500'}`}>
            Tasks
          </button>
          <button onClick={() => setMissionsTab('rewards')} className={`rounded-xl py-2 text-sm font-semibold ${tab === 'rewards' ? 'bg-white text-gray-900 shadow-soft' : 'text-gray-500'}`}>
            Rewards
          </button>
        </div>
      </div>
      {tab === 'tasks' ? <Challenges /> : <Cases />}
    </div>
  );
}
