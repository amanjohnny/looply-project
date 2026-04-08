import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft } from 'lucide-react';

export default function EditProfile() {
  const { user, updateCurrentUserProfile, setCurrentPage } = useAppStore();
  const [form, setForm] = useState({
    avatar: user.avatar,
    displayName: user.displayName,
    bio: user.bio,
  });

  const handleSave = () => {
    updateCurrentUserProfile({
      avatar: form.avatar || '🙂',
      displayName: form.displayName.trim() || user.displayName,
      bio: form.bio.trim(),
    });
    setCurrentPage('profile');
  };

  return (
    <div className="max-w-md mx-auto pb-20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => setCurrentPage('profile')} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
        </div>
      </header>

      <div className="p-4 space-y-5">
        <div className="bg-white rounded-3xl p-5 shadow-card space-y-4">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-300 to-pink-400 flex items-center justify-center text-4xl mb-3">
              {form.avatar || '🙂'}
            </div>
            <label className="text-xs text-gray-500">Avatar (emoji for now)</label>
            <input
              type="text"
              value={form.avatar}
              onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              maxLength={2}
              className="mt-2 input-field text-center"
              placeholder="🙂"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={`@${user.username}`}
              disabled
              className="input-field bg-gray-50 text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
            <input
              type="text"
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              className="input-field"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={4}
              className="input-field resize-none"
              placeholder="Tell people about yourself"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full rounded-xl bg-gradient-to-r from-primary-500 to-pink-500 py-3 text-white font-semibold shadow-glow-pink"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}
