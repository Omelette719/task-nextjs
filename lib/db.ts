import fs from 'fs';
import path from 'path';

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

// JSON file stored at project root
const DB_PATH = path.join(process.cwd(), 'tasks.json');

function readDb(): Task[] {
  try {
    if (!fs.existsSync(DB_PATH)) return [];
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
}

function writeDb(tasks: Task[]): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(tasks, null, 2), 'utf-8');
}

export function dbGetTasks(sessionId: string): Task[] {
  return readDb()
    .filter((t) => t.session_id === sessionId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function dbCreateTask(
  sessionId: string,
  title: string,
  description: string,
  status: TaskStatus
): Task {
  const tasks = readDb();
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
  writeDb(tasks);
  return newTask;
}

export function dbUpdateTask(
  id: string,
  sessionId: string,
  updates: Partial<Pick<Task, 'title' | 'description' | 'status'>>
): Task | null {
  const tasks = readDb();
  const idx = tasks.findIndex((t) => t.id === id && t.session_id === sessionId);
  if (idx === -1) return null;
  tasks[idx] = { ...tasks[idx], ...updates, updated_at: new Date().toISOString() };
  writeDb(tasks);
  return tasks[idx];
}

export function dbDeleteTask(id: string, sessionId: string): boolean {
  const tasks = readDb();
  const filtered = tasks.filter((t) => !(t.id === id && t.session_id === sessionId));
  if (filtered.length === tasks.length) return false;
  writeDb(filtered);
  return true;
}
