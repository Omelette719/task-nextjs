import { NextRequest, NextResponse } from 'next/server';
import { dbUpdateTask, dbDeleteTask, type TaskStatus } from '@/lib/db';

function getSessionId(req: NextRequest): string {
  return req.headers.get('x-session-id') || 'default-session';
}

// PUT /api/tasks/[id] — update a task
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const sessionId = getSessionId(req);
    const id = context.params.id;
    const body = await req.json();

    const updates: Partial<{ title: string; description: string; status: TaskStatus }> = {};
    if (body.title !== undefined) updates.title = body.title;
    if (body.description !== undefined) updates.description = body.description;

    if (body.status !== undefined) {
      const validStatuses: TaskStatus[] = ['pending', 'in_progress', 'completed'];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      updates.status = body.status;
    }

    const task = dbUpdateTask(id, sessionId, updates);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update task';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/tasks/[id] — delete a task
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const sessionId = getSessionId(req);
    const id = context.params.id;

    const deleted = dbDeleteTask(id, sessionId);

    if (!deleted) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete task';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}