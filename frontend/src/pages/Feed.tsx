import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Award, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Feed() {
  const { posts, stories, togglePostLike, markStoryViewed, setCurrentPage, openUserProfile, likedPostIds, openComments } = useAppStore();
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor(diff / 60000);
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'Just now';
  };

  const handleSave = (postId: string) => {
    setSavedPosts((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]));
  };

  return (
    <div className="max-w-md mx-auto pb-20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-pink-500 rounded-xl flex items-center justify-center shadow-glow-pink">
              <span className="text-white text-lg">✨</span>
            </div>
            <span className="text-xl font-bold gradient-text">Looply</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentPage('cases')} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><span className="text-2xl">📦</span></button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><span className="text-2xl">❤️</span></button>
          </div>
        </div>
      </header>

      <div className="border-b border-gray-100 py-3">
        <div className="flex gap-4 px-4 overflow-x-auto hide-scrollbar">
          <div className="flex-shrink-0 text-center">
            <button className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-primary-400 hover:bg-primary-50/50 transition-all group">
              <Plus className="text-gray-400 group-hover:text-primary-500" />
            </button>
            <p className="text-xs text-gray-500 mt-1">Add</p>
          </div>

          {stories.map((story) => (
            <div key={story.id} className="flex-shrink-0 text-center cursor-pointer" onClick={() => markStoryViewed(story.id)}>
              <div className={`w-16 h-16 rounded-full p-0.5 ${story.id === 's1' || !story.hasViewed ? 'story-ring' : ''}`}>
                <div className={`w-full h-full rounded-full flex items-center justify-center text-2xl ${story.hasViewed ? 'bg-gray-100' : 'bg-white border-2 border-white'}`}>{story.avatar}</div>
              </div>
              <p className="text-xs text-gray-600 mt-1 truncate w-16">{story.username}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        <AnimatePresence>
          {posts.map((post, index) => {
            const isLiked = likedPostIds.includes(post.id);
            return (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="py-2">
                <div className="flex items-center justify-between px-4 py-3">
                  <button onClick={() => openUserProfile(post.userId)} className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-200 to-pink-200 flex items-center justify-center text-xl">{post.userAvatar}</div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900 break-words">{post.username}</p>
                      <p className="text-xs text-gray-400">{formatTime(post.timestamp)}</p>
                    </div>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><MoreHorizontal className="text-gray-400" size={20} /></button>
                </div>

                <div className="px-4">
                  <div className="flex items-center gap-2 mb-3 p-2 bg-accent-pinkLight rounded-xl w-fit max-w-full">
                    <Award className="text-primary-500 shrink-0" size={14} />
                    <span className="text-xs font-medium text-primary-600 break-words">{post.challengeTitle}</span>
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed mb-3 break-words [overflow-wrap:anywhere]">{post.content}</p>
                </div>

                {post.image && <div className="px-4 mb-3"><div className="w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center text-7xl">{post.image}</div></div>}

                <div className="px-4 py-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button onClick={() => togglePostLike(post.id)} className={`p-2 rounded-full transition-colors ${isLiked ? 'bg-red-50' : 'hover:bg-gray-100'}`}>
                        <Heart className={`${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600 hover:text-red-500 hover:fill-red-500'} transition-all`} size={22} />
                      </button>
                      <button onClick={() => openComments(post.id)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><MessageCircle className="text-gray-600" size={22} /></button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Send className="text-gray-600" size={22} /></button>
                    </div>
                    <button onClick={() => handleSave(post.id)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Bookmark className={`${savedPosts.includes(post.id) ? 'fill-gray-600 text-gray-600' : 'text-gray-600'}`} size={22} />
                    </button>
                  </div>

                  <p className="font-semibold text-sm text-gray-900 mt-2">{post.likes} likes</p>
                  <button onClick={() => openComments(post.id)} className="text-sm text-gray-600 mt-1 hover:text-gray-800">View all {post.comments} comments</button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <div className="h-4" />
    </div>
  );
}
