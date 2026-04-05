import { useAppStore } from '../store/useAppStore';
import type { Challenge } from '../types';
import { motion } from 'framer-motion';
import { Star, CheckCircle, Camera, Clock, Zap, Award } from 'lucide-react';

const difficultyColors = {
  easy: 'text-green-600 bg-green-50',
  medium: 'text-yellow-600 bg-yellow-50',
  hard: 'text-red-600 bg-red-50',
};

const categoryIcons: Record<string, string> = {
  Study: '📚',
  Homework: '📝',
  Reading: '📖',
  Science: '🔬',
  Music: '🎵',
  Social: '👥',
};

export default function Challenges() {
  const { challenges, completeChallenge, user, setCurrentPage } = useAppStore();
  const activeChallenges = challenges.filter(c => !c.completed);
  const completedCount = challenges.filter(c => c.completed).length;

  const handleComplete = (challenge: Challenge) => {
    completeChallenge(challenge.id);
  };

  return (
    <div className="max-w-md mx-auto pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">Challenges</h1>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-yellowLight rounded-full">
            <span className="text-lg">🪙</span>
            <span className="font-semibold text-yellow-700">{user.coins}</span>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Progress */}
        <div className="bg-gradient-to-r from-primary-500 to-pink-500 rounded-3xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Today's Progress</h2>
            <span className="text-sm opacity-90">{completedCount}/{challenges.length}</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / challenges.length) * 100}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-white rounded-full"
            />
          </div>
          <p className="text-sm opacity-80 mt-2">{activeChallenges.length} challenges remaining</p>
        </div>

        {/* Active Challenges */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Challenges</h2>
          
          <div className="space-y-3">
            {activeChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-4 shadow-card"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl flex-shrink-0">
                    {categoryIcons[challenge.category] || '🎯'}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[challenge.difficulty]}`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-gray-500 text-sm mt-1">{challenge.description}</p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500">🪙</span>
                        <span className="font-medium text-gray-700">{challenge.coins}</span>
                      </div>

                      <button
                        onClick={() => handleComplete(challenge)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors"
                      >
                        {challenge.proofRequired ? (
                          <>
                            <Camera size={16} />
                            Submit
                          </>
                        ) : (
                          <>
                            <CheckCircle size={16} />
                            Complete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setCurrentPage('feed')}
            className="bg-white rounded-2xl p-4 shadow-card text-left hover:shadow-card-hover transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
              <span className="text-xl">📸</span>
            </div>
            <h4 className="font-medium text-gray-900">View Feed</h4>
            <p className="text-xs text-gray-500">See recent posts</p>
          </button>

          <button 
            onClick={() => setCurrentPage('cases')}
            className="bg-white rounded-2xl p-4 shadow-card text-left hover:shadow-card-hover transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
              <span className="text-xl">📦</span>
            </div>
            <h4 className="font-medium text-gray-900">Open Cases</h4>
            <p className="text-xs text-gray-500">Get collectibles</p>
          </button>
        </div>
      </div>
    </div>
  );
}