import { useMemo, useRef, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { DirectMessage, GroupMessage } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Crown,
  Award,
  X,
  Search,
  MessageCircle,
  ArrowLeft,
  Paperclip,
  Smile,
  Sticker,
  Image as ImageIcon,
  Mic,
  Video,
  Send,
  Palette,
  Shield,
} from 'lucide-react';

const emojiChoices = ['📚', '🧠', '🎯', '💬', '🚀', '🎨'];
const chatBackgrounds = ['bg-gray-50', 'bg-pink-50', 'bg-blue-50', 'bg-gradient-to-br from-pink-50 to-purple-50', 'bg-[radial-gradient(circle_at_top,_#fce7f3,_#fff)]'];

type ComposerMode = 'audio' | 'video';
type OutgoingMessageType = DirectMessage['type'] | GroupMessage['type'];

interface ChatComposerProps {
  onSend: (payload: { content: string; type: OutgoingMessageType }) => void;
}

function ChatComposer({ onSend }: ChatComposerProps) {
  const [value, setValue] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [mode, setMode] = useState<ComposerMode>('audio');
  const [recording, setRecording] = useState(false);
  const timerRef = useRef<number | null>(null);

  const send = (type: OutgoingMessageType, content: string) => {
    onSend({ type, content });
    if (type === 'text') setValue('');
    setShowAttachMenu(false);
  };

  const onRecordStart = () => {
    timerRef.current = window.setTimeout(() => {
      setRecording(true);
    }, 260);
  };

  const onRecordEnd = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (recording) {
      send(mode, mode === 'video' ? '🎥 Video circle (placeholder, up to 1m)' : '🎙️ Voice note (placeholder, up to 1m)');
      setRecording(false);
    }
  };

  return (
    <div className="border-t border-gray-100 bg-white/95 backdrop-blur p-3 pb-5 space-y-2">
      <div className="flex items-end gap-2">
        <div className="relative">
          <button onClick={() => setShowAttachMenu((prev) => !prev)} className="h-10 w-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
            <Paperclip size={18} />
          </button>
          <AnimatePresence>
            {showAttachMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute bottom-12 left-0 z-20 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl w-48"
              >
                {[
                  { label: 'Document', icon: '📄', type: 'document' as OutgoingMessageType },
                  { label: 'Image', icon: '🖼️', type: 'image' as OutgoingMessageType },
                  { label: 'Video', icon: '🎬', type: 'video' as OutgoingMessageType },
                  { label: 'Gift Collectible', icon: '🎁', type: 'gift' as OutgoingMessageType },
                  { label: 'Future Item', icon: '🧩', type: 'sticker' as OutgoingMessageType },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => send(item.type, `${item.icon} ${item.label} placeholder`)}
                    className="w-full px-3 py-2 rounded-xl text-left text-sm hover:bg-gray-100"
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 rounded-2xl border border-gray-200 bg-white px-3 py-2">
          <div className="flex items-center gap-2 mb-1">
            <button onClick={() => send('emoji', '😊')} className="text-gray-500"><Smile size={16} /></button>
            <button onClick={() => send('sticker', '🧷 Sticker placeholder')} className="text-gray-500"><Sticker size={16} /></button>
            <button onClick={() => send('image', '🖼️ Image placeholder')} className="text-gray-500"><ImageIcon size={16} /></button>
          </div>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Message"
            className="w-full text-sm bg-transparent focus:outline-none"
          />
        </div>

        {value.trim() ? (
          <button onClick={() => send('text', value)} className="h-10 w-10 rounded-xl bg-primary-500 text-white flex items-center justify-center">
            <Send size={16} />
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <button onClick={() => setMode((prev) => (prev === 'audio' ? 'video' : 'audio'))} className="h-10 w-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center" title="Toggle audio/video">
              {mode === 'audio' ? <Mic size={16} /> : <Video size={16} />}
            </button>
            <button
              onMouseDown={onRecordStart}
              onMouseUp={onRecordEnd}
              onMouseLeave={onRecordEnd}
              onTouchStart={onRecordStart}
              onTouchEnd={onRecordEnd}
              className={`h-10 w-10 rounded-xl flex items-center justify-center ${recording ? 'bg-red-500 text-white animate-pulse' : 'bg-primary-500 text-white'}`}
              title="Hold to record"
            >
              {mode === 'audio' ? <Mic size={16} /> : <Video size={16} />}
            </button>
          </div>
        )}
      </div>
      {recording && <p className="text-[11px] text-red-500">Recording {mode}… release to send placeholder.</p>}
    </div>
  );
}

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
    groupMessagesById,
    activeGroupChatId,
    openGroupChat,
    closeGroupChat,
    sendGroupMessage,
    inviteMemberToGroup,
    updateGroupMeta,
    directChatBackgroundByThreadId,
    groupChatBackgroundByGroupId,
    setDirectChatBackground,
    setGroupChatBackground,
  } = useAppStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupAvatar, setGroupAvatar] = useState('📚');
  const [groupPrivate, setGroupPrivate] = useState(false);
  const [groupRules, setGroupRules] = useState('Be kind and keep messages on-topic.');
  const [groupFeedback, setGroupFeedback] = useState('');

  const [search, setSearch] = useState('');

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

  const activeGroup = useMemo(() => groups.find((group) => group.id === activeGroupChatId) || null, [groups, activeGroupChatId]);
  const activeGroupMessages = useMemo(() => (activeGroup ? groupMessagesById[activeGroup.id] || [] : []), [activeGroup, groupMessagesById]);

  const handleCreateGroup = () => {
    const result = createGroup({ name: groupName, description: groupDescription, avatar: groupAvatar });
    if (!result.ok) {
      setGroupFeedback(result.error || 'Unable to create group.');
      return;
    }

    const latestCreated = useAppStore.getState().groups[0];
    if (latestCreated) {
      updateGroupMeta(latestCreated.id, { rules: groupRules, adminIdToAdd: user.id });
      if (groupPrivate) {
        useAppStore.setState((state) => ({
          groups: state.groups.map((g) => (g.id === latestCreated.id ? { ...g, isPrivate: true } : g)),
        }));
      }
    }

    setGroupName('');
    setGroupDescription('');
    setGroupAvatar('📚');
    setGroupPrivate(false);
    setGroupRules('Be kind and keep messages on-topic.');
    setGroupFeedback('Group created.');
    setShowCreateModal(false);
  };

  if (activeThread && activeThreadUser) {
    const background = directChatBackgroundByThreadId[activeThread.id] || 'bg-gray-50';

    return (
      <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} className="max-w-md mx-auto min-h-screen flex flex-col bg-white pb-20">
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button onClick={closeDirectThread} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeft size={20} /></button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-200 to-pink-200 flex items-center justify-center text-xl">{activeThreadUser.avatar}</div>
          <div className="flex-1">
            <h1 className="font-bold text-gray-900">{activeThreadUser.displayName}</h1>
            <p className="text-xs text-gray-500">@{activeThreadUser.username}</p>
          </div>
          <div className="relative group">
            <button className="p-2 rounded-full hover:bg-gray-100"><Palette size={18} className="text-gray-500" /></button>
            <div className="absolute right-0 mt-2 hidden group-hover:flex bg-white border border-gray-200 rounded-xl p-2 gap-1 shadow-lg">
              {chatBackgrounds.map((bg) => (
                <button key={bg} onClick={() => setDirectChatBackground(activeThread.id, bg)} className={`h-6 w-6 rounded-full border ${bg}`} />
              ))}
            </div>
          </div>
        </header>

        <div className={`flex-1 overflow-y-auto p-4 space-y-3 transition-colors ${background}`}>
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

        <ChatComposer onSend={({ content, type }) => sendDirectMessage(activeThread.id, { content, type: type as DirectMessage['type'] })} />
      </motion.div>
    );
  }

  if (activeGroup) {
    const isAdmin = activeGroup.ownerId === user.id || activeGroup.adminIds?.includes(user.id);
    const background = groupChatBackgroundByGroupId[activeGroup.id] || 'bg-gray-50';

    return (
      <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} className="max-w-md mx-auto min-h-screen flex flex-col bg-white pb-20">
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button onClick={closeGroupChat} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeft size={20} /></button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-200 to-pink-200 flex items-center justify-center text-xl">{activeGroup.avatar}</div>
          <div className="flex-1">
            <h1 className="font-bold text-gray-900">{activeGroup.name}</h1>
            <p className="text-xs text-gray-500">{activeGroup.isPrivate ? 'Private group' : 'Public group'} • {activeGroup.memberCount} members</p>
          </div>
          <div className="relative group">
            <button className="p-2 rounded-full hover:bg-gray-100"><Palette size={18} className="text-gray-500" /></button>
            <div className="absolute right-0 mt-2 hidden group-hover:flex bg-white border border-gray-200 rounded-xl p-2 gap-1 shadow-lg">
              {chatBackgrounds.map((bg) => (
                <button key={bg} onClick={() => setGroupChatBackground(activeGroup.id, bg)} className={`h-6 w-6 rounded-full border ${bg}`} />
              ))}
            </div>
          </div>
        </header>

        <div className="px-4 py-2 bg-white border-b border-gray-100">
          <p className="text-xs text-gray-500 flex items-center gap-1"><Shield size={12} />Rules: {activeGroup.rules || 'No rules yet.'}</p>
          {isAdmin && (
            <div className="mt-2 flex gap-2">
              <button onClick={() => inviteMemberToGroup(activeGroup.id)} className="text-xs rounded-lg bg-gray-100 px-2 py-1">Invite member</button>
              <button onClick={() => updateGroupMeta(activeGroup.id, { adminIdToAdd: 'u2' })} className="text-xs rounded-lg bg-gray-100 px-2 py-1">Assign co-admin</button>
            </div>
          )}
        </div>

        <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${background}`}>
          {activeGroupMessages.map((message) => {
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

        <ChatComposer onSend={({ content, type }) => sendGroupMessage(activeGroup.id, { content, type: type as GroupMessage['type'] })} />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto pb-20">
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
                <motion.button key={item.thread.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} onClick={() => openDirectThread(item.profile.id)} className="w-full bg-white rounded-2xl p-4 shadow-card text-left">
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
              <motion.div key={group.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} onClick={() => openGroupChat(group.id)} className="bg-white rounded-2xl p-4 shadow-card cursor-pointer hover:shadow-card-hover transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-200 to-pink-200 flex items-center justify-center text-2xl">{group.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{group.name}</h3>
                      {group.ownerId === user.id && <Crown className="text-yellow-500" size={14} />}
                      {group.isPrivate && <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Private</span>}
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
                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
                  <span className="text-sm text-gray-600">Private group</span>
                  <button onClick={() => setGroupPrivate((prev) => !prev)} className={`h-6 w-11 rounded-full transition-colors ${groupPrivate ? 'bg-primary-500' : 'bg-gray-300'}`}>
                    <span className={`block h-5 w-5 bg-white rounded-full transition-transform ${groupPrivate ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Basic rules (admin editable)</label>
                  <textarea value={groupRules} onChange={(e) => setGroupRules(e.target.value)} rows={2} className="input-field resize-none" />
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
              <button onClick={() => openGroupChat(selectedGroup.id)} className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-pink-500 text-white font-medium">Open Group Chat</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
