import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, LogOut, User as UserIcon, ChevronDown, Check } from 'lucide-react';

export const DashboardHeader: React.FC = () => {
  const { user, logout, availableUsers, login } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark + context */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900">Taskflow</span>
              <span className="text-slate-300 font-light" aria-hidden="true">/</span>
              <span className="text-sm font-medium text-slate-600">My Tasks</span>
            </div>
          </div>

          {/* Zone 2: Subdued Center info (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
            <span>Personal Workspace</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{user.email}</span>
          </div>

          {/* Zone 3: Account Switcher & Logout Action */}
          <div className="flex items-center gap-2 relative">
            {/* Quick account switcher popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                aria-expanded={showUserMenu}
                aria-haspopup="true"
              >
                <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate sm:max-w-none">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="text-xs font-semibold text-slate-800">{user.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                    </div>

                    <div className="px-3 pt-2 pb-1 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      Switch User (Test Isolation)
                    </div>
                    {availableUsers.map((u) => (
                      <button
                        key={u.email}
                        type="button"
                        onClick={async () => {
                          setShowUserMenu(false);
                          if (u.email !== user.email) {
                            await login(u.email, 'password123');
                          }
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                      >
                        <div className="truncate">
                          <div className="font-medium text-slate-800 truncate">{u.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{u.email}</div>
                        </div>
                        {u.email === user.email && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      </button>
                    ))}

                    <div className="border-t border-slate-100 mt-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Direct Logout Button */}
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Sign out of your account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
