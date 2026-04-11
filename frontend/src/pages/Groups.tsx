import { useMemo, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { Group } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Crown, Award, UserPlus, X, Search, MessageCircle, Image as ImageIcon, Sticker, Smile, ArrowLeft } from 'lucide-react';

const emojiChoices = ['📚', '🧠', '🎯', '💬', '🚀', '🎨'];

type MessageType = 'text' | 'emoji' | 'sticker' | 'image';

export default function Chats() {
  const {
    groups,
    selectGroup,
    selectedGroup,
    user,
    communityUsers,
    directThreads,
    activeDirectThreadId,
    openDirectThread,
    closeDirectThread,
    sendDirectMessage,
    createGroup,
  } = useAppStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupAvatar, setGroupAvatar] = useState('📚');
  const [groupFeedback, setGroupFeedback] = useState('');

  const [search, setSearch] = useState('');
  const [composer, setComposer] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('text');

  const filteredProfiles = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return communityUsers.filter((profile) => profile.id !== user.id && (`@${profile.username}`.toLowerCase().includes(q) || profile.displayName.toLowerCase().includes(q)));
  }, [communityUsers, search, user.id]);

  const directConversations = useMemo(() => directThreads
    .map((thread) => {
      const otherId = thread.participantIds.find((id) => id !== user.id);
      const profile = communityUsers.find((item) => item.id === otherId);
      if (!profile) return null;
      const lastMessage = thread.messages[thread.messages.length - 1];
      return { thread, profile, lastMessage };
    })
    .filter(Boolean), [directThreads, communityUsers, user.id]);

  const activeThread = useMemo(() => directThreads.find((thread) => thread.id === activeDirectThreadId) || null, [directThreads, activeDirectThreadId]);
  const activeThreadUser = useMemo(() => {
    if (!activeThread) return null;
    const otherId = activeThread.participantIds.find((id) => id !== user.id);
    return communityUsers.find((profile) => profile.id === otherId) || null;
  }, [activeThread, communityUsers, user.id]);

  const handleGroupClick = (group: Group) => {
    selectGroup(group);
  };

  const handleCreateGroup = () => {
    const result = createGroup({ name: groupName, description: groupDescription, avatar: groupAvatar });
    if (!result.ok) {
      setGroupFeedback(result.error || 'Unable to create group.');
      return;
    }
    setGroupName('');
    setGroupDescription('');
    setGroupAvatar('📚');
    setGroupFeedback('Group created.');
    setShowCreateModal(false);
  };

  const sendMessage = () => {
    if (!activeThread) return;
    const result = sendDirectMessage(activeThread.id, { content: composer, type: messageType });
    if (result.ok) {
      setComposer('');
      setMessageType('text');
    }
  };

  if (activeThread && activeThreadUser) {
    return (
      <div className="max-w-md mx-auto h-screen flex flex-col bg-white">
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button onClick={closeDirectThread} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeft size={20} /></button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-200 to-pink-200 flex items-center justify-center text-xl">{activeThreadUser.avatar}</div>
          <div>
            <h1 className="font-bold text-gray-900">{activeThreadUser.displayName}</h1>
            <p className="text-xs text-gray-500">@{activeThreadUser.username}</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {activeThread.messages.length === 0 && <p className="text-sm text-gray-500 text-center">Start your first message.</p>}
          {activeThread.messages.map((message) => {
            const mine = message.senderId === user.id;
            return (
              <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${mine ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                  <p>{message.content}</p>
                  <p className={`mt-1 text-[10px] ${mine ? 'text-primary-100' : 'text-gray-400'}`}>{message.type}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-gray-100 bg-white p-3 space-y-2">
          <div className="flex items-center gap-2">
            <button onClick={() => setMessageType('emoji')} className={`p-2 rounded-lg ${messageType === 'emoji' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}><Smile size={16} /></button>
            <button onClick={() => setMessageType('sticker')} className={`p-2 rounded-lg ${messageType === 'sticker' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}><Sticker size={16} /></button>
            <button onClick={() => setMessageType('image')} className={`p-2 rounded-lg ${messageType === 'image' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}><ImageIcon size={16} /></button>
            <button onClick={() => setMessageType('text')} className={`rounded-lg px-2 py-1 text-xs ${messageType === 'text' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>Text</button>
          </div>
          <div className="flex items-center gap-2">
            <input value={composer} onChange={(e) => setComposer(e.target.value)} placeholder={messageType === 'text' ? 'Type a message...' : `Add ${messageType} placeholder...`} className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            <button onClick={sendMessage} className="rounded-xl bg-gradient-to-r from-primary-500 to-pink-500 px-4 py-2 text-xs font-semibold text-white">Send</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto pb-20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">Chats</h1>
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-1 px-3 py-1.5 bg-primary-500 text-white rounded-full text-sm font-medium">
            <Plus size={16} />
            Create Group
          </button>
        </div>
      </header>

      <div className="p-4 space-y-6">
        <div className="bg-white rounded-2xl p-3 shadow-card">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
            <Search size={16} className="text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search profiles by name or @username" className="w-full bg-transparent text-sm focus:outline-none" />
          </div>
          {search.trim() && (
            <div className="mt-3 space-y-2">
              {filteredProfiles.length === 0 ? <p className="text-xs text-gray-500">No matching profiles.</p> : filteredProfiles.map((profile) => (
                <button key={profile.id} onClick={() => openDirectThread(profile.id)} className="w-full rounded-xl border border-gray-100 p-2 flex items-center gap-3 hover:border-primary-200 hover:bg-primary-50/50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-200 to-pink-200 flex items-center justify-center text-lg">{profile.avatar}</div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-gray-900">{profile.displayName}</p>
                    <p className="text-xs text-gray-500">@{profile.username}</p>
                  </div>
                  <MessageCircle size={16} className="text-primary-500" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Direct Messages</h2>
          <div className="space-y-3">
            {directConversations.length === 0 ? (
              <p className="text-sm text-gray-500">No direct messages yet. Search a profile to start.</p>
            ) : (
              directConversations.map((item, index) => item && (
                <motion.button
                  key={item.thread.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => openDirectThread(item.profile.id)}
                  className="w-full bg-white rounded-2xl p-4 shadow-card text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-200 to-pink-200 flex items-center justify-center text-xl">{item.profile.avatar}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.profile.displayName}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{item.lastMessage?.content || 'Start chatting'}</p>
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Groups</h2>
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
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-200 to-pink-200 flex items-center justify-center text-2xl">{group.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{group.name}</h3>
                      {group.ownerId === user.id && <Crown className="text-yellow-500" size={14} />}
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-1">{group.description}</p>

                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <div className="flex items-center gap-1"><Users size={14} /><span>{group.memberCount}</span></div>
                      <div className="flex items-center gap-1"><Award size={14} /><span>{group.challengesCreated}</span></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative z-10 bg-white rounded-3xl p-6 w-full max-w-md">
              <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="text-gray-400" size={20} /></button>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Create Group</h2>
              <p className="text-sm text-gray-500 mb-4">Start a challenge-focused community.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Group name</label>
                  <input value={groupName} onChange={(e) => setGroupName(e.target.value)} type="text" placeholder="Enter group name..." className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea value={groupDescription} onChange={(e) => setGroupDescription(e.target.value)} placeholder="What is this group about?" rows={3} className="input-field resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
                  <div className="flex gap-2">
                    {emojiChoices.map((emoji) => (
                      <button key={emoji} onClick={() => setGroupAvatar(emoji)} className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors ${groupAvatar === emoji ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 hover:bg-primary-50'}`}>{emoji}</button>
                    ))}
                  </div>
                </div>
                {groupFeedback && <p className="text-xs text-primary-600">{groupFeedback}</p>}
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={handleCreateGroup} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-pink-500 text-white font-medium shadow-glow-pink">Create</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedGroup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => selectGroup(null)} />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative z-10 bg-white rounded-3xl p-6 w-full max-w-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-200 to-pink-200 flex items-center justify-center text-3xl">{selectedGroup.avatar}</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedGroup.name}</h2>
                  <p className="text-gray-500 text-sm">{selectedGroup.memberCount} participants</p>
                </div>
              </div>

              <p className="text-gray-600 mb-6">{selectedGroup.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 text-center"><div className="text-2xl font-bold text-primary-600">{selectedGroup.challengesCreated}</div><div className="text-xs text-gray-500">Challenges</div></div>
                <div className="bg-gray-50 rounded-xl p-4 text-center"><div className="text-2xl font-bold text-pink-600">{selectedGroup.memberCount}</div><div className="text-xs text-gray-500">Members</div></div>
              </div>

              <div className="space-y-3">
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-pink-500 text-white font-medium flex items-center justify-center gap-2"><Plus size={18} />Send Message</button>
                <button className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-medium flex items-center justify-center gap-2"><UserPlus size={18} />Invite People</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
