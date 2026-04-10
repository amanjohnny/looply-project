import { useMemo, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type AuthField = 'email' | 'password' | 'username' | 'confirmPassword';

export default function Auth() {
  const { authView, setAuthView, login } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touched, setTouched] = useState<Record<AuthField, boolean>>({
    email: false,
    password: false,
    username: false,
    confirmPassword: false,
  });

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: '',
  });

  const errors = useMemo(() => {
    const next = {
      email: '',
      password: '',
      username: '',
      confirmPassword: '',
    };

    if (authView === 'register') {
      if (formData.username.trim().length < 3) next.username = 'Username must be at least 3 characters.';
      if (!emailRegex.test(formData.email.trim())) next.email = 'Enter a valid email.';
      if (formData.password.length < 6) next.password = 'Password must be at least 6 characters.';
      if (formData.confirmPassword !== formData.password) next.confirmPassword = 'Passwords do not match.';
      return next;
    }

    if (!formData.email.trim()) next.email = 'Email or phone is required.';
    if (formData.password.length < 6) next.password = 'Password must be at least 6 characters.';

    return next;
  }, [authView, formData]);

  const hasErrors = Boolean(errors.email || errors.password || errors.username || errors.confirmPassword);

  const showError = (field: AuthField) => Boolean(errors[field]) && (touched[field] || submitAttempted);

  const helperText = (field: AuthField, neutral: string) => {
    if (showError(field)) {
      return <p className="mt-1 text-xs text-red-500">{errors[field]}</p>;
    }
    return <p className="mt-1 text-xs text-gray-400">{neutral}</p>;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (hasErrors) return;

    setIsLoading(true);
    setTimeout(() => {
      login();
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (field: AuthField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fdfbff] px-4 py-10 sm:py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 -left-20 h-72 w-72 rounded-full bg-gradient-to-br from-primary-100/80 to-transparent blur-3xl" />
        <div className="absolute top-1/4 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-purple-100/70 to-transparent blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-tr from-pink-100/70 to-orange-100/30 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.85),transparent_65%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
        <div className="w-full">
          <div className="mb-8 text-center sm:mb-10">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/70 bg-gradient-to-b from-white/90 to-white/60 shadow-[0_10px_30px_rgba(177,133,183,0.15)] backdrop-blur-sm sm:h-24 sm:w-24">
              <div className="h-12 w-12 rounded-2xl border border-gray-200/80 bg-gradient-to-br from-gray-50 via-white to-gray-100/90 sm:h-14 sm:w-14" />
            </div>
            <h1 className="text-[2rem] font-bold tracking-tight text-gray-900">Looply</h1>
            <p className="mt-2 text-sm text-gray-500">Complete challenges, earn rewards with friends.</p>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_16px_48px_rgba(46,20,61,0.10)] backdrop-blur-md sm:p-6">
            <div className="mb-6 grid grid-cols-2 gap-1 rounded-2xl bg-gray-100/90 p-1.5">
              <button onClick={() => setAuthView('login')} className={`rounded-xl py-2.5 text-sm font-semibold transition-all duration-300 ${authView === 'login' ? 'bg-white text-gray-900 shadow-soft' : 'text-gray-500 hover:text-gray-700'}`}>
                Sign In
              </button>
              <button onClick={() => setAuthView('register')} className={`rounded-xl py-2.5 text-sm font-semibold transition-all duration-300 ${authView === 'register' ? 'bg-white text-gray-900 shadow-soft' : 'text-gray-500 hover:text-gray-700'}`}>
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-[18px]" noValidate>
              {authView === 'register' && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Username</label>
                  <div className="relative">
                    <input type="text" name="username" value={formData.username} onChange={handleChange} onBlur={() => handleBlur('username')} placeholder="Choose a username" className="input-field h-12 rounded-xl !pl-14 !pr-4" />
                    <div className="pointer-events-none absolute left-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-gray-400">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  {helperText('username', 'At least 3 characters.')}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">{authView === 'login' ? 'Email or Phone' : 'Email'}</label>
                <div className="relative">
                  <input type="text" name="email" value={formData.email} onChange={handleChange} onBlur={() => handleBlur('email')} placeholder={authView === 'login' ? 'Enter email or phone number' : 'Enter your email'} className="input-field h-12 rounded-xl !pl-14 !pr-4" />
                  <div className="pointer-events-none absolute left-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-gray-400">
                    <Mail size={18} />
                  </div>
                </div>
                {helperText('email', authView === 'login' ? 'Use your account email or phone.' : 'Use a valid email format.')}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} onBlur={() => handleBlur('password')} placeholder="Enter your password" className="input-field h-12 rounded-xl !pl-14 !pr-12" />
                  <div className="pointer-events-none absolute left-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-gray-400">
                    <Lock size={18} />
                  </div>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {helperText('password', 'Minimum 6 characters.')}
              </div>

              {authView === 'register' && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} onBlur={() => handleBlur('confirmPassword')} placeholder="Confirm your password" className="input-field h-12 rounded-xl !pl-14 !pr-4" />
                    <div className="pointer-events-none absolute left-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-gray-400">
                      <Lock size={18} />
                    </div>
                  </div>
                  {helperText('confirmPassword', 'Must match your password.')}
                </div>
              )}

              {authView === 'login' && (
                <div className="flex justify-end">
                  <button type="button" className="text-sm font-medium text-primary-600 hover:text-primary-700">Forgot password?</button>
                </div>
              )}

              <button type="submit" disabled={isLoading || hasErrors} className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-pink-500 py-3 text-sm font-semibold text-white shadow-glow-pink transition hover:brightness-105 disabled:opacity-70">
                {isLoading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <>{authView === 'login' ? 'Sign In' : 'Create Account'}<ArrowRight size={18} /></>}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-sm text-gray-400">or</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="space-y-3">
              <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>
          </div>

          <p className="mt-6 px-2 text-center text-xs leading-relaxed text-gray-500">By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}
