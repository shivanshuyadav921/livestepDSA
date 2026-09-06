import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@algochef/database';
import { toResponse } from '@/lib/backend/utils';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        submissions: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    if (!session) {
      return NextResponse.json({ message: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json(toResponse(session));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error in GET /api/sessions/[id]:', error);
    return NextResponse.json({ message: message || 'Internal server error' }, { status: 500 });
  }
}
