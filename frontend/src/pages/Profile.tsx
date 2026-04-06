import { useAppStore } from '../store/useAppStore';
import type { Rarity, Collectible } from '../types';
import { motion } from 'framer-motion';
import { Settings, Edit, Star, Zap, Flame, Trophy, Target, Award } from 'lucide-react';

const rarityConfig: Record<Rarity, { color: string; bg: string; border: string; glow: string }> = {
  common: { color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-200', glow: '' },
  rare: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', glow: 'shadow-blue-400/20' },
  epic: { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', glow: 'shadow-purple-400/30' },
  legendary: { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-300', glow: 'shadow-yellow-400/40 animate-pulse' },
};

export default function Profile() {
  const { user, challenges, collectibles, setCurrentPage } = useAppStore();
  
  const completedChallenges = challenges.filter(c => c.completed).length;
  const totalChallenges = challenges.length;
  const completionRate = Math.round((completedChallenges / totalChallenges) * 100);

  // Group collectibles by rarity
  const collectiblesByRarity = collectibles.reduce((acc, c) => {
    if (!acc[c.rarity]) acc[c.rarity] = [];
    acc[c.rarity].push(c);
    return acc;
  }, {} as Record<Rarity, Collectible[]>);

  return (
    <div className="max-w-md mx-auto pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">Profile</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Settings className="text-gray-600" size={22} />
          </button>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 shadow-card">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-400 to-pink-500 flex items-center justify-center text-4xl shadow-lg shadow-pink-500/30">
                {user.avatar}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-soft">
                <span className="text-lg">⭐</span>
              </div>
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-600 text-sm font-medium">
                  Level {user.level}
                </span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={14} />
                  <span className="text-sm font-medium">{user.xp} XP</span>
                </div>
              </div>
            </div>
            
            {/* Edit button */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Edit className="text-gray-400" size={20} />
            </button>
          </div>

          {/* XP Progress */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Level Progress</span>
              <span className="text-sm font-medium text-gray-700">{user.xp} / {user.level * 500}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(user.xp % 500) / 500 * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-primary-400 to-pink-500 rounded-full"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5">{500 - (user.xp % 500)} XP to Level {user.level + 1}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-card text-center">
            <Trophy className="mx-auto text-yellow-500 mb-1" size={20} />
            <div className="text-xl font-bold text-gray-900">{completedChallenges}</div>
            <div className="text-xs text-gray-500">Done</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-card text-center">
            <Target className="mx-auto text-blue-500 mb-1" size={20} />
            <div className="text-xl font-bold text-gray-900">{completionRate}%</div>
            <div className="text-xs text-gray-500">Rate</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-card text-center">
            <Flame className="mx-auto text-orange-500 mb-1" size={20} />
            <div className="text-xl font-bold text-gray-900">{user.streak}</div>
            <div className="text-xs text-gray-500">Streak</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-card text-center">
            <Zap className="mx-auto text-primary-500 mb-1" size={20} />
            <div className="text-xl font-bold text-gray-900">{user.coins}</div>
            <div className="text-xs text-gray-500">Coins</div>
          </div>
        </div>

        {/* Collection */}
        <div className="bg-white rounded-3xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Award className="text-yellow-500" size={20} />
              Looply Collection
            </h3>
            <span className="text-xs text-gray-400">{collectibles.length} items</span>
          </div>
          <p className="text-sm text-gray-500 mb-4">Collectibles you win from opening cases appear here instantly.</p>
          
          {collectibles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 px-4 py-6 text-center">
              <p className="text-sm text-gray-500">No collectibles yet — open a case to start your collection.</p>
              <button
                onClick={() => setCurrentPage('cases')}
                className="mt-4 inline-flex items-center rounded-xl bg-gradient-to-r from-primary-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-glow-pink"
              >
                Open a Case
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {(['legendary', 'epic', 'rare', 'common'] as Rarity[]).map((rarity) => {
                const items = collectiblesByRarity[rarity] || [];
                if (items.length === 0) return null;

                return (
                  <div key={rarity} className="last:mb-0">
                    <div className={`mb-3 flex items-center gap-2 ${rarityConfig[rarity].color}`}>
                      <span className="text-sm font-semibold capitalize">{rarity}</span>
                      <span className="text-xs opacity-60">({items.length})</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          whileHover={{ scale: 1.02 }}
                          className={`rounded-2xl border p-3 ${rarityConfig[rarity].bg} ${rarityConfig[rarity].border} ${rarityConfig[rarity].glow}`}
                        >
                          <div className="mb-2 text-3xl">{item.image}</div>
                          <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                          <p className={`mt-1 text-xs font-medium capitalize ${rarityConfig[rarity].color}`}>{item.rarity}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-3xl p-5 shadow-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="text-primary-500" size={20} />
            Achievements
          </h3>
          
          <div className="space-y-3">
            {[
              { icon: '🔥', title: '7 Day Streak', desc: 'Complete challenges for 7 days', color: 'text-orange-500', earned: true },
              { icon: '📚', title: 'Bookworm', desc: 'Complete 10 reading challenges', color: 'text-blue-500', earned: true },
              { icon: '⭐', title: 'Rising Star', desc: 'Reach level 10', color: 'text-yellow-500', earned: true },
              { icon: '🎯', title: 'Sharpshooter', desc: 'Complete 50 challenges', color: 'text-purple-500', earned: false },
              { icon: '👑', title: 'Champion', desc: 'Collect all legendary items', color: 'text-yellow-600', earned: false },
            ].map((achievement, i) => (
              <div 
                key={i} 
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${achievement.earned ? 'bg-gray-50' : 'opacity-50'}`}
              >
                <div className={`w-10 h-10 rounded-xl ${achievement.earned ? 'bg-white shadow-soft' : 'bg-gray-100'} flex items-center justify-center text-xl`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                    {achievement.title}
                  </h4>
                  <p className="text-xs text-gray-400">{achievement.desc}</p>
                </div>
                {achievement.earned && (
                  <span className="text-green-500">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
