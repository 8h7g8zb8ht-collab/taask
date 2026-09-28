import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { Plus, Calendar, Flag, ChevronDown, ChevronUp, AlignLeft } from 'lucide-react';
import { TaskPriority } from '../../types/task';

export const CreateTaskForm: React.FC = () => {
  const { createTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createTask({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
    });

    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
    setIsExpanded(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 mb-6 transition-all">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Add a new task... (e.g., Update project roadmap)"
            className="flex-1 py-2 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent border-0 focus:outline-none focus:ring-0"
          />

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 text-xs flex items-center gap-1 transition-colors"
            title={isExpanded ? 'Hide additional options' : 'More options'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <button
            type="submit"
            disabled={!title.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Expandable fields for description, priority, due date */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
            <div>
              <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                <AlignLeft className="w-3.5 h-3.5" />
                <span>Description (optional)</span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Add more details, links, or context..."
                className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg p-2.5 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {/* Priority Selection */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Flag className="w-3.5 h-3.5" />
                  <span>Priority:</span>
                </span>
                <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-md">
                  {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`px-2.5 py-1 text-xs font-medium rounded capitalize transition-colors ${
                        priority === p
                          ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date Input */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Due date:</span>
                </span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="text-xs text-slate-700 border border-slate-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
