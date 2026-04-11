import { useMemo, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ClipboardList, X } from 'lucide-react';

const mediaOptions = ['✨', '📸', '📝', '🎯', '🔥'];
const groupAvatars = ['📚', '🧠', '💬', '🚀', '🎮', '🎨'];

type CreateMode = 'post' | 'story';

export default function Create() {
  const { user, challenges, createPost, addStory, setCurrentPage } = useAppStore();
  const [mode, setMode] = useState<CreateMode>('post');

  const [postDraft, setPostDraft] = useState('');
  const [postMedia, setPostMedia] = useState('');
  const [selectedChallengeId, setSelectedChallengeId] = useState('');
  const [postFeedback, setPostFeedback] = useState('');
  const [challengePickerOpen, setChallengePickerOpen] = useState(false);

  const [storyCaption, setStoryCaption] = useState('');
  const [storyMedia, setStoryMedia] = useState('✨');
  const [storyFeedback, setStoryFeedback] = useState('');

  const completedChallenges = useMemo(() => challenges.filter((challenge) => challenge.completed), [challenges]);
  const selectedChallenge = useMemo(
    () => completedChallenges.find((item) => item.id === selectedChallengeId) || null,
    [completedChallenges, selectedChallengeId],
  );

  const handleCreatePost = () => {
    const result = createPost({
      content: postDraft,
      media: postMedia || undefined,
      challengeId: selectedChallenge?.id,
      challengeTitle: selectedChallenge?.title,
    });

    if (!result.ok) {
      setPostFeedback(result.error || 'Unable to create post.');
      return;
    }

    setPostDraft('');
    setPostMedia('');
    setSelectedChallengeId('');
    setPostFeedback('Posted! Check your feed.');
    setCurrentPage('feed');
  };

  const handleCreateStory = () => {
    const result = addStory({ caption: storyCaption, media: storyMedia });
    if (!result.ok) {
      setStoryFeedback(result.error || 'Unable to add story.');
      return;
    }

    setStoryCaption('');
    setStoryMedia('✨');
    setStoryFeedback('Story published!');
    setCurrentPage('feed');
  };

  return (
    <div className="max-w-md mx-auto pb-20">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900">Create</h1>
      </header>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-gray-100 p-1">
          <button onClick={() => setMode('post')} className={`rounded-xl py-2 text-sm font-semibold ${mode === 'post' ? 'bg-white text-gray-900 shadow-soft' : 'text-gray-500'}`}>Create Post</button>
          <button onClick={() => setMode('story')} className={`rounded-xl py-2 text-sm font-semibold ${mode === 'story' ? 'bg-white text-gray-900 shadow-soft' : 'text-gray-500'}`}>Create Story</button>
        </div>

        {mode === 'post' ? (
          <div className="bg-white rounded-3xl p-4 shadow-card space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-200 to-pink-200 flex items-center justify-center text-xl">{user.avatar}</div>
              <textarea
                value={postDraft}
                onChange={(e) => setPostDraft(e.target.value)}
                maxLength={280}
                rows={5}
                placeholder="Share your progress..."
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{postDraft.trim().length}/280</span>
              <span className="break-words text-primary-600">{postFeedback}</span>
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
                {mediaOptions.map((m) => (
                  <button key={m} onClick={() => setPostMedia((prev) => (prev === m ? '' : m))} className={`h-8 w-8 rounded-lg border text-lg ${postMedia === m ? 'border-primary-400 bg-primary-50' : 'border-gray-200 bg-white'}`}>{m}</button>
                ))}
              </div>
              <button onClick={handleCreatePost} className="rounded-lg bg-gradient-to-r from-primary-500 to-pink-500 px-4 py-2 text-xs font-semibold text-white shrink-0">Publish</button>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-3 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setChallengePickerOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-primary-300 hover:text-primary-600 transition-colors"
                >
                  <ClipboardList size={16} />
                  Attach completed task
                </button>
                <span className="text-xs text-gray-400">Optional</span>
              </div>

              <div className="rounded-xl bg-white border border-gray-200 px-3 py-2 text-sm text-gray-700">
                {selectedChallenge ? (
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-primary-600">{selectedChallenge.title}</p>
                    <button onClick={() => setSelectedChallengeId('')} className="text-xs text-gray-500 hover:text-gray-700">Clear</button>
                  </div>
                ) : (
                  <p>General</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-4 shadow-card space-y-3">
            <p className="text-sm font-semibold text-gray-800">Story caption</p>
            <textarea
              value={storyCaption}
              onChange={(e) => setStoryCaption(e.target.value)}
              maxLength={120}
              rows={4}
              placeholder="What are you up to right now?"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{storyCaption.trim().length}/120</span>
              <span className="break-words text-primary-600">{storyFeedback}</span>
            </div>
            <div className="flex items-center gap-2">
              <select value={storyMedia} onChange={(e) => setStoryMedia(e.target.value)} className="rounded-lg border border-gray-200 px-2 py-2 text-xs bg-white">
                {mediaOptions.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <button onClick={handleCreateStory} className="rounded-lg bg-gradient-to-r from-primary-500 to-pink-500 px-3 py-2 text-xs font-semibold text-white">Publish Story</button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {challengePickerOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setChallengePickerOpen(false)} />
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="relative z-10 w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl"
            >
              <button onClick={() => setChallengePickerOpen(false)} className="absolute right-3 top-3 p-2 rounded-full hover:bg-gray-100"><X size={18} /></button>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Attach completed task</h2>
              <p className="text-sm text-gray-500 mb-4">Choose what this post is celebrating.</p>

              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                <button
                  onClick={() => {
                    setSelectedChallengeId('');
                    setChallengePickerOpen(false);
                  }}
                  className={`w-full rounded-2xl border p-3 text-left transition-colors ${selectedChallengeId === '' ? 'border-primary-400 bg-primary-50' : 'border-gray-200 hover:border-primary-200'}`}
                >
                  <p className="font-semibold text-gray-900">General</p>
                  <p className="text-xs text-gray-500">No challenge attached</p>
                </button>

                {completedChallenges.map((challenge, idx) => (
                  <button
                    key={challenge.id}
                    onClick={() => {
                      setSelectedChallengeId(challenge.id);
                      setChallengePickerOpen(false);
                    }}
                    className={`w-full rounded-2xl border p-3 text-left transition-colors ${selectedChallengeId === challenge.id ? 'border-primary-400 bg-primary-50' : 'border-gray-200 hover:border-primary-200'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 h-9 w-9 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center text-base">{groupAvatars[idx % groupAvatars.length]}</div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{challenge.title}</p>
                        <p className="text-xs text-gray-500">{challenge.description}</p>
                        <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-green-600"><CheckCircle2 size={12} />Completed</div>
                      </div>
                    </div>
                  </button>
                ))}

                {completedChallenges.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                    Complete tasks in Missions to attach them here.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
