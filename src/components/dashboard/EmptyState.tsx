import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { CheckCircle2, ListFilter, Plus, SearchX } from 'lucide-react';

export const EmptyState: React.FC = () => {
  const { filter, searchQuery, tasks, setSearchQuery, setFilter } = useTasks();

  if (searchQuery) {
    return (
      <div className="text-center py-14 px-4 bg-white rounded-xl border border-dashed border-slate-200">
        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <SearchX className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">No matching tasks</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No tasks match your search for "{searchQuery}". Try different keywords or clear the search.
        </p>
        <button
          type="button"
          onClick={() => setSearchQuery('')}
          className="mt-3 text-xs font-medium text-slate-900 underline hover:text-slate-700"
        >
          Clear search
        </button>
      </div>
    );
  }

  if (filter === 'completed') {
    return (
      <div className="text-center py-14 px-4 bg-white rounded-xl border border-dashed border-slate-200">
        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">No completed tasks yet</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Tasks you check off will appear here so you can review what you have accomplished.
        </p>
        <button
          type="button"
          onClick={() => setFilter('all')}
          className="mt-3 text-xs font-medium text-slate-900 underline hover:text-slate-700"
        >
          View all tasks
        </button>
      </div>
    );
  }

  if (filter === 'active' && tasks.length > 0) {
    return (
      <div className="text-center py-14 px-4 bg-white rounded-xl border border-dashed border-slate-200">
        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-3">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">All caught up!</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          You have completed all your active tasks. Great job!
        </p>
        <button
          type="button"
          onClick={() => setFilter('all')}
          className="mt-3 text-xs font-medium text-slate-900 underline hover:text-slate-700"
        >
          View all tasks
        </button>
      </div>
    );
  }

  return (
    <div className="text-center py-16 px-4 bg-white rounded-xl border border-dashed border-slate-200">
      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
        <ListFilter className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">No tasks in your workspace yet</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
        Your task board is completely clean. Type above to add your first task and keep your day structured.
      </p>
    </div>
  );
};
