import { ArrowLeft, Bell, Lock, Moon, LogOut } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Settings() {
  const { preferences, updatePreferences, setCurrentPage, logout } = useAppStore();

  return (
    <div className="max-w-md mx-auto pb-20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => setCurrentPage('profile')} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-3xl p-5 shadow-card space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Preferences</h2>

          <button
            onClick={() => updatePreferences({ pushNotifications: !preferences.pushNotifications })}
            className="w-full flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3 text-left">
              <Bell size={18} className="text-primary-500" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Push notifications</p>
                <p className="text-xs text-gray-500">Get reminders for challenges and rewards.</p>
              </div>
            </div>
            <span className={`text-xs font-semibold ${preferences.pushNotifications ? 'text-green-600' : 'text-gray-400'}`}>
              {preferences.pushNotifications ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            onClick={() => updatePreferences({ privateProfile: !preferences.privateProfile })}
            className="w-full flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3 text-left">
              <Lock size={18} className="text-primary-500" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Private profile</p>
                <p className="text-xs text-gray-500">Only your friends can view your profile.</p>
              </div>
            </div>
            <span className={`text-xs font-semibold ${preferences.privateProfile ? 'text-green-600' : 'text-gray-400'}`}>
              {preferences.privateProfile ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            onClick={() => updatePreferences({ darkMode: !preferences.darkMode })}
            className="w-full flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3 text-left">
              <Moon size={18} className="text-primary-500" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Dark mode</p>
                <p className="text-xs text-gray-500">Stored for now, visual theme coming next.</p>
              </div>
            </div>
            <span className={`text-xs font-semibold ${preferences.darkMode ? 'text-green-600' : 'text-gray-400'}`}>
              {preferences.darkMode ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-red-600 font-semibold hover:bg-red-100"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </div>
  );
}
