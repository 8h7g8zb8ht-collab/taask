import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Lock, Mail, ArrowRight, Eye, EyeOff, Sparkles, ShieldCheck } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, register, availableUsers } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (isRegistering) {
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (isRegistering) {
        const result = await register(email, password);
        if (!result.success) {
          setErrorMessage(result.error || 'Failed to create account.');
        }
      } else {
        const result = await login(email, password);
        if (!result.success) {
          setErrorMessage(result.error || 'Failed to sign in.');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillQuickAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setConfirmPassword('password123');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">Taskflow</span>
        </div>
        <h2 className="text-center text-xl font-semibold text-slate-800 tracking-tight">
          {isRegistering ? 'Create your account' : 'Sign in to your account'}
        </h2>
        <p className="mt-1 text-center text-sm text-slate-500">
          {isRegistering
            ? 'Start managing your tasks with dedicated personal workspaces'
            : 'Access your tasks and stay focused on what matters today'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
          {/* Toggle between Sign In and Register */}
          <div className="flex rounded-lg p-1 bg-slate-100 mb-6" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={!isRegistering}
              onClick={() => {
                setIsRegistering(false);
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
                !isRegistering
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isRegistering}
              onClick={() => {
                setIsRegistering(true);
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
                isRegistering
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-1">
                Email address
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isRegistering ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isRegistering ? 'At least 6 characters' : '••••••••'}
                  className="block w-full pl-9 pr-10 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isRegistering && (
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-slate-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-lg text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm mt-2"
            >
              <span>{isRegistering ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Helper */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-slate-400" />
              <span>Quick switch accounts to test per-user isolation:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {availableUsers.map((u) => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => fillQuickAccount(u.email)}
                  className="text-left p-2 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors group"
                >
                  <div className="text-xs font-medium text-slate-800 group-hover:text-slate-900 truncate">
                    {u.name}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">{u.email}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Architecture info notice */}
          <div className="mt-4 pt-3 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Clean frontend & UI architecture. Ready for Supabase Auth integration.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
