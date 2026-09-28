import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { DashboardHeader } from './DashboardHeader';
import { TaskStats } from './TaskStats';
import { CreateTaskForm } from './CreateTaskForm';
import { TaskControls } from './TaskControls';
import { TaskItem } from './TaskItem';
import { EmptyState } from './EmptyState';
import { UserCheck, Shield } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { filteredTasks, stats } = useTasks();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Bar Contract Navigation */}
      <DashboardHeader />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Workspace Title & Personal Indicator */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              My Tasks
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
              <span>Personal dashboard for</span>
              <span className="font-semibold text-slate-700">{user.name}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="tabular-nums font-mono text-xs">{stats.active} remaining</span>
            </p>
          </div>

          {/* User isolation confirmation pill-free notice */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-white border border-slate-200/90 rounded-lg px-3 py-1.5 self-start sm:self-auto shadow-2xs">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate max-w-[200px] sm:max-w-xs">
              Isolated workspace: <strong className="text-slate-700 font-medium">{user.email}</strong>
            </span>
          </div>
        </div>

        {/* Task Metrics Summary */}
        <TaskStats />

        {/* Create Task Input Area */}
        <CreateTaskForm />

        {/* Task Filter and Search Controls */}
        <TaskControls />

        {/* Task List / Rows */}
        <section aria-label="Task List" className="space-y-2">
          {filteredTasks.length === 0 ? (
            <EmptyState />
          ) : (
            filteredTasks.map((task) => <TaskItem key={task.id} task={task} />)
          )}
        </section>

        {/* Supabase Integration Readiness Footer Note */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Frontend & UI built with React + TypeScript. Prepared for Supabase Auth & Database schema.</span>
          </div>
          <div>
            <span>Taskflow v1.0</span>
          </div>
        </div>
      </main>
    </div>
  );
};
