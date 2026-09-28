import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { TaskFilter, TaskSort } from '../../types/task';

export const TaskControls: React.FC = () => {
  const { filter, setFilter, searchQuery, setSearchQuery, sortBy, setSortBy, stats } = useTasks();

  const filterTabs: { id: TaskFilter; label: string; count: number }[] = [
    { id: 'all', label: 'All Tasks', count: stats.total },
    { id: 'active', label: 'To Do', count: stats.active },
    { id: 'completed', label: 'Completed', count: stats.completed },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
      {/* Interactive Segmented Filter Tabs */}
      <div className="flex items-center p-1 bg-slate-200/70 rounded-lg self-start sm:self-auto w-full sm:w-auto overflow-x-auto">
        {filterTabs.map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center justify-center gap-1.5 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[11px] tabular-nums ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Sort controls */}
      <div className="flex items-center gap-2">
        {/* Search Bar */}
        <div className="relative flex-1 sm:w-56">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-3.5 w-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="relative flex items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as TaskSort)}
            className="appearance-none bg-white text-xs text-slate-700 border border-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due date</option>
          </select>
          <div className="absolute right-2 pointer-events-none text-slate-400">
            <SlidersHorizontal className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};
