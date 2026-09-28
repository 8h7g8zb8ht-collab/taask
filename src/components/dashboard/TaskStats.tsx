import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react';

export const TaskStats: React.FC = () => {
  const { stats } = useTasks();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Total Tasks */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Total Tasks</span>
          <ListTodo className="w-4 h-4 text-slate-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {stats.total}
          </span>
          <span className="text-xs text-slate-400">assigned</span>
        </div>
      </div>

      {/* Pending / In Progress */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">To Do</span>
          <Clock className="w-4 h-4 text-amber-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {stats.active}
          </span>
          <span className="text-xs text-amber-600">remaining</span>
        </div>
      </div>

      {/* Completed */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Completed</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {stats.completed}
          </span>
          <span className="text-xs text-emerald-600">finished</span>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Completion</span>
          <TrendingUp className="w-4 h-4 text-blue-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {stats.completionPercentage}%
          </span>
          <span className="text-xs text-slate-400">progress</span>
        </div>
        {/* Subtle progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-1 mt-2.5 overflow-hidden">
          <div
            className="bg-slate-900 h-1 rounded-full transition-all duration-300"
            style={{ width: `${stats.completionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
