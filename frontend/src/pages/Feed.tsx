import { useMemo, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Award, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mediaOptions = ['✨', '📸', '📝', '🎯', '🔥'];

export default function Feed() {
  const {
    user,
    posts,
    stories,
    challenges,
    createPost,
    addStory,
    togglePostLike,
    setCurrentPage,
    openUserProfile,
    likedPostIds,
    openComments,
    openStoryViewer,
  } = useAppStore();

  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [postDraft, setPostDraft] = useState('');
  const [postMedia, setPostMedia] = useState('');
  const [selectedChallengeId, setSelectedChallengeId] = useState('');
  const [postFeedback, setPostFeedback] = useState('');

  const [storyCaption, setStoryCaption] = useState('');
  const [storyMedia, setStoryMedia] = useState('✨');
  const [storyFeedback, setStoryFeedback] = useState('');

  const challengeOptions = useMemo(() => challenges.slice(0, 4), [challenges]);

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
    setPostFeedback('Posted!');
  };

  const handleCreateStory = () => {
    const result = addStory({ caption: storyCaption, media: storyMedia });
    if (!result.ok) {
      setStoryFeedback(result.error || 'Unable to add story.');
      return;
    }
    setStoryCaption('');
    setStoryMedia('✨');
    setStoryFeedback('Story added!');
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

      <div className="p-4 space-y-3 border-b border-gray-100 bg-white">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-200 to-pink-200 flex items-center justify-center text-xl">{user.avatar}</div>
          <div className="flex-1 space-y-2">
            <textarea
              value={postDraft}
              onChange={(e) => setPostDraft(e.target.value)}
              maxLength={280}
              rows={3}
              placeholder="Share your progress..."
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{postDraft.trim().length}/280</span>
              <span className="break-words">{postFeedback}</span>
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
        </div>
      </div>

      <div className="border-b border-gray-100 py-3 bg-white">
        <div className="px-4 mb-3 space-y-2">
          <div className="flex items-center gap-2">
            <input
              value={storyCaption}
              onChange={(e) => setStoryCaption(e.target.value)}
              maxLength={120}
              placeholder="Create a story caption..."
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <select value={storyMedia} onChange={(e) => setStoryMedia(e.target.value)} className="rounded-lg border border-gray-200 px-2 py-2 text-xs bg-white">
              {mediaOptions.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <button onClick={handleCreateStory} className="rounded-lg bg-primary-500 px-3 py-2 text-xs font-semibold text-white">Add</button>
          </div>
          {storyFeedback && <p className="text-xs text-primary-600 break-words">{storyFeedback}</p>}
        </div>

        <div className="flex gap-4 px-4 overflow-x-auto hide-scrollbar">
          <div className="flex-shrink-0 text-center">
            <button onClick={handleCreateStory} className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-primary-400 hover:bg-primary-50/50 transition-all group">
              <Plus className="text-gray-400 group-hover:text-primary-500" />
            </button>
            <p className="text-xs text-gray-500 mt-1">Story</p>
          </div>

          {stories.map((story) => (
            <div key={story.id} className="flex-shrink-0 text-center cursor-pointer" onClick={() => openStoryViewer(story.id)}>
              <div className={`w-16 h-16 rounded-full p-0.5 ${story.userId === user.id || !story.hasViewed ? 'story-ring' : ''}`}>
                <div className={`w-full h-full rounded-full flex items-center justify-center text-2xl ${story.hasViewed ? 'bg-gray-100' : 'bg-white border-2 border-white'}`}>
                  {story.media || story.avatar}
                </div>
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
