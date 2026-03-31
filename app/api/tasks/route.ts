import { NextRequest, NextResponse } from 'next/server';
import { dbGetTasks, dbCreateTask, type TaskStatus } from '@/lib/db';

function getSessionId(req: NextRequest): string {
  return req.headers.get('x-session-id') || 'default-session';
}

// GET /api/tasks — list all tasks for session
export async function GET(req: NextRequest) {
  try {
    const sessionId = getSessionId(req);
    const tasks = dbGetTasks(sessionId);
    return NextResponse.json(tasks);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/tasks — create a new task
export async function POST(req: NextRequest) {
  try {
    const sessionId = getSessionId(req);
    const body = await req.json();

    const { title, description = '', status = 'pending' } = body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const validStatuses: TaskStatus[] = ['pending', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const task = dbCreateTask(sessionId, title.trim(), description, status as TaskStatus);
    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create task';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
