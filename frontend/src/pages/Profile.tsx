import { useMemo, useState } from 'react';
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
  const { user, challenges, stories, posts, collectibles, userCollectibleShowcase, openEditProfile, openSettings, openStoryViewer } = useAppStore();
  const [tab, setTab] = useState<'activity' | 'collection'>('activity');

  const completedChallenges = challenges.filter((c) => c.completed).length;
  const totalChallenges = challenges.length;
  const completionRate = Math.round((completedChallenges / totalChallenges) * 100);

  const myStories = useMemo(() => stories.filter((story) => story.userId === user.id), [stories, user.id]);
  const myPosts = useMemo(() => posts.filter((post) => post.userId === user.id), [posts, user.id]);

  const showcaseCollectibles = useMemo(() => {
    const showcaseItems = userCollectibleShowcase[user.id] || [];
    return showcaseItems.length > 0 ? showcaseItems : collectibles;
  }, [userCollectibleShowcase, user.id, collectibles]);

  const collectiblesByRarity = showcaseCollectibles.reduce((acc, c) => {
    if (!acc[c.rarity]) acc[c.rarity] = [];
    acc[c.rarity].push(c);
    return acc;
  }, {} as Record<Rarity, Collectible[]>);

  return (
    <div className="max-w-md mx-auto pb-20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">@{user.username}</h1>
          <button onClick={openSettings} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Settings className="text-gray-600" size={22} /></button>
        </div>
      </header>

      <div className="p-4 space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-card">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-400 to-pink-500 flex items-center justify-center text-4xl shadow-lg shadow-pink-500/30">{user.avatar}</div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-soft"><span className="text-lg">⭐</span></div>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 break-words [overflow-wrap:anywhere]">{user.displayName}</h2>
              <p className="text-sm text-gray-500 mt-1 break-words [overflow-wrap:anywhere]">{user.bio}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-600 text-sm font-medium">Level {user.level}</span>
                <div className="flex items-center gap-1 text-yellow-500"><Star size={14} /><span className="text-sm font-medium">{user.xp} XP</span></div>
              </div>
            </div>

            <button onClick={openEditProfile} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Edit className="text-gray-400" size={20} /></button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-card text-center"><Trophy className="mx-auto text-yellow-500 mb-1" size={20} /><div className="text-xl font-bold text-gray-900">{completedChallenges}</div><div className="text-xs text-gray-500">Done</div></div>
          <div className="bg-white rounded-2xl p-4 shadow-card text-center"><Target className="mx-auto text-blue-500 mb-1" size={20} /><div className="text-xl font-bold text-gray-900">{completionRate}%</div><div className="text-xs text-gray-500">Rate</div></div>
          <div className="bg-white rounded-2xl p-4 shadow-card text-center"><Flame className="mx-auto text-orange-500 mb-1" size={20} /><div className="text-xl font-bold text-gray-900">{user.streak}</div><div className="text-xs text-gray-500">Streak</div></div>
          <div className="bg-white rounded-2xl p-4 shadow-card text-center"><Zap className="mx-auto text-primary-500 mb-1" size={20} /><div className="text-xl font-bold text-gray-900">{user.coins}</div><div className="text-xs text-gray-500">Coins</div></div>
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-card">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-gray-100 p-1 mb-4">
            <button onClick={() => setTab('activity')} className={`rounded-xl py-2 text-sm font-semibold ${tab === 'activity' ? 'bg-white text-gray-900 shadow-soft' : 'text-gray-500'}`}>Activity</button>
            <button onClick={() => setTab('collection')} className={`rounded-xl py-2 text-sm font-semibold ${tab === 'collection' ? 'bg-white text-gray-900 shadow-soft' : 'text-gray-500'}`}>Collection</button>
          </div>

          {tab === 'activity' ? (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Stories</h3>
                {myStories.length === 0 ? <p className="text-sm text-gray-500">No stories yet.</p> : (
                  <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
                    {myStories.map((story) => (
                      <button key={story.id} onClick={() => openStoryViewer(story.id)} className="text-center flex-shrink-0">
                        <div className={`w-14 h-14 rounded-full p-0.5 ${story.hasViewed ? 'bg-gray-200' : 'story-ring'}`}><div className="w-full h-full rounded-full bg-white border border-white flex items-center justify-center text-xl">{story.media || story.avatar}</div></div>
                        <p className="text-[11px] text-gray-500 mt-1 truncate w-14">{story.username}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Posts</h3>
                {myPosts.length === 0 ? <p className="text-sm text-gray-500">No posts yet.</p> : (
                  <div className="space-y-3">
                    {myPosts.map((post) => (
                      <div key={post.id} className="rounded-2xl border border-gray-100 p-3">
                        <p className="text-xs text-primary-600 font-medium mb-1">{post.challengeTitle}</p>
                        <p className="text-sm text-gray-700 break-words [overflow-wrap:anywhere]">{post.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Award className="text-yellow-500" size={20} />Looply Collection</h3>
                <span className="text-xs text-gray-400">{showcaseCollectibles.length} items</span>
              </div>
              {showcaseCollectibles.length === 0 ? <p className="text-sm text-gray-500">No collectibles yet — open a case to start your collection.</p> : (
                <div className="space-y-4">
                  {(['legendary', 'epic', 'rare', 'common'] as Rarity[]).map((rarity) => {
                    const items = collectiblesByRarity[rarity] || [];
                    if (items.length === 0) return null;
                    return (
                      <div key={rarity}>
                        <div className={`mb-3 flex items-center gap-2 ${rarityConfig[rarity].color}`}><span className="text-sm font-semibold capitalize">{rarity}</span><span className="text-xs opacity-60">({items.length})</span></div>
                        <div className="grid grid-cols-2 gap-3">
                          {items.map((item) => (
                            <motion.div key={item.id} whileHover={{ scale: 1.02 }} className={`rounded-2xl border p-3 ${rarityConfig[rarity].bg} ${rarityConfig[rarity].border} ${rarityConfig[rarity].glow}`}>
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
          )}
        </div>
      </div>
    </div>
  );
}
