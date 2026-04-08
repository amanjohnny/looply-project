import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Award } from 'lucide-react';

export default function UserProfile() {
  const { selectedUser, posts, collectibles, userCollectibleShowcase, user, setCurrentPage } = useAppStore();

  const profilePosts = useMemo(() => {
    if (!selectedUser) return [];
    return posts.filter((post) => post.userId === selectedUser.id);
  }, [posts, selectedUser]);

  const profileCollectibles = useMemo(() => {
    if (!selectedUser) return [];
    if (selectedUser.id === user.id) return collectibles;
    return userCollectibleShowcase[selectedUser.id] || [];
  }, [selectedUser, user.id, collectibles, userCollectibleShowcase]);

  if (!selectedUser) {
    return (
      <div className="max-w-md mx-auto p-6 pb-20">
        <div className="bg-white rounded-3xl p-6 shadow-card text-center">
          <p className="text-gray-500">User not found.</p>
          <button
            onClick={() => setCurrentPage('feed')}
            className="mt-4 px-4 py-2 rounded-xl bg-gray-100 text-gray-700"
          >
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto pb-20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => setCurrentPage('feed')} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">@{selectedUser.username}</h1>
        </div>
      </header>

      <div className="p-4 space-y-5">
        <div className="bg-white rounded-3xl p-5 shadow-card">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-300 to-pink-400 flex items-center justify-center text-3xl">
              {selectedUser.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{selectedUser.username}</h2>
              <p className="text-sm text-gray-500 mt-1">{selectedUser.bio}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-gray-900">{profilePosts.length}</p>
              <p className="text-xs text-gray-500">Posts</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-gray-900">{selectedUser.level}</p>
              <p className="text-xs text-gray-500">Level</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-gray-900">{selectedUser.streak}</p>
              <p className="text-xs text-gray-500">Streak</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-card">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <Award className="text-yellow-500" size={18} />
            Collectible Preview
          </h3>
          {profileCollectibles.length === 0 ? (
            <p className="text-sm text-gray-500">No collectibles yet.</p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {profileCollectibles.slice(0, 8).map((item) => (
                <div key={item.id} className="aspect-square rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-2xl">
                  {item.image}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Posts</h3>
          {profilePosts.length === 0 ? (
            <p className="text-sm text-gray-500">No posts yet.</p>
          ) : (
            <div className="space-y-3">
              {profilePosts.map((post) => (
                <div key={post.id} className="rounded-2xl border border-gray-100 p-3">
                  <p className="text-xs text-primary-600 font-medium mb-1">{post.challengeTitle}</p>
                  <p className="text-sm text-gray-700">{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
