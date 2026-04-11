import { useMemo, useState } from 'react';
import { useAppStore } from '../store/useAppStore';

const mediaOptions = ['✨', '📸', '📝', '🎯', '🔥'];

type CreateMode = 'post' | 'story';

export default function Create() {
  const { user, challenges, createPost, addStory, setCurrentPage } = useAppStore();
  const [mode, setMode] = useState<CreateMode>('post');

  const [postDraft, setPostDraft] = useState('');
  const [postMedia, setPostMedia] = useState('');
  const [selectedChallengeId, setSelectedChallengeId] = useState('');
  const [postFeedback, setPostFeedback] = useState('');

  const [storyCaption, setStoryCaption] = useState('');
  const [storyMedia, setStoryMedia] = useState('✨');
  const [storyFeedback, setStoryFeedback] = useState('');

  const challengeOptions = useMemo(() => challenges.slice(0, 6), [challenges]);

  const handleCreatePost = () => {
    const selectedChallenge = challengeOptions.find((item) => item.id === selectedChallengeId);
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
          <div className="bg-white rounded-3xl p-4 shadow-card space-y-3">
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

            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
              {mediaOptions.map((m) => (
                <button key={m} onClick={() => setPostMedia((prev) => (prev === m ? '' : m))} className={`h-8 w-8 rounded-lg border text-lg ${postMedia === m ? 'border-primary-400 bg-primary-50' : 'border-gray-200 bg-white'}`}>{m}</button>
              ))}
              <select value={selectedChallengeId} onChange={(e) => setSelectedChallengeId(e.target.value)} className="h-8 rounded-lg border border-gray-200 px-2 text-xs bg-white">
                <option value="">General</option>
                {challengeOptions.map((challenge) => <option key={challenge.id} value={challenge.id}>{challenge.title}</option>)}
              </select>
              <button onClick={handleCreatePost} className="ml-auto rounded-lg bg-gradient-to-r from-primary-500 to-pink-500 px-3 py-1.5 text-xs font-semibold text-white">Post</button>
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
    </div>
  );
}
