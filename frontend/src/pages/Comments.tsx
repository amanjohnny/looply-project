import { useMemo, useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Send, MoreHorizontal, Sticker, Image as ImageIcon, Video } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

type CommentAttachmentType = 'image' | 'sticker' | 'video';

interface CommentAttachment {
  type: CommentAttachmentType;
  label: string;
  content: string;
}

export default function Comments() {
  const {
    posts,
    likedPostIds,
    togglePostLike,
    commentsByPost,
    addComment,
    activeCommentPostId,
    closeComments,
    user,
    deleteComment,
    reportComment,
    blockUser,
    blockedUserIds,
  } = useAppStore();

  const [draft, setDraft] = useState('');
  const [stagedAttachment, setStagedAttachment] = useState<CommentAttachment | null>(null);
  const [activeMenuCommentId, setActiveMenuCommentId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');

  const post = useMemo(() => posts.find((item) => item.id === activeCommentPostId) || null, [posts, activeCommentPostId]);
  const comments = useMemo(() => {
    if (!activeCommentPostId) return [];
    const base = commentsByPost[activeCommentPostId] || [];
    return base.filter((comment) => !blockedUserIds.includes(comment.userId));
  }, [commentsByPost, activeCommentPostId, blockedUserIds]);

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
  const postAuthorId = post.userId;

  const stageCommentAttachment = (next: CommentAttachment) => {
    if (stagedAttachment && stagedAttachment.type !== next.type) {
      setFeedback(`Replaced ${stagedAttachment.label} with ${next.label}.`);
    } else {
      setFeedback(`${next.label} staged. Press send to confirm.`);
    }
    setStagedAttachment(next);
  };

  const handleSubmit = () => {
    const text = draft.trim();
    if (!text && !stagedAttachment) {
      setFeedback('Write text or stage one item first.');
      return;
    }

    const payloadText = [text, stagedAttachment?.content].filter(Boolean).join(' ');
    const result = addComment(post.id, payloadText);
    if (!result.ok) {
      setFeedback(result.error || 'Unable to add comment.');
      return;
    }

    setDraft('');
    setStagedAttachment(null);
    setFeedback(result.error || '');
  };

  const handleDelete = (commentId: string) => {
    deleteComment(post.id, commentId);
    setActiveMenuCommentId(null);
    setFeedback('Comment deleted.');
  };

  const handleReport = (commentId: string) => {
    reportComment(commentId, 'abuse');
    setActiveMenuCommentId(null);
    setFeedback('Comment reported.');
  };

  const handleBlock = (userId: string) => {
    blockUser(userId);
    setActiveMenuCommentId(null);
    setFeedback('User blocked. You will no longer see their comments.');
  };

  return (
    <div className="relative max-w-md mx-auto min-h-screen bg-gray-50 pb-28 overflow-hidden">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={closeComments} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeft size={20} className="text-gray-600" /></button>
          <h1 className="text-lg font-bold text-gray-900">Comments</h1>
        </div>
      </header>

      <div className="p-4 space-y-4 pb-44">
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl leading-none">{post.userAvatar}</span>
            <p className="font-semibold text-sm text-gray-900 break-words">{post.username}</p>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed break-anywhere">{post.content}</p>
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
            comments.map((comment) => {
              const isOwn = comment.userId === user.id;
              const isPostAuthor = comment.userId === postAuthorId;
              const canDelete = isOwn || user.id === postAuthorId;
              const menuOpen = activeMenuCommentId === comment.id;

              return (
                <div key={comment.id} className="relative flex items-start gap-2 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                  <span className="text-xl leading-none">{comment.userAvatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-gray-900 break-words">{comment.username}</p>
                      {isPostAuthor && <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-semibold text-primary-600">Author</span>}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed break-anywhere">{comment.content}</p>
                  </div>
                  <button
                    onClick={() => setActiveMenuCommentId(menuOpen ? null : comment.id)}
                    className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    aria-label="Comment actions"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-7 z-20 min-w-[150px] rounded-xl border border-gray-100 bg-white shadow-lg p-1">
                      {canDelete && (
                        <button onClick={() => handleDelete(comment.id)} className="w-full text-left px-3 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50">
                          Delete
                        </button>
                      )}
                      <button onClick={() => handleReport(comment.id)} className="w-full text-left px-3 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-50">
                        Report
                      </button>
                      {!isOwn && (
                        <button onClick={() => handleBlock(comment.userId)} className="w-full text-left px-3 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-50">
                          Block user
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white">
        <div className="max-w-md mx-auto p-3">
          {stagedAttachment && (
            <div className="mb-2 flex items-center justify-between rounded-xl border border-primary-100 bg-primary-50 px-3 py-2 text-xs">
              <p className="font-medium text-primary-700">Staged: {stagedAttachment.label}</p>
              <button onClick={() => setStagedAttachment(null)} className="rounded-md px-2 py-1 text-primary-600 hover:bg-primary-100">Remove</button>
            </div>
          )}
          <div className="mb-2 flex items-center gap-2 text-gray-500">
            <button onClick={() => stageCommentAttachment({ type: 'sticker', label: 'Sticker', content: '🧷 Sticker placeholder' })} className="rounded-lg border border-gray-200 p-1.5 hover:bg-gray-50"><Sticker size={16} /></button>
            <button onClick={() => stageCommentAttachment({ type: 'image', label: 'Image', content: '🖼️ Image placeholder' })} className="rounded-lg border border-gray-200 p-1.5 hover:bg-gray-50"><ImageIcon size={16} /></button>
            <button onClick={() => stageCommentAttachment({ type: 'video', label: 'Video circle', content: '🎬 Video circle placeholder' })} className="rounded-lg border border-gray-200 p-1.5 hover:bg-gray-50"><Video size={16} /></button>
          </div>
          {feedback && <p className="mb-2 text-xs text-primary-600 break-words">{feedback}</p>}
          <div className="flex items-center gap-2">
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
    </div>
  );
}
