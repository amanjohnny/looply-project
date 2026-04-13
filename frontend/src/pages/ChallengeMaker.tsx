import { useMemo, useState } from 'react';
import { ArrowLeft, Coins, Sparkles, Target, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import type { ChallengeReward, ChallengeRequestDestination } from '../types';

const challengeCategories = ['General', 'Study', 'Fitness', 'Creativity', 'Science', 'Productivity'];

export default function ChallengeMaker() {
  const {
    user,
    groups,
    directThreads,
    communityUsers,
    userCollectibleShowcase,
    collectibles,
    reservedCoinAmount,
    reservedCollectibleIds,
    setCurrentPage,
    createChallengeRequest,
  } = useAppStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [rewardType, setRewardType] = useState<'coins' | 'collectible'>('coins');
  const [coinAmountInput, setCoinAmountInput] = useState('50');
  const [collectibleId, setCollectibleId] = useState('');
  const [destinationType, setDestinationType] = useState<'feed' | 'group' | 'dm'>('feed');
  const [groupId, setGroupId] = useState('');
  const [threadId, setThreadId] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const myCollectibles = useMemo(
    () => (userCollectibleShowcase[user.id] || collectibles).filter((item) => !reservedCollectibleIds.includes(item.id)),
    [userCollectibleShowcase, user.id, collectibles, reservedCollectibleIds],
  );
  const availableCoins = Math.max(0, user.coins - reservedCoinAmount);

  const threadOptions = useMemo(
    () => directThreads.map((thread) => {
      const otherId = thread.participantIds.find((id) => id !== user.id);
      const profile = communityUsers.find((u) => u.id === otherId);
      return { id: thread.id, label: profile ? `${profile.displayName} (@${profile.username})` : thread.id };
    }),
    [directThreads, communityUsers, user.id],
  );

  const selectedCollectible = myCollectibles.find((item) => item.id === collectibleId);

  const validate = (): string | null => {
    if (!title.trim()) return 'Please enter a challenge title.';
    if (!description.trim()) return 'Please enter a challenge description.';

    if (rewardType === 'coins') {
      const amount = Number(coinAmountInput);
      if (!Number.isFinite(amount) || !Number.isInteger(amount)) return 'Coin reward must be a whole number.';
      if (amount <= 0) return 'Coin reward must be greater than zero.';
      if (amount > availableCoins) return 'Coin reward exceeds your available balance.';
    } else if (!selectedCollectible) {
      return 'Select a valid collectible reward that is not reserved.';
    }

    if (destinationType === 'group' && !groupId) return 'Pick a group destination.';
    if (destinationType === 'dm' && !threadId) return 'Pick a DM destination.';

    return null;
  };

  const publishChallenge = () => {
    const error = validate();
    if (error) {
      setFeedback(error);
      return;
    }

    const reward: ChallengeReward = rewardType === 'coins'
      ? { kind: 'coins', amount: Number(coinAmountInput) }
      : {
          kind: 'collectible',
          collectibleId: selectedCollectible!.id,
          collectibleName: selectedCollectible!.name,
          collectibleImage: selectedCollectible!.image,
        };

    const destination: ChallengeRequestDestination = destinationType === 'feed'
      ? { type: 'feed' }
      : destinationType === 'group'
      ? { type: 'group', groupId }
      : { type: 'dm', threadId };

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
      setFeedback(result.error || 'Unable to publish challenge request.');
      return;
    }

    setCurrentPage(destinationType === 'feed' ? 'feed' : 'groups');
  };

  const lockSummary = rewardType === 'coins'
    ? `${Number(coinAmountInput) || 0} coins will be locked until this challenge is completed or rejected.`
    : selectedCollectible
    ? `${selectedCollectible.image} ${selectedCollectible.name} will be locked until this challenge is completed or rejected.`
    : 'Select a collectible to lock it as this challenge reward.';

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-pink-50 pb-24">
      <div className="sticky top-0 z-30 border-b border-primary-100 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-3">
          <button onClick={() => setCurrentPage('missions')} className="rounded-xl bg-gray-100 p-2 text-gray-700">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Challenge Maker</h1>
            <p className="text-xs text-gray-500">Build and publish a challenge request</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-md space-y-4 px-4 pt-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-primary-100 bg-white p-4 shadow-sm">
          <label className="text-xs font-semibold uppercase tracking-wide text-primary-600">Challenge Basics</label>
          <div className="mt-3 space-y-3">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Challenge title" className="input-field" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Challenge description" rows={4} className="input-field resize-none" />
            <div className="grid grid-cols-2 gap-2">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
                {challengeCategories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')} className="input-field">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input-field" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }} className="rounded-3xl border border-primary-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wide text-primary-600">Reward</label>
            <span className="text-[11px] text-gray-500">Available: {availableCoins} coins</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
            <button onClick={() => setRewardType('coins')} className={`rounded-lg py-2 text-xs font-semibold ${rewardType === 'coins' ? 'bg-white text-gray-900 shadow-soft' : 'text-gray-500'}`}>Coin Reward</button>
            <button onClick={() => setRewardType('collectible')} className={`rounded-lg py-2 text-xs font-semibold ${rewardType === 'collectible' ? 'bg-white text-gray-900 shadow-soft' : 'text-gray-500'}`}>Collectible</button>
          </div>

          {rewardType === 'coins' ? (
            <div className="mt-3 space-y-2">
              <div className="rounded-2xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
                <p>Total balance: {user.coins} • Reserved: {reservedCoinAmount} • Available: {availableCoins}</p>
              </div>
              <input
                type="number"
                min={1}
                value={coinAmountInput}
                onChange={(e) => setCoinAmountInput(e.target.value)}
                className="input-field"
                placeholder="Coin amount"
              />
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-gray-500">Available collectibles: {myCollectibles.length}</p>
              <select value={collectibleId} onChange={(e) => setCollectibleId(e.target.value)} className="input-field">
                <option value="">Select collectible</option>
                {myCollectibles.map((item) => <option key={item.id} value={item.id}>{item.image} {item.name}</option>)}
              </select>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-3xl border border-primary-100 bg-white p-4 shadow-sm">
          <label className="text-xs font-semibold uppercase tracking-wide text-primary-600">Destination</label>
          <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-gray-100 p-1">
            {(['feed', 'group', 'dm'] as const).map((item) => (
              <button key={item} onClick={() => setDestinationType(item)} className={`rounded-lg py-2 text-xs font-semibold capitalize ${destinationType === item ? 'bg-white text-gray-900 shadow-soft' : 'text-gray-500'}`}>
                {item}
              </button>
            ))}
          </div>
          {destinationType === 'group' && (
            <select value={groupId} onChange={(e) => setGroupId(e.target.value)} className="mt-3 input-field">
              <option value="">Select group</option>
              {groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
            </select>
          )}
          {destinationType === 'dm' && (
            <select value={threadId} onChange={(e) => setThreadId(e.target.value)} className="mt-3 input-field">
              <option value="">Select DM</option>
              {threadOptions.map((thread) => <option key={thread.id} value={thread.id}>{thread.label}</option>)}
            </select>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="rounded-3xl border border-primary-200 bg-gradient-to-r from-primary-50 to-pink-50 p-4">
          <div className="flex items-center gap-2 text-primary-700">
            <Sparkles size={14} />
            <p className="text-xs font-semibold uppercase tracking-wide">Lock Summary</p>
          </div>
          <p className="mt-2 text-xs text-primary-700">{lockSummary}</p>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-gray-600">
            <Target size={13} />
            <span>Destination: {destinationType === 'feed' ? 'Main Feed' : destinationType === 'group' ? 'Group Chat' : 'Direct Message'}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-600">
            {rewardType === 'coins' ? <Coins size={13} /> : <Trophy size={13} />}
            <span>Reward type: {rewardType === 'coins' ? 'Coins' : 'Collectible'}</span>
          </div>
        </motion.div>

        {feedback && <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{feedback}</p>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-100 bg-white/95 p-3 backdrop-blur safe-area-bottom">
        <div className="mx-auto flex max-w-md gap-2">
          <button onClick={() => setCurrentPage('missions')} className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-semibold text-gray-700">Cancel</button>
          <button onClick={publishChallenge} className="flex-1 rounded-xl bg-gradient-to-r from-primary-500 to-pink-500 py-3 text-sm font-semibold text-white shadow-glow-pink">Publish Challenge</button>
        </div>
      </div>
    </div>
  );
}
