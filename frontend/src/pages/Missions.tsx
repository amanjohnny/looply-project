import { useMemo, useState } from 'react';
import Challenges from './Challenges';
import Cases from './Cases';
import { useAppStore } from '../store/useAppStore';
import { AnimatePresence, motion } from 'framer-motion';
import type { ChallengeReward } from '../types';

export default function Missions() {
  const {
    missionsTab: tab,
    setMissionsTab,
    user,
    groups,
    directThreads,
    communityUsers,
    userCollectibleShowcase,
    collectibles,
    reservedCoinAmount,
    reservedCollectibleIds,
    createChallengeRequest,
  } = useAppStore();

  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [rewardType, setRewardType] = useState<'coins' | 'collectible'>('coins');
  const [coinAmount, setCoinAmount] = useState(50);
  const [collectibleId, setCollectibleId] = useState('');
  const [destinationType, setDestinationType] = useState<'feed' | 'group' | 'dm'>('feed');
  const [groupId, setGroupId] = useState('');
  const [threadId, setThreadId] = useState('');
  const [feedback, setFeedback] = useState('');

  const myCollectibles = useMemo(() => (userCollectibleShowcase[user.id] || collectibles).filter((item) => !reservedCollectibleIds.includes(item.id)), [userCollectibleShowcase, user.id, collectibles, reservedCollectibleIds]);
  const availableCoins = user.coins - reservedCoinAmount;

  const threadOptions = useMemo(() => directThreads.map((thread) => {
    const otherId = thread.participantIds.find((id) => id !== user.id);
    const profile = communityUsers.find((u) => u.id === otherId);
    return { id: thread.id, label: profile ? `${profile.displayName} (@${profile.username})` : thread.id };
  }), [directThreads, communityUsers, user.id]);

  const submitChallenge = () => {
    const reward: ChallengeReward = rewardType === 'coins'
      ? { kind: 'coins', amount: coinAmount }
      : (() => {
        const item = myCollectibles.find((c) => c.id === collectibleId);
        return item
          ? { kind: 'collectible', collectibleId: item.id, collectibleName: item.name, collectibleImage: item.image }
          : { kind: 'coins', amount: 0 };
      })();

    const destination = destinationType === 'feed'
      ? { type: 'feed' as const }
      : destinationType === 'group'
      ? { type: 'group' as const, groupId }
      : { type: 'dm' as const, threadId };

    if (destination.type === 'group' && !destination.groupId) return setFeedback('Pick a group destination.');
    if (destination.type === 'dm' && !destination.threadId) return setFeedback('Pick a DM destination.');

    const result = createChallengeRequest({
      title,
      description,
      category,
      difficulty,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      reward,
      destination,
    });

    if (!result.ok) {
      setFeedback(result.error || 'Unable to create challenge request.');
      return;
    }

    setFeedback('Challenge request published.');
    setCreating(false);
    setTitle('');
    setDescription('');
    setCategory('General');
    setDifficulty('medium');
    setDueDate('');
    setRewardType('coins');
    setCoinAmount(50);
    setCollectibleId('');
    setDestinationType('feed');
    setGroupId('');
    setThreadId('');
  };

  return (
    <div>
      <div className="max-w-md mx-auto px-4 pt-3 pb-2 sticky top-0 z-50 bg-gray-50/90 backdrop-blur border-b border-gray-100">
        <div className="mb-2 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Missions</h1>
          <button onClick={() => setCreating(true)} className="rounded-xl bg-gradient-to-r from-primary-500 to-pink-500 px-3 py-1.5 text-xs font-semibold text-white">Create Challenge</button>
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-gray-100 p-1">
          <button onClick={() => setMissionsTab('tasks')} className={`rounded-xl py-2 text-sm font-semibold ${tab === 'tasks' ? 'bg-white text-gray-900 shadow-soft' : 'text-gray-500'}`}>
            Tasks
          </button>
          <button onClick={() => setMissionsTab('rewards')} className={`rounded-xl py-2 text-sm font-semibold ${tab === 'rewards' ? 'bg-white text-gray-900 shadow-soft' : 'text-gray-500'}`}>
            Rewards
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
          {tab === 'tasks' ? <Challenges /> : <Cases />}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {creating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center p-4">
            <div className="absolute inset-0 bg-black/35" onClick={() => setCreating(false)} />
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="relative z-10 w-full max-w-md rounded-3xl bg-white p-4 max-h-[90%] overflow-y-auto space-y-3">
              <h2 className="text-lg font-bold text-gray-900">Create Challenge Request</h2>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Challenge title" className="input-field" />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the challenge" rows={3} className="input-field resize-none" />
              <div className="grid grid-cols-2 gap-2">
                <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="input-field" />
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')} className="input-field">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input-field" />

              <div className="rounded-2xl border border-gray-100 p-3 space-y-2">
                <p className="text-xs font-semibold text-gray-700">Reward (locked on publish)</p>
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
                  <button onClick={() => setRewardType('coins')} className={`rounded-lg py-1.5 text-xs ${rewardType === 'coins' ? 'bg-white shadow-soft' : 'text-gray-500'}`}>Coins</button>
                  <button onClick={() => setRewardType('collectible')} className={`rounded-lg py-1.5 text-xs ${rewardType === 'collectible' ? 'bg-white shadow-soft' : 'text-gray-500'}`}>Collectible</button>
                </div>
                {rewardType === 'coins' ? (
                  <div>
                    <p className="text-xs text-gray-500">Available coins: {availableCoins}</p>
                    <input type="number" min={1} max={Math.max(1, availableCoins)} value={coinAmount} onChange={(e) => setCoinAmount(Number(e.target.value))} className="input-field" />
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-gray-500">Available collectibles: {myCollectibles.length}</p>
                    <select value={collectibleId} onChange={(e) => setCollectibleId(e.target.value)} className="input-field">
                      <option value="">Select collectible</option>
                      {myCollectibles.map((item) => <option key={item.id} value={item.id}>{item.image} {item.name}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-gray-100 p-3 space-y-2">
                <p className="text-xs font-semibold text-gray-700">Destination</p>
                <div className="grid grid-cols-3 gap-2 rounded-xl bg-gray-100 p-1">
                  {(['feed', 'group', 'dm'] as const).map((item) => <button key={item} onClick={() => setDestinationType(item)} className={`rounded-lg py-1.5 text-xs capitalize ${destinationType === item ? 'bg-white shadow-soft' : 'text-gray-500'}`}>{item}</button>)}
                </div>
                {destinationType === 'group' && <select value={groupId} onChange={(e) => setGroupId(e.target.value)} className="input-field"><option value="">Select group</option>{groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}</select>}
                {destinationType === 'dm' && <select value={threadId} onChange={(e) => setThreadId(e.target.value)} className="input-field"><option value="">Select chat</option>{threadOptions.map((thread) => <option key={thread.id} value={thread.id}>{thread.label}</option>)}</select>}
              </div>

              {feedback && <p className="text-xs text-primary-600">{feedback}</p>}

              <div className="flex gap-2">
                <button onClick={() => setCreating(false)} className="flex-1 rounded-xl bg-gray-100 py-2 text-sm font-medium">Cancel</button>
                <button onClick={submitChallenge} className="flex-1 rounded-xl bg-gradient-to-r from-primary-500 to-pink-500 py-2 text-sm font-semibold text-white">Publish</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
