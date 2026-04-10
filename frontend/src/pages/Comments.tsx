import { useMemo, useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Send } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Comments() {
  const {
    posts,
    likedPostIds,
    togglePostLike,
    commentsByPost,
    addComment,
    activeCommentPostId,
    closeComments,
  } = useAppStore();

  const [draft, setDraft] = useState('');

  const post = useMemo(() => posts.find((item) => item.id === activeCommentPostId) || null, [posts, activeCommentPostId]);
  const comments = useMemo(() => (activeCommentPostId ? commentsByPost[activeCommentPostId] || [] : []), [commentsByPost, activeCommentPostId]);

  if (!post) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-20">
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3">
            <button onClick={closeComments} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeft size={20} className="text-gray-600" /></button>
            <h1 className="text-lg font-bold text-gray-900">Comments</h1>
          </div>
        </header>
        <div className="p-6 text-center text-sm text-gray-500">Post not found.</div>
      </div>
    );
  }

  const isLiked = likedPostIds.includes(post.id);

  const handleSubmit = () => {
    if (!draft.trim()) return;
    addComment(post.id, draft);
    setDraft('');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-24">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={closeComments} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeft size={20} className="text-gray-600" /></button>
          <h1 className="text-lg font-bold text-gray-900">Comments</h1>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl leading-none">{post.userAvatar}</span>
            <p className="font-semibold text-sm text-gray-900 break-words">{post.username}</p>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed break-words [overflow-wrap:anywhere]">{post.content}</p>
          <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
            <button onClick={() => togglePostLike(post.id)} className="flex items-center gap-1 hover:text-red-500">
              <Heart size={16} className={isLiked ? 'text-red-500 fill-red-500' : ''} /> {post.likes}
            </button>
            <span className="flex items-center gap-1"><MessageCircle size={16} /> {post.comments}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 space-y-3">
          {comments.length === 0 ? (
            <p className="text-sm text-gray-500">No comments yet. Start the conversation.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-2 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                <span className="text-xl leading-none">{comment.userAvatar}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 break-words">{comment.username}</p>
                  <p className="text-sm text-gray-700 leading-relaxed break-words [overflow-wrap:anywhere]">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100">
        <div className="max-w-md mx-auto p-3 flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            }}
            className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            placeholder="Write a comment..."
          />
          <button onClick={handleSubmit} className="rounded-xl bg-primary-500 text-white p-2.5 hover:bg-primary-600">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
