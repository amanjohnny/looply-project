import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { DirectMessage, GroupMessage, Group } from '../types';
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
  Pin,
  Images,
  Sparkles,
} from 'lucide-react';

const emojiChoices = ['📚', '🧠', '🎯', '💬', '🚀', '🎨'];
const chatBackgrounds = ['bg-gray-50', 'bg-pink-50', 'bg-blue-50', 'bg-gradient-to-br from-pink-50 to-purple-50', 'bg-[radial-gradient(circle_at_top,_#fce7f3,_#fff)]'];

type ComposerMode = 'audio' | 'video';
type OutgoingMessageType = DirectMessage['type'] | GroupMessage['type'];
type StagedAttachmentType = Exclude<OutgoingMessageType, 'text' | 'emoji'>;

interface StagedAttachment {
  type: StagedAttachmentType;
  content: string;
  label: string;
}

interface ChatComposerProps {
  isOpen: boolean;
  onReveal: () => void;
  onCollapse: () => void;
  onSend: (payload: { content: string; type: OutgoingMessageType }) => void;
}

function ChatComposer({ isOpen, onReveal, onCollapse, onSend }: ChatComposerProps) {
  const [value, setValue] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [mode, setMode] = useState<ComposerMode>('audio');
  const [recording, setRecording] = useState(false);
  const [stagedAttachment, setStagedAttachment] = useState<StagedAttachment | null>(null);
  const [helper, setHelper] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const holdTimer = useRef<number | null>(null);
  const collapseTimer = useRef<number | null>(null);
  const longPressActive = useRef(false);
  const touchStartY = useRef<number | null>(null);

  const keepOpen = () => {
    onReveal();
    if (collapseTimer.current) {
      window.clearTimeout(collapseTimer.current);
      collapseTimer.current = null;
    }
  };

  const scheduleCollapse = (delay = 450) => {
    if (collapseTimer.current) window.clearTimeout(collapseTimer.current);
    collapseTimer.current = window.setTimeout(() => {
      if (!isFocused && !showAttachMenu) onCollapse();
    }, delay);
  };

  const stageAttachment = (next: StagedAttachment) => {
    if (stagedAttachment && stagedAttachment.type !== next.type) {
      setHelper(`Replaced ${stagedAttachment.label} with ${next.label}.`);
    } else {
      setHelper(`${next.label} staged. Press send to confirm.`);
    }
    setStagedAttachment(next);
    setShowAttachMenu(false);
    keepOpen();
  };

  const sendPayload = () => {
    const text = value.trim();
    if (!text && !stagedAttachment) {
      setHelper('Add text or stage one item before sending.');
      keepOpen();
      return;
    }

    if (text) onSend({ type: 'text', content: text });
    if (stagedAttachment) onSend({ type: stagedAttachment.type, content: stagedAttachment.content });

    setValue('');
    setStagedAttachment(null);
    setHelper('Sent');
    keepOpen();
    scheduleCollapse(1100);
  };

  const onActionDown = () => {
    longPressActive.current = false;
    holdTimer.current = window.setTimeout(() => {
      longPressActive.current = true;
      setRecording(true);
      keepOpen();
    }, 260);
  };

  const onActionUp = () => {
    if (holdTimer.current) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }

    if (longPressActive.current) {
      stageAttachment({
        type: mode,
        content: mode === 'video' ? '🎥 Video circle (placeholder, up to 1m)' : '🎙️ Voice note (placeholder, up to 1m)',
        label: mode === 'video' ? 'Video circle' : 'Voice note',
      });
      setRecording(false);
      longPressActive.current = false;
      return;
    }

    setMode((prev) => (prev === 'audio' ? 'video' : 'audio'));
  };

  useEffect(() => () => {
    if (collapseTimer.current) window.clearTimeout(collapseTimer.current);
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ height: isOpen ? 178 : 30, y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 360, damping: 34 }}
      className="relative overflow-visible border-t border-gray-100 bg-white/95 backdrop-blur"
      onMouseEnter={keepOpen}
      onMouseLeave={() => scheduleCollapse()}
      onTouchStart={(e) => {
        touchStartY.current = e.touches[0]?.clientY ?? null;
      }}
      onTouchEnd={(e) => {
        const endY = e.changedTouches[0]?.clientY;
        if (touchStartY.current == null || endY == null) return;
        const delta = touchStartY.current - endY;
        if (delta > 20) keepOpen();
        if (delta < -28) onCollapse();
      }}
    >
      <button onClick={keepOpen} className="h-[30px] w-full flex items-center justify-center">
        <span className="h-1.5 w-14 rounded-full bg-gray-300" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="px-3 pb-4">
            {stagedAttachment && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-2 flex items-center justify-between rounded-xl border border-primary-100 bg-primary-50 px-3 py-2 text-xs">
                <p className="font-medium text-primary-700">Staged: {stagedAttachment.label}</p>
                <button onClick={() => setStagedAttachment(null)} className="rounded-md px-2 py-1 text-primary-600 hover:bg-primary-100">Remove</button>
              </motion.div>
            )}

            <div className="flex items-end gap-2">
              <div className="relative">
                <button onClick={() => { keepOpen(); setShowAttachMenu((prev) => !prev); }} className="h-10 w-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center"><Paperclip size={18} /></button>
                <AnimatePresence>
                  {showAttachMenu && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute bottom-12 left-0 z-20 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl w-52">
                      {[
                        { label: 'Document', icon: '📄', type: 'document' as StagedAttachmentType, content: '📄 Document placeholder' },
                        { label: 'Image', icon: '🖼️', type: 'image' as StagedAttachmentType, content: '🖼️ Image placeholder' },
                        { label: 'Video circle', icon: '🎬', type: 'video' as StagedAttachmentType, content: '🎬 Video circle placeholder' },
                        { label: 'Gift Collectible', icon: '🎁', type: 'gift' as StagedAttachmentType, content: '🎁 Gift collectible placeholder' },
                      ].map((item) => (
                        <button key={item.label} onClick={() => stageAttachment({ type: item.type, content: item.content, label: item.label })} className="w-full px-3 py-2 rounded-xl text-left text-sm hover:bg-gray-100">{item.icon} {item.label}</button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex-1 rounded-2xl border border-gray-200 bg-white px-3 py-2">
                <div className="mb-1 flex items-center gap-2">
                  <button onClick={() => { keepOpen(); setValue((prev) => `${prev}${prev ? ' ' : ''}😊`); }} className="text-gray-500"><Smile size={16} /></button>
                  <button onClick={() => stageAttachment({ type: 'sticker', content: '🧷 Sticker placeholder', label: 'Sticker' })} className="text-gray-500"><Sticker size={16} /></button>
                  <button onClick={() => stageAttachment({ type: 'image', content: '🖼️ Image placeholder', label: 'Image' })} className="text-gray-500"><ImageIcon size={16} /></button>
                </div>
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onFocus={() => { setIsFocused(true); keepOpen(); }}
                  onBlur={() => { setIsFocused(false); scheduleCollapse(); }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendPayload();
                    }
                  }}
                  placeholder="Message"
                  className="w-full text-sm bg-transparent focus:outline-none"
                />
              </div>

              <button onClick={sendPayload} className="h-10 w-10 rounded-xl bg-primary-500 text-white flex items-center justify-center" title="Send staged message"><Send size={16} /></button>

              {!value.trim() && !stagedAttachment && (
                <button
                  onMouseDown={onActionDown}
                  onMouseUp={onActionUp}
                  onMouseLeave={() => recording && onActionUp()}
                  onTouchStart={onActionDown}
                  onTouchEnd={onActionUp}
                  className={`h-10 w-10 rounded-xl flex items-center justify-center ${recording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600'}`}
                  title="Tap to switch audio/video, hold to stage"
                >
                  <motion.div key={mode} initial={{ scale: 0.6, rotate: -24, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 24 }}>
                    {mode === 'audio' ? <Mic size={16} /> : <Video size={16} />}
                  </motion.div>
                </button>
              )}
            </div>

            {(recording || helper) && <p className={`mt-2 text-[11px] ${recording ? 'text-red-500' : 'text-gray-500'}`}>{recording ? `Recording ${mode}… release to stage placeholder.` : helper}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function GroupProfileSheet({ group, messages, onClose, onOpenStory, onGoToMessage }: { group: Group; messages: GroupMessage[]; onClose: () => void; onOpenStory: (storyId: string) => void; onGoToMessage: (messageId: string) => void }) {
  const stories = useAppStore((s) => s.stories);
  const communityUsers = useAppStore((s) => s.communityUsers);
  const user = useAppStore((s) => s.user);
  const openGroupChat = useAppStore((s) => s.openGroupChat);
  const addGroupParticipant = useAppStore((s) => s.addGroupParticipant);
  const assignGroupAdmin = useAppStore((s) => s.assignGroupAdmin);
  const updateGroupDescription = useAppStore((s) => s.updateGroupDescription);
  const deleteGroup = useAppStore((s) => s.deleteGroup);
  const addGroupStory = useAppStore((s) => s.addGroupStory);
  const pinnedGroupMessageIds = useAppStore((s) => s.pinnedGroupMessageIds);
  const [actionFeedback, setActionFeedback] = useState('');
  const [browserTab, setBrowserTab] = useState<'media' | 'links' | 'files'>('media');
  const [pickerMode, setPickerMode] = useState<'participant' | 'admin' | null>(null);
  const [pickerSearch, setPickerSearch] = useState('');
  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState(group.description || '');
  const [storyDraft, setStoryDraft] = useState('');

  const groupStories = stories.filter((story) => story.groupId === group.id || group.adminIds?.includes(story.userId) || story.userId === group.ownerId);
  const messageById = new Map(messages.map((message) => [message.id, message]));
  const pinnedMessages = (pinnedGroupMessageIds[group.id] || []).map((id) => messageById.get(id)).filter(Boolean) as GroupMessage[];
  const mediaItems = messages.filter((message) => ['image', 'video', 'sticker'].includes(message.type));
  const linkItems = messages.filter((message) => /(https?:\/\/\S+)/i.test(message.content));
  const fileItems = messages.filter((message) => ['document', 'gift'].includes(message.type) || /document/i.test(message.content));

  const owner = communityUsers.find((member) => member.id === group.ownerId);
  const memberIds = group.memberIds || [group.ownerId];
  const admins = communityUsers.filter((member) => group.adminIds?.includes(member.id));
  const members = communityUsers.filter((member) => memberIds.includes(member.id));
  const canManage = group.ownerId === user.id || group.adminIds?.includes(user.id);

  const pickerCandidates = communityUsers.filter((member) => {
    const query = pickerSearch.trim().toLowerCase();
    const match = !query || member.displayName.toLowerCase().includes(query) || member.username.toLowerCase().includes(query);
    if (!match) return false;
    if (pickerMode === 'participant') return !memberIds.includes(member.id);
    if (pickerMode === 'admin') return memberIds.includes(member.id) && !(group.adminIds || []).includes(member.id);
    return false;
  });

  const contentItems = browserTab === 'media' ? mediaItems : browserTab === 'links' ? linkItems : fileItems;

  const addStory = () => {
    const result = addGroupStory(group.id, { caption: storyDraft, media: '✨' });
    if (!result.ok) {
      setActionFeedback(result.error || 'Unable to add story.');
      return;
    }
    setStoryDraft('');
    setActionFeedback('Group story added.');
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const min = Math.max(1, Math.floor(diff / 60000));
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    return `${Math.floor(hr / 24)}d ago`;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-white">
      <div className="absolute inset-0 bg-black/10" onClick={onClose} />
      <motion.div initial={{ y: 32, opacity: 0.8 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} className="relative z-10 h-full overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Group info</h3>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100"><X size={18} /></button>
        </div>

        <section className="px-4 pt-4 pb-3 bg-gradient-to-b from-primary-50 to-white border-b border-gray-100">
          <div className="mx-auto h-20 w-20 rounded-3xl bg-gradient-to-br from-primary-200 to-pink-200 flex items-center justify-center text-4xl shadow-sm">{group.avatar}</div>
          <h2 className="mt-3 text-center text-xl font-bold text-gray-900">{group.name}</h2>
          <p className="text-center text-xs text-gray-500">@{group.username} • {group.inviteCode}</p>
          <p className="mt-1 text-center text-xs text-gray-500">{group.isPrivate ? 'Private group' : 'Public group'} • {group.memberCount} participants</p>
          <p className="mt-2 text-center text-sm text-gray-600">{group.description || 'No description yet.'}</p>
        </section>

        <section className="px-4 py-3">
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => openGroupChat(group.id)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-primary-300 hover:bg-primary-50/40">Open chat</button>
            <button onClick={() => setPickerMode('participant')} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-primary-300 hover:bg-primary-50/40">Invite member</button>
            <button onClick={() => setPickerMode('admin')} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-primary-300 hover:bg-primary-50/40">Assign co-admin</button>
            <button onClick={() => setEditingDescription(true)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-primary-300 hover:bg-primary-50/40">Edit group</button>
            <button onClick={async () => { try { await navigator.clipboard.writeText(group.inviteCode); setActionFeedback('Invite code copied.'); } catch { setActionFeedback(`Invite code: ${group.inviteCode}`); } }} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-primary-300 hover:bg-primary-50/40">Share invite</button>
            <button
              onClick={() => {
                if (!canManage) {
                  setActionFeedback('Only admins can delete.');
                  return;
                }
                const ok = window.confirm('Delete this group permanently?');
                if (!ok) return;
                deleteGroup(group.id);
                onClose();
              }}
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
            >
              Delete group
            </button>
          </div>
          {actionFeedback && <p className="mt-2 text-xs text-primary-600">{actionFeedback}</p>}
        </section>

        <div className="px-4 pb-6 space-y-3">
          <section className="rounded-2xl border border-gray-100 bg-white p-4"><h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4><p className="text-sm text-gray-600">{group.description || 'No description provided.'}</p></section>
          <section className="rounded-2xl border border-gray-100 bg-white p-4"><h4 className="text-sm font-semibold text-gray-900 mb-2">Rules</h4><p className="text-sm text-gray-600">{group.rules || 'No rules set.'}</p></section>

          <section className="rounded-2xl border border-gray-100 bg-white p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2"><Pin size={14} />Pinned items</h4>
            {pinnedMessages.length === 0 ? <p className="text-xs text-gray-500">No pinned items yet.</p> : pinnedMessages.map((message) => {
              const sender = communityUsers.find((member) => member.id === message.senderId);
              return <button key={message.id} onClick={() => { onGoToMessage(message.id); onClose(); }} className="block w-full text-left text-xs text-gray-600 py-1 hover:text-primary-600">{sender?.displayName || 'Member'}: {message.content}</button>;
            })}
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><Images size={14} />Shared content</h4>
              <div className="grid grid-cols-3 gap-1 rounded-lg bg-gray-100 p-1 text-[11px]">
                {(['media', 'links', 'files'] as const).map((tab) => (
                  <button key={tab} onClick={() => setBrowserTab(tab)} className={`rounded-md px-2 py-1 capitalize ${browserTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>{tab}</button>
                ))}
              </div>
            </div>
            {contentItems.length === 0 ? <p className="text-xs text-gray-500">No {browserTab} items yet.</p> : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {contentItems.map((item) => {
                  const sender = communityUsers.find((member) => member.id === item.senderId);
                  return (
                    <div key={item.id} className="rounded-xl border border-gray-100 bg-gray-50 p-2">
                      <p className="text-xs font-medium text-gray-700">{item.content}</p>
                      <p className="mt-1 text-[11px] text-gray-500">{sender?.displayName || 'Member'} • {formatTime(item.createdAt)}</p>
                      <button onClick={() => { onGoToMessage(item.id); onClose(); }} className="mt-1 text-[11px] text-primary-600">Go to message</button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2"><Sparkles size={14} />Group stories</h4>
            {groupStories.length === 0 ? <p className="text-xs text-gray-500">No group stories yet.</p> : <div className="flex gap-2 overflow-x-auto pb-1">{groupStories.map((story) => <button key={story.id} onClick={() => onOpenStory(story.id)} className="shrink-0 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-xs">{story.avatar} {story.username}</button>)}</div>}
            {canManage && (
              <div className="mt-2 flex gap-2">
                <input value={storyDraft} onChange={(e) => setStoryDraft(e.target.value)} className="flex-1 rounded-lg border border-gray-200 px-2 py-1 text-xs" placeholder="Story caption" />
                <button onClick={addStory} className="rounded-lg bg-primary-500 px-3 py-1 text-xs text-white">Add</button>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Members & admins</h4>
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Owner</p>
              <p className="text-sm text-gray-700">{owner?.displayName || 'Unknown owner'}</p>
              <p className="pt-1 text-xs text-gray-500">Admins / co-admins</p>
              <div className="flex flex-wrap gap-2">{admins.map((admin) => <span key={admin.id} className="rounded-full bg-primary-50 px-2 py-1 text-xs text-primary-700">{admin.displayName}</span>)}</div>
              <p className="pt-1 text-xs text-gray-500">Members</p>
              <div className="flex flex-wrap gap-2">{members.map((member) => <span key={member.id} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">{member.displayName}</span>)}</div>
            </div>
          </section>
        </div>

        <AnimatePresence>
          {pickerMode && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 bg-black/30 flex items-end">
              <motion.div initial={{ y: 18 }} animate={{ y: 0 }} exit={{ y: 18 }} className="w-full rounded-t-3xl bg-white p-4 max-h-[70%] overflow-y-auto">
                <div className="mb-2 flex items-center justify-between"><h5 className="font-semibold text-sm text-gray-900">{pickerMode === 'participant' ? 'Add participants' : 'Assign co-admin'}</h5><button onClick={() => setPickerMode(null)} className="p-1"><X size={16} /></button></div>
                <input value={pickerSearch} onChange={(e) => setPickerSearch(e.target.value)} placeholder="Search users" className="mb-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                <div className="space-y-2">{pickerCandidates.map((candidate) => <button key={candidate.id} onClick={() => { if (pickerMode === 'participant') addGroupParticipant(group.id, candidate.id); else assignGroupAdmin(group.id, candidate.id); setPickerMode(null); setActionFeedback(`${candidate.displayName} updated.`); }} className="w-full rounded-xl border border-gray-100 px-3 py-2 text-left text-sm hover:bg-gray-50">{candidate.displayName} <span className="text-xs text-gray-400">@{candidate.username}</span></button>)}</div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {editingDescription && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 bg-black/30 flex items-end">
              <motion.div initial={{ y: 18 }} animate={{ y: 0 }} exit={{ y: 18 }} className="w-full rounded-t-3xl bg-white p-4">
                <div className="mb-2 flex items-center justify-between"><h5 className="font-semibold text-sm text-gray-900">Edit description</h5><button onClick={() => setEditingDescription(false)} className="p-1"><X size={16} /></button></div>
                <textarea value={descriptionDraft} onChange={(e) => setDescriptionDraft(e.target.value)} rows={4} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                <button onClick={() => { updateGroupDescription(group.id, descriptionDraft); setEditingDescription(false); setActionFeedback('Description updated.'); }} className="mt-2 w-full rounded-lg bg-primary-500 py-2 text-sm text-white">Save</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
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
    togglePinGroupMessage,
    pinnedGroupMessageIds,
    directChatBackgroundByThreadId,
    groupChatBackgroundByGroupId,
    setDirectChatBackground,
    setGroupChatBackground,
    openUserProfile,
    stories,
    openStoryViewer,
  } = useAppStore();
  const challengeRequests = useAppStore((state) => state.challengeRequests || []);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDirectDetails, setShowDirectDetails] = useState(false);
  const [showGroupDetails, setShowGroupDetails] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupAvatar, setGroupAvatar] = useState('📚');
  const [groupUsername, setGroupUsername] = useState('');
  const [groupPrivate, setGroupPrivate] = useState(false);
  const [groupRules, setGroupRules] = useState('Be kind and keep messages on-topic.');
  const [groupFeedback, setGroupFeedback] = useState('');

  const [search, setSearch] = useState('');
  const [directComposerOpen, setDirectComposerOpen] = useState(false);
  const [groupComposerOpen, setGroupComposerOpen] = useState(false);
  const [dmAtBottom, setDmAtBottom] = useState(true);
  const [groupAtBottom, setGroupAtBottom] = useState(true);
  const [dmUnreadCount, setDmUnreadCount] = useState(0);
  const [groupUnreadCount, setGroupUnreadCount] = useState(0);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);

  const dmScreenRef = useRef<HTMLDivElement | null>(null);
  const groupScreenRef = useRef<HTMLDivElement | null>(null);
  const dmScrollRef = useRef<HTMLDivElement | null>(null);
  const groupScrollRef = useRef<HTMLDivElement | null>(null);
  const dmDockRef = useRef<HTMLDivElement | null>(null);
  const groupDockRef = useRef<HTMLDivElement | null>(null);
  const dmPrevCount = useRef(0);
  const groupPrevCount = useRef(0);

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
  const challengeRequestById = useMemo(() => Object.fromEntries(challengeRequests.map((request) => [request.id, request])), [challengeRequests]);
  const formatChallengeReward = (requestId: string) => {
    const request = challengeRequestById[requestId];
    if (!request) return '';
    return request.reward.kind === 'coins'
      ? `${request.reward.amount} coins`
      : `${request.reward.collectibleImage} ${request.reward.collectibleName}`;
  };

  const scrollToBottom = (target: 'dm' | 'group') => {
    const el = target === 'dm' ? dmScrollRef.current : groupScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  };

  const scrollToMessage = (messageId: string) => {
    if (!groupScrollRef.current) return;
    const target = groupScrollRef.current.querySelector(`[data-message-id="${messageId}"]`) as HTMLElement | null;
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlightedMessageId(messageId);
    window.setTimeout(() => setHighlightedMessageId((current) => (current === messageId ? null : current)), 1600);
  };


  useEffect(() => {
    if (activeThread) {
      setTimeout(() => scrollToBottom('dm'), 0);
      setDirectComposerOpen(false);
      setShowDirectDetails(false);
      setDmUnreadCount(0);
      dmPrevCount.current = activeThread.messages.length;
    }
  }, [activeThread?.id]);

  useEffect(() => {
    if (activeGroup) {
      setTimeout(() => scrollToBottom('group'), 0);
      setGroupComposerOpen(false);
      setShowGroupDetails(false);
      setGroupUnreadCount(0);
      groupPrevCount.current = activeGroupMessages.length;
    }
  }, [activeGroup?.id]);


  useEffect(() => {
    if (!activeThread) return;
    const nextLen = activeThread.messages.length;
    const delta = Math.max(0, nextLen - dmPrevCount.current);
    if (!dmAtBottom && delta > 0) {
      setDmUnreadCount((prev) => Math.min(999, prev + delta));
    }
    dmPrevCount.current = nextLen;
  }, [activeThread?.messages.length, dmAtBottom]);

  useEffect(() => {
    if (!activeGroup) return;
    const nextLen = activeGroupMessages.length;
    const delta = Math.max(0, nextLen - groupPrevCount.current);
    if (!groupAtBottom && delta > 0) {
      setGroupUnreadCount((prev) => Math.min(999, prev + delta));
    }
    groupPrevCount.current = nextLen;
  }, [activeGroupMessages.length, groupAtBottom, activeGroup]);


  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (directComposerOpen && dmDockRef.current && !dmDockRef.current.contains(target)) {
        setDirectComposerOpen(false);
      }
      if (groupComposerOpen && groupDockRef.current && !groupDockRef.current.contains(target)) {
        setGroupComposerOpen(false);
      }
    };

    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [directComposerOpen, groupComposerOpen]);

  const handleCreateGroup = () => {
    const result = createGroup({ name: groupName, description: groupDescription, avatar: groupAvatar, username: groupUsername });
    if (!result.ok) {
      setGroupFeedback(result.error || 'Unable to create group.');
      return;
    }

    const latestCreated = useAppStore.getState().groups[0];
    if (latestCreated) {
      updateGroupMeta(latestCreated.id, { rules: groupRules, adminIdToAdd: user.id });
      if (groupPrivate) {
        useAppStore.setState((state) => ({ groups: state.groups.map((g) => (g.id === latestCreated.id ? { ...g, isPrivate: true } : g)) }));
      }
    }

    setGroupName('');
    setGroupDescription('');
    setGroupAvatar('📚');
    setGroupUsername('');
    setGroupPrivate(false);
    setGroupRules('Be kind and keep messages on-topic.');
    setGroupFeedback('Group created.');
    setShowCreateModal(false);
  };

  if (activeThread && activeThreadUser) {
    const background = directChatBackgroundByThreadId[activeThread.id] || 'bg-gray-50';
    const dmDockInset = directComposerOpen ? 206 : 44;

    return (
      <motion.div ref={dmScreenRef} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ type: 'spring', stiffness: 280, damping: 30 }} className="relative max-w-md mx-auto h-screen flex flex-col bg-white overflow-hidden">
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button onClick={closeDirectThread} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeft size={20} /></button>
          <button onClick={() => { const targetStory = stories.find((story) => story.userId === activeThreadUser.id); if (targetStory) openStoryViewer(targetStory.id); }} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-200 to-pink-200 flex items-center justify-center text-xl">{activeThreadUser.avatar}</button>
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
          if (atBottom) setDmUnreadCount(0);
        }} className={`flex-1 overflow-y-auto p-4 space-y-3 transition-colors ${background}`} style={{ paddingBottom: dmDockInset }}>
          {activeThread.messages.length === 0 && <p className="text-sm text-gray-500 text-center">Start your first message.</p>}
          {activeThread.messages.map((message, index) => {
            const mine = message.senderId === user.id;
            return (
              <motion.div data-message-id={message.id} key={message.id} initial={{ opacity: 0, y: 22, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: Math.min(index * 0.05, 0.28), type: 'spring', stiffness: 300, damping: 17, mass: 0.62 }} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm transition-colors ${highlightedMessageId === message.id ? 'ring-2 ring-primary-300' : ''} ${mine ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                  {message.type === 'challenge_request' && message.challengeRequestId && challengeRequestById[message.challengeRequestId] ? (
                    <div className="space-y-1">
                      <p className={`text-[10px] font-semibold uppercase ${mine ? 'text-primary-100' : 'text-primary-600'}`}>Challenge Request</p>
                      <p className="font-medium">{challengeRequestById[message.challengeRequestId].title}</p>
                      <p className={`text-[11px] ${mine ? 'text-primary-100' : 'text-gray-500'}`}>{formatChallengeReward(message.challengeRequestId)}</p>
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                  <p className={`mt-1 text-[10px] ${mine ? 'text-primary-100' : 'text-gray-400'}`}>{message.type}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {!dmAtBottom && (
            <motion.button
              onClick={() => { scrollToBottom('dm'); setDmUnreadCount(0); }}
              initial={{ opacity: 0, scale: 0.75, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.82, y: 8 }}
              transition={{ type: 'spring', stiffness: 360, damping: 24 }}
              className="absolute bottom-24 left-4 z-30 h-10 w-10 rounded-full bg-white/95 border border-gray-200 shadow-lg flex items-center justify-center text-gray-600"
            >
              <ChevronDown size={18} />
              {dmUnreadCount > 0 && (
                <motion.span
                  key={dmUnreadCount > 99 ? '99+' : dmUnreadCount}
                  initial={{ scale: 0.72, opacity: 0.7, y: 2 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                  className="absolute -top-1 -right-1 min-w-[18px] px-1 h-[18px] rounded-full bg-primary-500 text-white text-[10px] leading-[18px] text-center"
                >
                  {dmUnreadCount > 99 ? '99+' : dmUnreadCount}
                </motion.span>
              )}
            </motion.button>
          )}
        </AnimatePresence>

        <div className="absolute inset-x-0 bottom-0 z-20 h-16" onMouseEnter={() => setDirectComposerOpen(true)} onClick={() => setDirectComposerOpen(true)} onTouchStart={() => setDirectComposerOpen(true)} />

        <div ref={dmDockRef} className="absolute inset-x-0 bottom-0 z-30 pointer-events-none">
          <div className="pointer-events-auto">
            <ChatComposer isOpen={directComposerOpen} onReveal={() => setDirectComposerOpen(true)} onCollapse={() => setDirectComposerOpen(false)} onSend={({ content, type }) => sendDirectMessage(activeThread.id, { content, type: type as DirectMessage['type'] })} />
          </div>
        </div>

        <AnimatePresence>
          {showDirectDetails && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-end p-4"><div className="absolute inset-0 bg-black/40" onClick={() => setShowDirectDetails(false)} /><motion.div initial={{ y: 24 }} animate={{ y: 0 }} exit={{ y: 20 }} className="relative z-10 w-full rounded-3xl bg-white p-5 border border-gray-100 max-h-[70%] overflow-y-auto"><h3 className="font-bold text-gray-900 mb-3">Chat details</h3><p className="text-xs text-gray-500 mb-2">Wallpaper</p><div className="flex gap-2 flex-wrap">{chatBackgrounds.map((bg) => <button key={bg} onClick={() => setDirectChatBackground(activeThread.id, bg)} className={`h-8 w-8 rounded-full border ${bg}`} />)}</div></motion.div></motion.div>}
        </AnimatePresence>
      </motion.div>
    );
  }

  if (activeGroup) {
    const isAdmin = activeGroup.ownerId === user.id || activeGroup.adminIds?.includes(user.id);
    const background = groupChatBackgroundByGroupId[activeGroup.id] || 'bg-gray-50';
    const groupDockInset = groupComposerOpen ? 206 : 44;
    const currentGroupId = activeGroup.id;
    const canPinMessages = activeGroup.ownerId === user.id || activeGroup.adminIds?.includes(user.id);

    return (
      <motion.div ref={groupScreenRef} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ type: 'spring', stiffness: 280, damping: 30 }} className="relative max-w-md mx-auto h-screen flex flex-col bg-white overflow-hidden">
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button onClick={closeGroupChat} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeft size={20} /></button>
          <button onClick={() => setShowGroupDetails(true)} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-200 to-pink-200 flex items-center justify-center text-xl">{activeGroup.avatar}</button>
          <div className="flex-1">
            <button onClick={() => setShowGroupDetails(true)} className="font-bold text-gray-900 text-left">{activeGroup.name}</button>
            <p className="text-xs text-gray-500">@{activeGroup.username} • {activeGroup.isPrivate ? 'Private group' : 'Public group'}</p>
          </div>
          <button onClick={() => setShowGroupDetails(true)} className="p-2 rounded-full hover:bg-gray-100"><SlidersHorizontal size={18} className="text-gray-500" /></button>
        </header>

        <div className="px-4 py-2 bg-white border-b border-gray-100">
          <p className="text-xs text-gray-500 flex items-center gap-1"><Shield size={12} />Rules: {activeGroup.rules || 'No rules yet.'}</p>
          {isAdmin && <div className="mt-2 flex gap-2"><button onClick={() => inviteMemberToGroup(activeGroup.id)} className="text-xs rounded-lg bg-gray-100 px-2 py-1">Invite member</button><button onClick={() => updateGroupMeta(activeGroup.id, { adminIdToAdd: 'u2' })} className="text-xs rounded-lg bg-gray-100 px-2 py-1">Assign co-admin</button></div>}
        </div>

        <div ref={groupScrollRef} onScroll={(e) => {
          const el = e.currentTarget;
          const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
          setGroupAtBottom(atBottom);
          if (atBottom) setGroupUnreadCount(0);
        }} className={`flex-1 overflow-y-auto p-4 space-y-3 ${background}`} style={{ paddingBottom: groupDockInset }}>
          {activeGroupMessages.map((message, index) => {
            const mine = message.senderId === user.id;
            return (
              <motion.div data-message-id={message.id} key={message.id} initial={{ opacity: 0, y: 22, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: Math.min(index * 0.05, 0.28), type: 'spring', stiffness: 300, damping: 17, mass: 0.62 }} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm transition-colors ${highlightedMessageId === message.id ? 'ring-2 ring-primary-300' : ''} ${mine ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                  {message.type === 'challenge_request' && message.challengeRequestId && challengeRequestById[message.challengeRequestId] ? (
                    <div className="space-y-1">
                      <p className={`text-[10px] font-semibold uppercase ${mine ? 'text-primary-100' : 'text-primary-600'}`}>Challenge Request</p>
                      <p className="font-medium">{challengeRequestById[message.challengeRequestId].title}</p>
                      <p className={`text-[11px] ${mine ? 'text-primary-100' : 'text-gray-500'}`}>{formatChallengeReward(message.challengeRequestId)}</p>
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className={`text-[10px] ${mine ? 'text-primary-100' : 'text-gray-400'}`}>{message.type}</p>
                    {canPinMessages && (
                      <button onClick={() => togglePinGroupMessage(currentGroupId, message.id)} className={`text-[10px] ${(pinnedGroupMessageIds[currentGroupId] || []).includes(message.id) ? 'text-yellow-500' : mine ? 'text-primary-100' : 'text-gray-400'}`}>Pin</button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {!groupAtBottom && (
            <motion.button
              onClick={() => { scrollToBottom('group'); setGroupUnreadCount(0); }}
              initial={{ opacity: 0, scale: 0.75, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.82, y: 8 }}
              transition={{ type: 'spring', stiffness: 360, damping: 24 }}
              className="absolute bottom-24 left-4 z-30 h-10 w-10 rounded-full bg-white/95 border border-gray-200 shadow-lg flex items-center justify-center text-gray-600"
            >
              <ChevronDown size={18} />
              {groupUnreadCount > 0 && (
                <motion.span
                  key={groupUnreadCount > 99 ? '99+' : groupUnreadCount}
                  initial={{ scale: 0.72, opacity: 0.7, y: 2 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                  className="absolute -top-1 -right-1 min-w-[18px] px-1 h-[18px] rounded-full bg-primary-500 text-white text-[10px] leading-[18px] text-center"
                >
                  {groupUnreadCount > 99 ? '99+' : groupUnreadCount}
                </motion.span>
              )}
            </motion.button>
          )}
        </AnimatePresence>

        <div className="absolute inset-x-0 bottom-0 z-20 h-16" onMouseEnter={() => setGroupComposerOpen(true)} onClick={() => setGroupComposerOpen(true)} onTouchStart={() => setGroupComposerOpen(true)} />

        <div ref={groupDockRef} className="absolute inset-x-0 bottom-0 z-30 pointer-events-none">
          <div className="pointer-events-auto">
            <ChatComposer isOpen={groupComposerOpen} onReveal={() => setGroupComposerOpen(true)} onCollapse={() => setGroupComposerOpen(false)} onSend={({ content, type }) => sendGroupMessage(activeGroup.id, { content, type: type as GroupMessage['type'] })} />
          </div>
        </div>

        <AnimatePresence>
          {showGroupDetails && <GroupProfileSheet group={activeGroup} messages={activeGroupMessages} onClose={() => setShowGroupDetails(false)} onOpenStory={(storyId) => openStoryViewer(storyId)} onGoToMessage={scrollToMessage} />}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative max-w-md mx-auto pb-20 overflow-hidden">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">Chats</h1>
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-1 px-3 py-1.5 bg-primary-500 text-white rounded-full text-sm font-medium"><Plus size={16} />Create Group</button>
        </div>
      </header>

      <div className="p-4 space-y-6">
        <div className="bg-white rounded-2xl p-3 shadow-card">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2"><Search size={16} className="text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search profiles by name or @username" className="w-full bg-transparent text-sm focus:outline-none" /></div>
          {search.trim() && <div className="mt-3 space-y-2">{filteredProfiles.length === 0 ? <p className="text-xs text-gray-500">No matching profiles.</p> : filteredProfiles.map((profile) => <button key={profile.id} onClick={() => openDirectThread(profile.id)} className="w-full rounded-xl border border-gray-100 p-2 flex items-center gap-3 hover:border-primary-200 hover:bg-primary-50/50 transition-colors"><div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-200 to-pink-200 flex items-center justify-center text-lg">{profile.avatar}</div><div className="text-left flex-1"><p className="text-sm font-semibold text-gray-900">{profile.displayName}</p><p className="text-xs text-gray-500">@{profile.username}</p></div><MessageCircle size={16} className="text-primary-500" /></button>)}</div>}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Direct Messages</h2>
          <div className="space-y-3">{directConversations.length === 0 ? <p className="text-sm text-gray-500">No direct messages yet. Search a profile to start.</p> : directConversations.map((item, index) => item && <motion.button key={item.thread.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} onClick={() => openDirectThread(item.profile.id)} className="w-full bg-white rounded-2xl p-4 shadow-card text-left"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-200 to-pink-200 flex items-center justify-center text-xl">{item.profile.avatar}</div><div className="flex-1"><p className="font-semibold text-gray-900">{item.profile.displayName}</p><p className="text-xs text-gray-500 line-clamp-1">{item.lastMessage?.content || 'Start chatting'}</p></div></div></motion.button>)}</div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Groups</h2>
          <div className="space-y-3">{groups.map((group, index) => <motion.div key={group.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} onClick={() => openGroupChat(group.id)} className="bg-white rounded-2xl p-4 shadow-card cursor-pointer hover:shadow-card-hover transition-all"><div className="flex items-center gap-4"><div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-200 to-pink-200 flex items-center justify-center text-2xl">{group.avatar}</div><div className="flex-1"><div className="flex items-center gap-2"><h3 className="font-semibold text-gray-900">{group.name}</h3>{group.ownerId === user.id && <Crown className="text-yellow-500" size={14} />}{group.isPrivate && <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Private</span>}</div><p className="text-gray-500 text-sm line-clamp-1">{group.description}</p><p className="text-[11px] text-gray-400 mt-1">@{group.username} • {group.inviteCode}</p><div className="flex items-center gap-3 mt-2 text-xs text-gray-400"><div className="flex items-center gap-1"><Users size={14} /><span>{group.memberCount}</span></div><div className="flex items-center gap-1"><Award size={14} /><span>{group.challengesCreated}</span></div></div></div></div></motion.div>)}</div>
        </div>
      </div>

      <AnimatePresence>
        {showCreateModal && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} /><motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative z-10 bg-white rounded-3xl p-6 w-full max-w-md max-h-[90%] overflow-y-auto"><button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="text-gray-400" size={20} /></button><h2 className="text-xl font-bold text-gray-900 mb-1">Create Group</h2><p className="text-sm text-gray-500 mb-4">Start a challenge-focused community.</p><div className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-2">Group name</label><input value={groupName} onChange={(e) => { setGroupName(e.target.value); if (!groupUsername) setGroupUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20)); }} type="text" placeholder="Enter group name..." className="input-field" /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Group username</label><input value={groupUsername} onChange={(e) => setGroupUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} type="text" placeholder="example: studycrew" className="input-field" /><p className="mt-1 text-[11px] text-gray-400">3-20 chars, lowercase letters/numbers/underscore.</p></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Description</label><textarea value={groupDescription} onChange={(e) => setGroupDescription(e.target.value)} placeholder="What is this group about?" rows={3} className="input-field resize-none" /></div><div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2"><span className="text-sm text-gray-600">Private group</span><button onClick={() => setGroupPrivate((prev) => !prev)} className={`h-6 w-11 rounded-full transition-colors ${groupPrivate ? 'bg-primary-500' : 'bg-gray-300'}`}><span className={`block h-5 w-5 bg-white rounded-full transition-transform ${groupPrivate ? 'translate-x-5' : 'translate-x-0.5'}`} /></button></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Basic rules (admin editable)</label><textarea value={groupRules} onChange={(e) => setGroupRules(e.target.value)} rows={2} className="input-field resize-none" /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label><div className="flex gap-2">{emojiChoices.map((emoji) => <button key={emoji} onClick={() => setGroupAvatar(emoji)} className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors ${groupAvatar === emoji ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 hover:bg-primary-50'}`}>{emoji}</button>)}</div></div>{groupFeedback && <p className="text-xs text-primary-600">{groupFeedback}</p>}</div><div className="flex gap-3 mt-6"><button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors">Cancel</button><button onClick={handleCreateGroup} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-pink-500 text-white font-medium shadow-glow-pink">Create</button></div></motion.div></motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        {selectedGroup && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => selectGroup(null)} /><motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative z-10 bg-white rounded-3xl p-6 w-full max-w-md max-h-[90%] overflow-y-auto"><div className="flex items-center gap-4 mb-6"><div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-200 to-pink-200 flex items-center justify-center text-3xl">{selectedGroup.avatar}</div><div><h2 className="text-xl font-bold text-gray-900">{selectedGroup.name}</h2><p className="text-gray-500 text-sm">@{selectedGroup.username} • {selectedGroup.inviteCode}</p></div></div><p className="text-gray-600 mb-3">{selectedGroup.description}</p><p className="text-xs text-gray-500 mb-2">Wallpaper</p><div className="flex gap-2 mb-6 flex-wrap">{chatBackgrounds.map((bg) => <button key={bg} onClick={() => setGroupChatBackground(selectedGroup.id, bg)} className={`h-8 w-8 rounded-full border ${bg}`} />)}</div><button onClick={() => openGroupChat(selectedGroup.id)} className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-pink-500 text-white font-medium">Open Group Chat</button></motion.div></motion.div>}
      </AnimatePresence>
    </motion.div>
  );
}
