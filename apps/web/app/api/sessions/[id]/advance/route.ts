import { NextRequest, NextResponse } from 'next/server';
import { prisma, Stage as PrismaStage } from '@algochef/database';
import { recipeEngineService } from '@/lib/backend/recipe-engine.service';
import { toResponse } from '@/lib/backend/utils';
import { Stage, StageData } from '@algochef/recipe-engine-core';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const session = await prisma.session.findUnique({ where: { id } });
    if (!session) {
      return NextResponse.json({ message: 'Session not found' }, { status: 404 });
    }

    const currentStage = session.currentStage as Stage;
    const stageData = session.stageData as unknown as StageData;

    const result = await recipeEngineService.advanceStage(
      session.problemText,
      currentStage,
      stageData,
    );

    await prisma.session.update({
      where: { id },
      data: {
        currentStage: result.stage as PrismaStage,
        stageData: result.stageData as unknown as object,
        recipe: result.recipe ? (result.recipe as unknown as object) : undefined,
      },
    });

    await prisma.message.create({
      data: {
        sessionId: id,
        role: 'coach',
        content: result.coachMessage,
        stage: result.stage as PrismaStage,
      },
    });

    const completeSession = await prisma.session.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        submissions: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    if (!completeSession) {
      return NextResponse.json({ message: 'Failed to find updated session' }, { status: 500 });
    }

    return NextResponse.json(toResponse(completeSession));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error in POST /api/sessions/[id]/advance:', error);
    return NextResponse.json({ message: message || 'Internal server error' }, { status: 500 });
  }
}
