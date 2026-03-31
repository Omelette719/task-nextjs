export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  session_id: string;
  created_at: string;
  updated_at: string;
}

// Persistent session ID stored in localStorage
function getSessionId(): string {
  if (typeof window === 'undefined') return 'ssr-session';
  let id = localStorage.getItem('task_session_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('task_session_id', id);
  }
  return id;
}

function headers(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'x-session-id': getSessionId(),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch('/api/tasks', { headers: headers() });
  return handleResponse<Task[]>(res);
}

export async function createTask(
  title: string,
  description: string,
  status: TaskStatus
): Promise<Task> {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ title, description, status }),
  });
  return handleResponse<Task>(res);
}

export async function updateTask(
  id: string,
  updates: Partial<Pick<Task, 'title' | 'description' | 'status'>>
): Promise<Task> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(updates),
  });
  return handleResponse<Task>(res);
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'DELETE',
    headers: headers(),
  });
  await handleResponse<{ success: boolean }>(res);
}
