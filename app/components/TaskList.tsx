'use client';

import { Pencil, Trash2 } from 'lucide-react';
import type { Task } from '@/lib/taskApi';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => Promise<void>;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
};

const statusLabels = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No tasks yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 break-words">{task.title}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[task.status]}`}
                >
                  {statusLabels[task.status]}
                </span>
              </div>
              {task.description && (
                <p className="text-gray-600 text-sm mb-2 break-words">{task.description}</p>
              )}
              <p className="text-xs text-gray-500">
                {new Date(task.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => onEdit(task)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Edit task"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Delete task"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
