import { useAppStore } from '../store/useAppStore';
import type { Challenge } from '../types';
import { Star, Zap, Trophy } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const difficultyColors = {
  easy: 'text-neon-green bg-neon-green/20',
  medium: 'text-neon-yellow bg-neon-yellow/20',
  hard: 'text-neon-pink bg-neon-pink/20',
};

const categoryIcons: Record<string, string> = {
  Study: '📚',
  Homework: '📝',
  Reading: '📖',
  Science: '🔬',
  Music: '🎵',
  Social: '👥',
};

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { challenges, completeChallenge, user } = useAppStore();
  const activeChallenges = challenges.filter(c => !c.completed);
  const completedCount = challenges.filter(c => c.completed).length;

  const handleComplete = (challenge: Challenge) => {
    completeChallenge(challenge.id);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="glass rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-neon-purple/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-20 w-32 h-32 bg-neon-pink/20 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{user.avatar}</span>
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome back, {user.username}! 👋</h2>
              <p className="text-gray-400">Let's crush some challenges today!</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800/50">
              <Star className="text-neon-yellow" size={18} />
              <span className="text-white font-medium">Level {user.level}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800/50">
              <Zap className="text-neon-blue" size={18} />
              <span className="text-white font-medium">{user.xp} XP</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800/50">
              <Trophy className="text-neon-purple" size={18} />
              <span className="text-white font-medium">{completedCount}/{challenges.length} Done</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Challenges Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          Daily Challenges
        </h3>
        <div className="px-3 py-1 rounded-full bg-neon-purple/20 text-neon-purple text-sm font-medium">
          {activeChallenges.length} remaining
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid gap-4">
        {activeChallenges.map((challenge, index) => (
          <div
            key={challenge.id}
            className="glass rounded-2xl p-5 card-hover relative overflow-hidden group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/0 via-neon-purple/5 to-neon-purple/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10 flex items-start gap-4">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-dark-800 flex items-center justify-center text-2xl flex-shrink-0">
                {categoryIcons[challenge.category] || '🎯'}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-lg font-semibold text-white truncate">{challenge.title}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[challenge.difficulty]}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{challenge.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-neon-yellow text-lg">🪙</span>
                    <span className="text-neon-yellow font-bold">{challenge.coins}</span>
                  </div>

                  <button
                    onClick={() => handleComplete(challenge)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-white font-medium text-sm btn-neon hover:scale-105 transition-transform"
                  >
                    {challenge.proofRequired ? 'Submit Proof' : 'Complete'}
                  </button>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-1 bg-dark-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-neon-purple to-neon-pink transition-all duration-500"
                style={{ width: '0%' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('feed')}
          className="glass rounded-2xl p-5 text-left card-hover group"
        >
          <div className="w-12 h-12 rounded-xl bg-neon-blue/20 flex items-center justify-center mb-3 group-hover:bg-neon-blue/30 transition-colors">
            <span className="text-2xl">📸</span>
          </div>
          <h4 className="text-white font-semibold mb-1">View Feed</h4>
          <p className="text-gray-400 text-sm">See what others achieved</p>
        </button>

        <button
          onClick={() => onNavigate('gacha')}
          className="glass rounded-2xl p-5 text-left card-hover group"
        >
          <div className="w-12 h-12 rounded-xl bg-neon-pink/20 flex items-center justify-center mb-3 group-hover:bg-neon-pink/30 transition-colors">
            <span className="text-2xl">🎰</span>
          </div>
          <h4 className="text-white font-semibold mb-1">Spin Gacha</h4>
          <p className="text-gray-400 text-sm">Collect chibi characters</p>
        </button>
      </div>

      {/* Streak Info */}
      <div className="glass rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-3xl">
            🔥
          </div>
          <div>
            <h4 className="text-white font-bold text-lg">{user.streak} Day Streak!</h4>
            <p className="text-gray-400 text-sm">Keep it going to earn bonuses</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-neon-yellow font-bold text-xl">+50 🪙</span>
          <p className="text-gray-400 text-xs">per 7 days</p>
        </div>
      </div>
    </div>
  );
}
