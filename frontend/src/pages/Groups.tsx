import { useEffect, useMemo, useRef, useState } from 'react';
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
  Shield,
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react';

const emojiChoices = ['📚', '🧠', '🎯', '💬', '🚀', '🎨'];
const chatBackgrounds = ['bg-gray-50', 'bg-pink-50', 'bg-blue-50', 'bg-gradient-to-br from-pink-50 to-purple-50', 'bg-[radial-gradient(circle_at_top,_#fce7f3,_#fff)]'];

type ComposerMode = 'audio' | 'video';
type OutgoingMessageType = DirectMessage['type'] | GroupMessage['type'];

interface ChatComposerProps {
  isOpen: boolean;
  onReveal: () => void;
  onSend: (payload: { content: string; type: OutgoingMessageType }) => void;
}

function ChatComposer({ isOpen, onReveal, onSend }: ChatComposerProps) {
  const [value, setValue] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [mode, setMode] = useState<ComposerMode>('audio');
  const [recording, setRecording] = useState(false);
  const holdTimer = useRef<number | null>(null);
  const longPressActive = useRef(false);

  const send = (type: OutgoingMessageType, content: string) => {
    onSend({ type, content });
    if (type === 'text') setValue('');
    setShowAttachMenu(false);
  };

  const onActionDown = () => {
    longPressActive.current = false;
    holdTimer.current = window.setTimeout(() => {
      longPressActive.current = true;
      setRecording(true);
    }, 260);
  };

  const onActionUp = () => {
    if (holdTimer.current) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }

    if (longPressActive.current) {
      send(mode, mode === 'video' ? '🎥 Video circle (placeholder, up to 1m)' : '🎙️ Voice note (placeholder, up to 1m)');
      setRecording(false);
      longPressActive.current = false;
      return;
    }

    setMode((prev) => (prev === 'audio' ? 'video' : 'audio'));
  };

  return (
    <motion.div
      initial={false}
      animate={{ y: isOpen ? 0 : 72, opacity: isOpen ? 1 : 0.7 }}
      transition={{ type: 'spring', stiffness: 340, damping: 34 }}
      className="border-t border-gray-100 bg-white/95 backdrop-blur p-3 pb-5 space-y-2"
      onClick={onReveal}
    >
      <div className="flex items-end gap-2">
        <div className="relative">
          <button onClick={() => { onReveal(); setShowAttachMenu((prev) => !prev); }} className="h-10 w-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
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
          <input value={value} onChange={(e) => setValue(e.target.value)} onFocus={onReveal} placeholder="Message" className="w-full text-sm bg-transparent focus:outline-none" />
        </div>

        {value.trim() ? (
          <button onClick={() => send('text', value)} className="h-10 w-10 rounded-xl bg-primary-500 text-white flex items-center justify-center">
            <Send size={16} />
          </button>
        ) : (
          <button
            onMouseDown={onActionDown}
            onMouseUp={onActionUp}
            onMouseLeave={() => recording && onActionUp()}
            onTouchStart={onActionDown}
            onTouchEnd={onActionUp}
            className={`h-10 w-10 rounded-xl flex items-center justify-center ${recording ? 'bg-red-500 text-white animate-pulse' : 'bg-primary-500 text-white'}`}
            title="Tap to switch audio/video, hold to record"
          >
            <motion.div key={mode} initial={{ scale: 0.6, rotate: -24, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 24 }}>
              {mode === 'audio' ? <Mic size={16} /> : <Video size={16} />}
            </motion.div>
          </button>
        )}
      </div>
      {recording && <p className="text-[11px] text-red-500">Recording {mode}… release to send placeholder.</p>}
    </motion.div>
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
    openUserProfile,
    stories,
    openStoryViewer,
  } = useAppStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDirectDetails, setShowDirectDetails] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupAvatar, setGroupAvatar] = useState('📚');
  const [groupPrivate, setGroupPrivate] = useState(false);
  const [groupRules, setGroupRules] = useState('Be kind and keep messages on-topic.');
  const [groupFeedback, setGroupFeedback] = useState('');

  const [search, setSearch] = useState('');
  const [directComposerOpen, setDirectComposerOpen] = useState(false);
  const [groupComposerOpen, setGroupComposerOpen] = useState(false);
  const [dmAtBottom, setDmAtBottom] = useState(true);
  const [groupAtBottom, setGroupAtBottom] = useState(true);

  const dmScrollRef = useRef<HTMLDivElement | null>(null);
  const groupScrollRef = useRef<HTMLDivElement | null>(null);

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

  const scrollToBottom = (target: 'dm' | 'group') => {
    const el = target === 'dm' ? dmScrollRef.current : groupScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeThread) {
      setTimeout(() => scrollToBottom('dm'), 0);
    }
  }, [activeThread?.id]);

  useEffect(() => {
    if (activeGroup) {
      setTimeout(() => scrollToBottom('group'), 0);
    }
  }, [activeGroup?.id]);

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
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ type: 'spring', stiffness: 280, damping: 30 }} className="max-w-md mx-auto min-h-screen flex flex-col bg-white pb-20" onMouseMove={(e) => e.clientY > window.innerHeight - 140 && setDirectComposerOpen(true)}>
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button onClick={closeDirectThread} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeft size={20} /></button>
          <button onClick={() => {
            const targetStory = stories.find((story) => story.userId === activeThreadUser.id);
            if (targetStory) openStoryViewer(targetStory.id);
          }} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-200 to-pink-200 flex items-center justify-center text-xl">{activeThreadUser.avatar}</button>
          <div className="flex-1">
            <button onClick={() => openUserProfile(activeThreadUser.id)} className="font-bold text-gray-900">{activeThreadUser.displayName}</button>
            <p className="text-xs text-gray-500">@{activeThreadUser.username}</p>
          </div>
          <button onClick={() => setShowDirectDetails(true)} className="p-2 rounded-full hover:bg-gray-100"><SlidersHorizontal size={18} className="text-gray-500" /></button>
        </header>

        <div ref={dmScrollRef} onScroll={(e) => {
          const el = e.currentTarget;
          const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
          setDmAtBottom(atBottom);
        }} className={`flex-1 overflow-y-auto p-4 space-y-3 transition-colors ${background}`} onClick={(e) => {
          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          if (e.clientY > rect.bottom - 120) setDirectComposerOpen(true);
        }}>
          {activeThread.messages.length === 0 && <p className="text-sm text-gray-500 text-center">Start your first message.</p>}
          {activeThread.messages.map((message, index) => {
            const mine = message.senderId === user.id;
            return (
              <motion.div key={message.id} initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: Math.min(index * 0.03, 0.2), type: 'spring', stiffness: 420, damping: 30 }} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${mine ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                  <p>{message.content}</p>
                  <p className={`mt-1 text-[10px] ${mine ? 'text-primary-100' : 'text-gray-400'}`}>{message.type}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {!dmAtBottom && (
          <button onClick={() => scrollToBottom('dm')} className="absolute bottom-28 right-4 z-30 h-10 w-10 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center text-gray-600">
            <ChevronDown size={18} />
          </button>
        )}

        <div className="absolute bottom-20 left-0 right-0 z-20">
          <ChatComposer isOpen={directComposerOpen} onReveal={() => setDirectComposerOpen(true)} onSend={({ content, type }) => sendDirectMessage(activeThread.id, { content, type: type as DirectMessage['type'] })} />
        </div>

        <AnimatePresence>
          {showDirectDetails && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end p-4">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowDirectDetails(false)} />
              <motion.div initial={{ y: 24 }} animate={{ y: 0 }} exit={{ y: 20 }} className="relative z-10 w-full rounded-3xl bg-white p-5">
                <h3 className="font-bold text-gray-900 mb-3">Chat details</h3>
                <p className="text-xs text-gray-500 mb-2">Wallpaper</p>
                <div className="flex gap-2">
                  {chatBackgrounds.map((bg) => (
                    <button key={bg} onClick={() => setDirectChatBackground(activeThread.id, bg)} className={`h-8 w-8 rounded-full border ${bg}`} />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  if (activeGroup) {
    const isAdmin = activeGroup.ownerId === user.id || activeGroup.adminIds?.includes(user.id);
    const background = groupChatBackgroundByGroupId[activeGroup.id] || 'bg-gray-50';

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ type: 'spring', stiffness: 280, damping: 30 }} className="max-w-md mx-auto min-h-screen flex flex-col bg-white pb-20" onMouseMove={(e) => e.clientY > window.innerHeight - 140 && setGroupComposerOpen(true)}>
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button onClick={closeGroupChat} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeft size={20} /></button>
          <button onClick={() => selectGroup(activeGroup)} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-200 to-pink-200 flex items-center justify-center text-xl">{activeGroup.avatar}</button>
          <div className="flex-1">
            <button onClick={() => selectGroup(activeGroup)} className="font-bold text-gray-900 text-left">{activeGroup.name}</button>
            <p className="text-xs text-gray-500">{activeGroup.isPrivate ? 'Private group' : 'Public group'} • {activeGroup.memberCount} members</p>
          </div>
          <button onClick={() => selectGroup(activeGroup)} className="p-2 rounded-full hover:bg-gray-100"><SlidersHorizontal size={18} className="text-gray-500" /></button>
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

        <div ref={groupScrollRef} onScroll={(e) => {
          const el = e.currentTarget;
          const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
          setGroupAtBottom(atBottom);
        }} className={`flex-1 overflow-y-auto p-4 space-y-3 ${background}`} onClick={(e) => {
          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          if (e.clientY > rect.bottom - 120) setGroupComposerOpen(true);
        }}>
          {activeGroupMessages.map((message, index) => {
            const mine = message.senderId === user.id;
            return (
              <motion.div key={message.id} initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: Math.min(index * 0.03, 0.2), type: 'spring', stiffness: 420, damping: 30 }} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${mine ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                  <p>{message.content}</p>
                  <p className={`mt-1 text-[10px] ${mine ? 'text-primary-100' : 'text-gray-400'}`}>{message.type}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {!groupAtBottom && (
          <button onClick={() => scrollToBottom('group')} className="absolute bottom-28 right-4 z-30 h-10 w-10 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center text-gray-600">
            <ChevronDown size={18} />
          </button>
        )}

        <div className="absolute bottom-20 left-0 right-0 z-20">
          <ChatComposer isOpen={groupComposerOpen} onReveal={() => setGroupComposerOpen(true)} onSend={({ content, type }) => sendGroupMessage(activeGroup.id, { content, type: type as GroupMessage['type'] })} />
        </div>
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
              <p className="text-gray-600 mb-3">{selectedGroup.description}</p>
              <p className="text-xs text-gray-500 mb-2">Wallpaper</p>
              <div className="flex gap-2 mb-6">
                {chatBackgrounds.map((bg) => (
                  <button key={bg} onClick={() => setGroupChatBackground(selectedGroup.id, bg)} className={`h-8 w-8 rounded-full border ${bg}`} />
                ))}
              </div>
              <button onClick={() => openGroupChat(selectedGroup.id)} className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-pink-500 text-white font-medium">Open Group Chat</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
