import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, School, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

type AuthTab = 'signin' | 'signup';
type PasswordTarget = 'signin' | 'signup' | null;
type EyeMode = 'normal' | 'privacy' | 'peek';

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function MascotEyes({
  mode,
  cursor,
  showPassword,
}: {
  mode: EyeMode;
  cursor: { x: number; y: number };
  showPassword: boolean;
}) {
  const leftPupil = useMemo(() => {
    if (mode === 'privacy') return { x: -1, y: 1 };
    if (mode === 'peek') return { x: 5.8, y: 2.2 };
    return { x: cursor.x * 6, y: cursor.y * 5.5 };
  }, [cursor.x, cursor.y, mode]);

  const rightPupil = useMemo(() => {
    if (mode === 'privacy') return { x: 1, y: 1 };
    if (mode === 'peek') return { x: 2.2, y: 2.8 };
    return { x: cursor.x * 6.5, y: cursor.y * 5.2 };
  }, [cursor.x, cursor.y, mode]);

  const leftLidScale = mode === 'privacy' ? 0.14 : mode === 'peek' ? 0.52 : 1;
  const rightLidScale = mode === 'privacy' ? 0.14 : mode === 'peek' ? 0.2 : 1;

  return (
    <div className="flex items-center gap-2.5">
      <motion.span
        className="relative inline-flex h-10 w-7 items-center justify-center"
        animate={mode === 'privacy' ? { rotate: -6, y: 1 } : { rotate: -2, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <span className="absolute inset-0 rounded-[999px] border border-gray-200/90 bg-gradient-to-b from-white via-[#fffaff] to-[#f4eeff] shadow-[0_8px_18px_rgba(39,20,57,0.12)]" />
        <motion.span
          className="absolute inset-0 rounded-[999px] bg-gradient-to-b from-white to-[#efe7ff]"
          animate={{ scaleY: leftLidScale }}
          transition={{ duration: 0.24, ease: 'easeInOut' }}
        />
        <motion.span
          className="relative z-10 h-3.5 w-3.5 rounded-full bg-gray-900"
          animate={{ x: leftPupil.x, y: leftPupil.y, scaleY: mode === 'privacy' ? 0.2 : 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22, mass: 0.45 }}
        >
          <span className="absolute left-[24%] top-[19%] h-1 w-1 rounded-full bg-white/90" />
        </motion.span>
      </motion.span>

      <motion.span
        className="relative inline-flex h-10 w-7 items-center justify-center"
        animate={mode === 'privacy' ? { rotate: 6, y: 1 } : { rotate: 2, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <span className="absolute inset-0 rounded-[999px] border border-gray-200/90 bg-gradient-to-b from-white via-[#fffaff] to-[#f4eeff] shadow-[0_8px_18px_rgba(39,20,57,0.12)]" />
        <motion.span
          className="absolute inset-0 rounded-[999px] bg-gradient-to-b from-white to-[#efe7ff]"
          animate={{ scaleY: rightLidScale }}
          transition={{ duration: 0.24, ease: 'easeInOut' }}
        />
        <motion.span
          className="relative z-10 h-3.5 w-3.5 rounded-full bg-gray-900"
          animate={{ x: rightPupil.x, y: rightPupil.y, scaleY: mode === 'privacy' ? 0.2 : showPassword ? 0.9 : 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22, mass: 0.45 }}
        >
          <span className="absolute left-[24%] top-[19%] h-1 w-1 rounded-full bg-white/90" />
        </motion.span>
      </motion.span>
    </div>
  );
}

function LooplyWordmark({
  mode,
  cursor,
  showPassword,
}: {
  mode: EyeMode;
  cursor: { x: number; y: number };
  showPassword: boolean;
}) {
  return (
    <div className="flex items-center gap-[0.12em] text-[1.82rem] font-black leading-none tracking-[-0.012em] text-gray-900">
      <span className="mr-[0.01em]">L</span>
      <MascotEyes mode={mode} cursor={cursor} showPassword={showPassword} />
      <span className="ml-[0.01em]">ply</span>
    </div>
  );
}

export default function AkbnisAuthScreen() {
  const { login } = useAppStore();
  const [tab, setTab] = useState<AuthTab>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordTarget, setPasswordTarget] = useState<PasswordTarget>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const [signInData, setSignInData] = useState({ emailOrPhone: '', password: '' });
  const [signUpData, setSignUpData] = useState({
    name: '',
    role: '',
    studentClass: '',
    contact: '',
    password: '',
  });

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const normalizedX = (event.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = (event.clientY / window.innerHeight) * 2 - 1;
      setCursor({ x: clamp(normalizedX, -1, 1), y: clamp(normalizedY, -1, 1) });
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useEffect(() => {
    setShowPassword(false);
    setPasswordTarget(null);
  }, [tab]);

  const mode: EyeMode = passwordTarget ? (showPassword ? 'peek' : 'privacy') : 'normal';

  const handleSignIn = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login();
      setIsLoading(false);
    }, 850);
  };

  const handleSignUpRequest = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setTab('signin');
      setSignInData((prev) => ({ ...prev, emailOrPhone: signUpData.contact }));
    }, 900);
  };

  const primaryButtonLabel = tab === 'signin'
    ? (isLoading ? 'Signing in...' : 'Continue to Looply')
    : (isLoading ? 'Submitting request...' : 'Request Pository Access');

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
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-500">Looply Access</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                {tab === 'signin' ? 'Sign in' : 'Registration request'}
              </h2>
            </div>
            <LooplyWordmark mode={mode} cursor={cursor} showPassword={showPassword} />
          </div>

          <div className="mb-4 inline-flex w-full rounded-xl bg-primary-50 p-1">
            <button
              type="button"
              onClick={() => setTab('signin')}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${tab === 'signin' ? 'bg-white text-primary-600 shadow-sm' : 'text-primary-500/80 hover:text-primary-600'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setTab('signup')}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${tab === 'signup' ? 'bg-white text-primary-600 shadow-sm' : 'text-primary-500/80 hover:text-primary-600'}`}
            >
              Sign Up / Request
            </button>
          </div>

          {tab === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Email or Phone</label>
                <input
                  type="text"
                  value={signInData.emailOrPhone}
                  onChange={(e) => setSignInData((prev) => ({ ...prev, emailOrPhone: e.target.value }))}
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
                    value={signInData.password}
                    onChange={(e) => setSignInData((prev) => ({ ...prev, password: e.target.value }))}
                    onFocus={() => setPasswordTarget('signin')}
                    onBlur={() => setPasswordTarget(null)}
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
                {primaryButtonLabel}
                {!isLoading && <ArrowRight size={18} />}
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleSignUpRequest} className="space-y-3.5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={signUpData.name}
                  onChange={(e) => setSignUpData((prev) => ({ ...prev, name: e.target.value }))}
                  className="input-field h-11 rounded-xl px-4"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Role</label>
                  <input
                    type="text"
                    value={signUpData.role}
                    onChange={(e) => setSignUpData((prev) => ({ ...prev, role: e.target.value }))}
                    className="input-field h-11 rounded-xl px-4"
                    placeholder="Student / Teacher"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Class</label>
                  <input
                    type="text"
                    value={signUpData.studentClass}
                    onChange={(e) => setSignUpData((prev) => ({ ...prev, studentClass: e.target.value }))}
                    className="input-field h-11 rounded-xl px-4"
                    placeholder="e.g. XI Science 2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Email or Phone</label>
                <input
                  type="text"
                  value={signUpData.contact}
                  onChange={(e) => setSignUpData((prev) => ({ ...prev, contact: e.target.value }))}
                  className="input-field h-11 rounded-xl px-4"
                  placeholder="School email or verified phone"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Create password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signUpData.password}
                    onChange={(e) => setSignUpData((prev) => ({ ...prev, password: e.target.value }))}
                    onFocus={() => setPasswordTarget('signup')}
                    onBlur={() => setPasswordTarget(null)}
                    className="input-field h-11 rounded-xl px-4 pr-11"
                    placeholder="Set a secure password"
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

              <p className="text-xs text-gray-500">This sends a frontend-only registration request preview for AKBNISPOSITORY access.</p>

              <motion.button
                type="submit"
                whileTap={{ scale: 0.99 }}
                whileHover={{ y: -1 }}
                disabled={isLoading}
                className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-pink-500 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(236,72,153,0.32)] disabled:opacity-70"
              >
                {primaryButtonLabel}
                {!isLoading && <ArrowRight size={18} />}
              </motion.button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
