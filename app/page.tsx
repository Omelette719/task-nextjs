'use client';

import { useEffect, useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { fetchTasks, createTask, updateTask, deleteTask } from '@/lib/taskApi';
import type { Task, TaskStatus } from '@/lib/taskApi';

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (title: string, description: string, status: TaskStatus) => {
    const newTask = await createTask(title, description, status);
    setTasks([newTask, ...tasks]);
    setShowForm(false);
  };

  const handleUpdateTask = async (title: string, description: string, status: TaskStatus) => {
    if (!editingTask) return;
    const updated = await updateTask(editingTask.id, { title, description, status });
    setTasks(tasks.map((t) => (t.id === editingTask.id ? updated : t)));
    setEditingTask(null);
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-gray-900">Task Manager</h1>
            {!showForm && !editingTask && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                <Plus className="w-5 h-5" />
                New Task
              </button>
            )}
          </div>
          <p className="text-gray-600">Organize your work with a simple task manager</p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Create form */}
        {showForm && (
          <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Task</h2>
            <TaskForm onSubmit={handleCreateTask} onCancel={handleCancelForm} />
          </div>
        )}

        {/* Edit form */}
        {editingTask && (
          <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Task</h2>
            <TaskForm task={editingTask} onSubmit={handleUpdateTask} onCancel={handleCancelForm} />
          </div>
        )}

        {/* Task list */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <TaskList tasks={tasks} onEdit={(task) => setEditingTask(task)} onDelete={handleDeleteTask} />
        )}
      </div>
    </div>
  );
}
