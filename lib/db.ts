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

// ⚠️ In-memory storage (tidak persistent, tapi aman di Vercel)
let tasks: Task[] = [];

export function dbGetTasks(sessionId: string): Task[] {
  return tasks
    .filter((t) => t.session_id === sessionId)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    );
}

export function dbCreateTask(
  sessionId: string,
  title: string,
  description: string,
  status: TaskStatus
): Task {
  const now = new Date().toISOString();

  const newTask: Task = {
    id: crypto.randomUUID(),
    title,
    description,
    status,
    session_id: sessionId,
    created_at: now,
    updated_at: now,
  };

  tasks.push(newTask);
  return newTask;
}

export function dbUpdateTask(
  id: string,
  sessionId: string,
  updates: Partial<Pick<Task, 'title' | 'description' | 'status'>>
): Task | null {
  const idx = tasks.findIndex(
    (t) => t.id === id && t.session_id === sessionId
  );

  if (idx === -1) return null;

  tasks[idx] = {
    ...tasks[idx],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  return tasks[idx];
}

export function dbDeleteTask(
  id: string,
  sessionId: string
): boolean {
  const before = tasks.length;

  tasks = tasks.filter(
    (t) => !(t.id === id && t.session_id === sessionId)
  );

  return tasks.length !== before;
}