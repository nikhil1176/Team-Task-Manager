import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LogIn, Moon, Sun, UserPlus, Sparkles, ShieldCheck, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const authCopy = {
  login: {
    eyebrow: 'Welcome back',
    title: 'Sign in and pick up where you left off',
    subtitle: 'A clean workspace for managing projects, tasks, and people.',
    button: 'Sign In',
    switchText: "Don't have an account? Sign up",
    icon: LogIn,
  },
  signup: {
    eyebrow: 'Create account',
    title: 'Start your workspace with a simple setup',
    subtitle: 'Create a team account and keep everything in one place.',
    button: 'Create Account',
    switchText: 'Already have an account? Sign in',
    icon: UserPlus,
  },
};

const featurePills = [
  { icon: ShieldCheck, text: 'Secure login' },
  { icon: Users, text: 'Team-ready' },
  { icon: Sparkles, text: 'Fast setup' },
];

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'MEMBER',
  });

  const copy = useMemo(() => (isLogin ? authCopy.login : authCopy.signup), [isLogin]);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);

    if (nextTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await api.post('/api/auth/login', {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/dashboard');
      } else {
        await api.post('/api/auth/register', formData);
        setFormData({
          name: '',
          email: formData.email,
          password: '',
          role: 'MEMBER',
        });
        setIsLogin(true);
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const AuthIcon = copy.icon;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-950 transition-colors duration-300 dark:bg-[#0f1725] dark:text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-500/10" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-amber-200/35 blur-3xl dark:bg-amber-500/10" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-500/10" />
      </div>

      <div className="absolute right-6 top-6 z-20">
        <label
          htmlFor="themeToggleLogin"
          className="relative flex h-9 w-16 cursor-pointer items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900"
        >
          <input
            type="checkbox"
            id="themeToggleLogin"
            className="peer sr-only"
            checked={isDark}
            onChange={toggleTheme}
          />
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-amber-500 shadow-sm transition-transform duration-300 peer-checked:translate-x-7 dark:bg-slate-950 dark:text-violet-300">
            {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </span>
        </label>
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/85 lg:grid-cols-2">
          <aside className="relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 p-10 text-white lg:block">
            <div className="absolute inset-0 opacity-40">
              <div className="absolute -left-8 top-10 h-40 w-40 rounded-full bg-violet-500/30 blur-3xl" />
              <div className="absolute bottom-12 right-0 h-52 w-52 rounded-full bg-amber-400/20 blur-3xl" />
            </div>

            <div className="relative flex h-full flex-col justify-between">
              <div>
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  Team task manager
                </div>

                <h1 className="max-w-md text-4xl font-black tracking-tight xl:text-5xl">
                  Clean workflow. Clear ownership. Better output.
                </h1>
                <p className="mt-4 max-w-lg text-base leading-7 text-slate-300">
                  A simple workspace that feels calm, modern, and actually usable for real teams.
                </p>
              </div>

              <div className="space-y-4">
                {featurePills.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.text}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-violet-200">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{item.text}</p>
                        <p className="text-xs text-slate-300">Built for fast team coordination</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="relative mt-8 rounded-[1.5rem] border border-white/10 bg-white/10 p-5 shadow-inner backdrop-blur-sm">
                <p className="text-sm font-semibold text-slate-100">What makes it feel human?</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Softer colors, less symmetry, subtle depth, and a more grounded visual rhythm.
                </p>
              </div>
            </div>
          </aside>

          <section className="relative p-6 sm:p-8 lg:p-12">
            <div className="mx-auto flex max-w-lg flex-col">
              <div className="mb-8 lg:hidden">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Team task manager
                </div>
                <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                  Clean workflow. Clear ownership.
                </h1>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8"
              >
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-200 bg-violet-50 text-violet-600 shadow-sm dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
                    <AuthIcon className="h-8 w-8" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                    {copy.eyebrow}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {copy.subtitle}
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <AnimatePresence mode="popLayout">
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.28 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-5">
                          <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                              Full Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              required={!isLogin}
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-950/30 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-violet-500 dark:focus:bg-slate-950/50 dark:focus:ring-violet-500/10"
                              placeholder="John Doe"
                              value={formData.name}
                              onChange={handleChange}
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                              Select Role
                            </label>
                            <select
                              name="role"
                              className="w-full cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition-all focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-950/30 dark:text-white dark:focus:border-violet-500 dark:focus:bg-slate-950/50 dark:focus:ring-violet-500/10"
                              value={formData.role}
                              onChange={handleChange}
                            >
                              <option value="MEMBER">Member (Can complete tasks)</option>
                              <option value="ADMIN">Admin (Can create projects & tasks)</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-950/30 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-violet-500 dark:focus:bg-slate-950/50 dark:focus:ring-violet-500/10"
                      placeholder="admin@ethara.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-950/30 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-violet-500 dark:focus:bg-slate-950/50 dark:focus:ring-violet-500/10"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isLoading}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3.5 font-bold text-white shadow-[0_18px_35px_-18px_rgba(79,70,229,0.65)] transition-all hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-70 dark:from-violet-500 dark:to-indigo-500 dark:hover:from-violet-400 dark:hover:to-indigo-400"
                  >
                    {isLoading ? (
                      'Processing...'
                    ) : (
                      <>
                        {copy.button}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </motion.button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setIsLogin(!isLogin);
                    }}
                    className="text-sm font-semibold text-slate-500 transition-colors hover:text-violet-700 dark:text-slate-400 dark:hover:text-violet-300"
                  >
                    {copy.switchText}
                  </button>
                </div>
              </motion.div>

              <div className="mt-6 flex items-center justify-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Built to feel clean, calm, and real
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Login;
