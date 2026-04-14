import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, School, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

function PrivacyEyes({ showPassword }: { showPassword: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <motion.span
        className="relative inline-flex h-9 w-12 items-center justify-center"
        animate={showPassword ? { rotate: 0, y: 0 } : { rotate: -8, y: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <span className="absolute inset-0 rounded-full border border-gray-200 bg-white shadow-[0_6px_16px_rgba(39,20,57,0.12)]" />
        <motion.span
          className="relative z-10 h-4 w-4 rounded-full bg-gray-900"
          animate={showPassword ? { scaleY: 0.55, x: -1 } : { scaleY: 0.1, x: -3 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        />
      </motion.span>

      <motion.span
        className="relative inline-flex h-9 w-12 items-center justify-center"
        animate={showPassword ? { rotate: 0, y: 0 } : { rotate: 9, y: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <span className="absolute inset-0 rounded-full border border-gray-200 bg-white shadow-[0_6px_16px_rgba(39,20,57,0.12)]" />
        <motion.span
          className="relative z-10 h-4 w-4 rounded-full bg-gray-900"
          animate={showPassword ? { scaleY: 0.75, x: 2 } : { scaleY: 0.08, x: 3 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        />
      </motion.span>
    </div>
  );
}

export default function AkbnisAuthScreen() {
  const { login } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login();
      setIsLoading(false);
    }, 850);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fdfbff] px-4 py-8 sm:py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary-100/75 via-pink-100/35 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-5xl gap-5 rounded-[30px] border border-white/70 bg-white/70 p-4 shadow-[0_24px_70px_rgba(78,38,102,0.14)] backdrop-blur-xl sm:p-6 md:grid-cols-2">
        <section className="rounded-[24px] bg-gradient-to-br from-primary-500 to-pink-500 p-6 text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]">
            <School size={14} />
            NIS AKB Pository
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-[2rem]">AKBNISPOSITORY</h1>
          <p className="mt-2 max-w-sm text-sm text-white/90">Your school community for class groups, challenge missions, and social progress boards.</p>

          <div className="mt-6 rounded-2xl bg-white/16 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck size={16} />
              Verified school entry
            </div>
            <p className="mt-1 text-sm text-white/85">Use your school email or approved phone contact to continue.</p>
          </div>
        </section>

        <section className="rounded-[24px] border border-white/70 bg-white/85 p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-500">Looply Access</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">Sign in</h2>
            </div>
            <PrivacyEyes showPassword={showPassword} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Email or Phone</label>
              <input
                type="text"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your school email or phone"
                className="input-field h-12 rounded-xl px-4"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  className="input-field h-12 rounded-xl px-4 pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.99 }}
              whileHover={{ y: -1 }}
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-pink-500 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(236,72,153,0.32)] disabled:opacity-70"
            >
              {isLoading ? 'Signing in...' : 'Continue to Looply'}
              {!isLoading && <ArrowRight size={18} />}
            </motion.button>
          </form>
        </section>
      </div>
    </div>
  );
}
