import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Task, TaskPriority, TaskFilter, TaskSort } from '../types/task';
import { useAuth } from './AuthContext';

interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
}

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: TaskSort;
  setSortBy: (sort: TaskSort) => void;
  createTask: (input: CreateTaskInput) => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<CreateTaskInput>) => void;
  stats: {
    total: number;
    active: number;
    completed: number;
    completionPercentage: number;
  };
}

// Initial in-memory task seeds associated with initial users (pure React state, no localStorage)
const INITIAL_TASKS: Task[] = [
  {
    id: 'task_1',
    userId: 'usr_alex',
    title: 'Review product design specifications for Q4 release',
    description: 'Walk through the latest Figma wireframes and compile feedback for the engineering team.',
    completed: false,
    priority: 'high',
    dueDate: '2026-09-30',
    createdAt: '2026-09-27T09:00:00.000Z',
  },
  {
    id: 'task_2',
    userId: 'usr_alex',
    title: 'Prepare project status briefing for stakeholder sync',
    description: 'Gather milestones, risks, and upcoming deliverables for tomorrow morning sync.',
    completed: true,
    priority: 'medium',
    dueDate: '2026-09-28',
    createdAt: '2026-09-26T14:20:00.000Z',
    completedAt: '2026-09-28T03:15:00.000Z',
  },
  {
    id: 'task_3',
    userId: 'usr_alex',
    title: 'Update environment variables documentation',
    description: 'Ensure all onboarding developers understand the Supabase and client configuration steps.',
    completed: false,
    priority: 'low',
    dueDate: '2026-10-05',
    createdAt: '2026-09-28T01:00:00.000Z',
  },
  {
    id: 'task_4',
    userId: 'usr_sarah',
    title: 'Coordinate team sprint retrospective notes',
    description: 'Review action items from previous retrospective and summarize key takeaways.',
    completed: false,
    priority: 'high',
    dueDate: '2026-09-29',
    createdAt: '2026-09-25T11:00:00.000Z',
  },
  {
    id: 'task_5',
    userId: 'usr_sarah',
    title: 'Draft customer feedback survey questions',
    description: 'Formulate 5 focused questions to evaluate satisfaction on the new dashboard.',
    completed: true,
    priority: 'medium',
    dueDate: '2026-09-27',
    createdAt: '2026-09-24T08:30:00.000Z',
    completedAt: '2026-09-27T16:45:00.000Z',
  },
];

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<TaskSort>('newest');

  // CRITICAL REQUIREMENT 5: Each user should only see their own tasks
  const currentUserTasks = useMemo(() => {
    if (!user) return [];
    return tasks.filter((task) => task.userId === user.id);
  }, [tasks, user]);

  const stats = useMemo(() => {
    const total = currentUserTasks.length;
    const completed = currentUserTasks.filter((t) => t.completed).length;
    const active = total - completed;
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, active, completed, completionPercentage };
  }, [currentUserTasks]);

  const filteredTasks = useMemo(() => {
    let result = [...currentUserTasks];

    // Filter by status
    if (filter === 'active') {
      result = result.filter((t) => !t.completed);
    } else if (filter === 'completed') {
      result = result.filter((t) => t.completed);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'priority') {
        const priorityOrder: Record<TaskPriority, number> = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });

    return result;
  }, [currentUserTasks, filter, searchQuery, sortBy]);

  const createTask = (input: CreateTaskInput) => {
    if (!user) return;
    const trimmedTitle = input.title.trim();
    if (!trimmedTitle) return;

    const newTask: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: user.id,
      title: trimmedTitle,
      description: input.description?.trim() || undefined,
      completed: false,
      priority: input.priority || 'medium',
      dueDate: input.dueDate || undefined,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const updateTask = (taskId: string, updates: Partial<CreateTaskInput>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            title: updates.title !== undefined ? updates.title.trim() : t.title,
            description: updates.description !== undefined ? updates.description.trim() || undefined : t.description,
            priority: updates.priority ?? t.priority,
            dueDate: updates.dueDate ?? t.dueDate,
          };
        }
        return t;
      })
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: currentUserTasks,
        filteredTasks,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        createTask,
        toggleTask,
        deleteTask,
        updateTask,
        stats,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
