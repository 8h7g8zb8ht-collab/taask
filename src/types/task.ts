export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
}

export type TaskFilter = 'all' | 'active' | 'completed';
export type TaskSort = 'newest' | 'oldest' | 'dueDate' | 'priority';
