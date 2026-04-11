import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { Group } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Crown, Award, UserPlus, X } from 'lucide-react';

export default function Chats() {
  const { groups, selectGroup, selectedGroup, user } = useAppStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleGroupClick = (group: Group) => {
    selectGroup(group);
  };

  return (
    <div className="max-w-md mx-auto pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">Chats</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-primary-500 text-white rounded-full text-sm font-medium"
          >
            <Plus size={16} />
            New
          </button>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Recent Chats */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Chats</h2>
          
          <div className="space-y-3">
            {groups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleGroupClick(group)}
                className="bg-white rounded-2xl p-4 shadow-card cursor-pointer hover:shadow-card-hover transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-200 to-pink-200 flex items-center justify-center text-2xl">
                    {group.avatar}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{group.name}</h3>
                      {group.ownerId === user.id && (
                        <Crown className="text-yellow-500" size={14} />
                      )}
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-1">{group.description}</p>

                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{group.memberCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award size={14} />
                        <span>{group.challengesCreated}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Channels */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Channels</h2>
          
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {[
              { name: 'Study Buddies', avatar: '📚', participants: '12K' },
              { name: 'Math League', avatar: '➗', participants: '8K' },
              { name: 'Bookworms', avatar: '📖', participants: '15K' },
              { name: 'Science Hub', avatar: '🔬', participants: '10K' },
            ].map((group, i) => (
              <div key={i} className="flex-shrink-0 w-28 bg-white rounded-2xl p-4 shadow-card text-center">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl mx-auto mb-2">
                  {group.avatar}
                </div>
                <p className="font-medium text-gray-900 text-sm truncate">{group.name}</p>
                <p className="text-xs text-gray-400">{group.participants}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Chat Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative z-10 bg-white rounded-3xl p-6 w-full max-w-md"
            >
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="text-gray-400" size={20} />
              </button>

              <h2 className="text-xl font-bold text-gray-900 mb-6">Start New Chat</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chat Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter chat name..."
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea 
                    placeholder="What is this chat about?"
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chat Icon</label>
                  <div className="flex gap-2">
                    {['📚', '🔬', '📖', '🎵', '🎨', '⚽'].map((emoji) => (
                      <button
                        key={emoji}
                        className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl hover:bg-primary-100 hover:text-primary-600 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-pink-500 text-white font-medium shadow-glow-pink">
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Group Detail Modal */}
      <AnimatePresence>
        {selectedGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => selectGroup(null)} />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative z-10 bg-white rounded-3xl p-6 w-full max-w-md"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-200 to-pink-200 flex items-center justify-center text-3xl">
                  {selectedGroup.avatar}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedGroup.name}</h2>
                  <p className="text-gray-500 text-sm">{selectedGroup.memberCount} participants</p>
                </div>
              </div>

              <p className="text-gray-600 mb-6">{selectedGroup.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary-600">{selectedGroup.challengesCreated}</div>
                  <div className="text-xs text-gray-500">Challenges</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-pink-600">{selectedGroup.memberCount}</div>
                  <div className="text-xs text-gray-500">Members</div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-pink-500 text-white font-medium flex items-center justify-center gap-2">
                  <Plus size={18} />
                  Send Message
                </button>
                <button className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-medium flex items-center justify-center gap-2">
                  <UserPlus size={18} />
                  Invite People
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
