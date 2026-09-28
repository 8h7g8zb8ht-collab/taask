import React, { useState } from 'react';
import { Task, TaskPriority } from '../../types/task';
import { useTasks } from '../../context/TaskContext';
import { Check, Trash2, Edit2, Calendar, Flag, Save, X, AlertCircle } from 'lucide-react';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleTask, deleteTask, updateTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority);
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    updateTask(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      priority: editPriority,
      dueDate: editDueDate || undefined,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate || '');
    setIsEditing(false);
  };

  // Format date helper
  const formatDueDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const priorityMeta: Record<TaskPriority, { text: string; color: string }> = {
    high: { text: 'High priority', color: 'text-rose-600' },
    medium: { text: 'Medium priority', color: 'text-amber-600' },
    low: { text: 'Low priority', color: 'text-slate-500' },
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl border border-slate-300 p-4 shadow-sm transition-all mb-2.5">
        <form onSubmit={handleSaveEdit} className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full text-sm font-medium text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={2}
            placeholder="Add details..."
            className="w-full text-xs text-slate-700 border border-slate-200 rounded-lg p-2.5 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500">Priority:</span>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
                  className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500">Due:</span>
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={!editTitle.trim()}
                className="px-3 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md flex items-center gap-1 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      className={`group bg-white rounded-xl border transition-all p-3.5 sm:p-4 mb-2.5 ${
        task.completed
          ? 'border-slate-200/60 bg-slate-50/50'
          : 'border-slate-200/90 hover:border-slate-300 shadow-2xs'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Completion Checkbox Button */}
        <button
          type="button"
          onClick={() => toggleTask(task.id)}
          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
            task.completed
              ? 'bg-slate-900 border-slate-900 text-white'
              : 'border-slate-300 hover:border-slate-500 bg-white text-transparent'
          }`}
          aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
        >
          <Check className={`w-3.5 h-3.5 ${task.completed ? 'opacity-100' : 'opacity-0'}`} />
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <h4
              onClick={() => toggleTask(task.id)}
              className={`text-sm font-medium cursor-pointer transition-colors leading-snug break-words ${
                task.completed
                  ? 'line-through text-slate-400'
                  : 'text-slate-900 hover:text-slate-700'
              }`}
            >
              {task.title}
            </h4>
          </div>

          {task.description && (
            <p
              className={`text-xs mt-1 leading-relaxed ${
                task.completed ? 'text-slate-400 line-through' : 'text-slate-600'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Clean unboxed metadata with typographic separators (anti-slop rule) */}
          <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
            <span className={`font-medium flex items-center gap-1 ${priorityMeta[task.priority].color}`}>
              <Flag className="w-3 h-3" />
              <span>{priorityMeta[task.priority].text}</span>
            </span>

            {task.dueDate && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>Due {formatDueDate(task.dueDate)}</span>
                </span>
              </>
            )}

            {task.completed && task.completedAt && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-emerald-600">
                  Done {new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Actions (Edit / Delete) */}
        <div className="flex items-center gap-1 shrink-0 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          {showConfirmDelete ? (
            <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 rounded-lg p-1">
              <span className="text-[11px] text-rose-700 font-medium px-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-rose-500" />
                Delete?
              </span>
              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                className="px-2 py-0.5 text-[11px] font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded transition-colors"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="px-1.5 py-0.5 text-[11px] text-slate-600 hover:text-slate-900 rounded transition-colors"
              >
                No
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                title="Edit task"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
