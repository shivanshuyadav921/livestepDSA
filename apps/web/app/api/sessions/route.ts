import { NextRequest, NextResponse } from 'next/server';
import { prisma, Stage as PrismaStage } from '@algochef/database';
import { recipeEngineService } from '@/lib/backend/recipe-engine.service';
import { toResponse } from '@/lib/backend/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { problemText, sourceUrl } = body;

    if (!problemText || typeof problemText !== 'string' || problemText.trim().length < 10) {
      return NextResponse.json(
        { message: 'problemText must be a string of at least 10 characters' },
        { status: 400 },
      );
    }

    if (sourceUrl && typeof sourceUrl !== 'string') {
      return NextResponse.json(
        { message: 'sourceUrl must be a string' },
        { status: 400 },
      );
    }

    const stageData = recipeEngineService.createInitialStageData();
    const understanding = await recipeEngineService.generateUnderstanding(problemText);
    stageData.understanding = understanding;

    const session = await prisma.session.create({
      data: {
        problemText,
        sourceUrl: sourceUrl || null,
        currentStage: PrismaStage.UNDERSTAND,
        stageData: stageData as unknown as object,
      },
    });

    await prisma.message.create({
      data: {
        sessionId: session.id,
        role: 'coach',
        content:
          'Welcome to AlgoChef. Let us understand the problem first — no code yet. Read the restatement and tell me what success looks like in your own words.',
        stage: PrismaStage.UNDERSTAND,
      },
    });

    const completeSession = await prisma.session.findUnique({
      where: { id: session.id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        submissions: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    if (!completeSession) {
      return NextResponse.json({ message: 'Failed to create session' }, { status: 500 });
    }

    return NextResponse.json(toResponse(completeSession));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error in POST /api/sessions:', error);
    return NextResponse.json({ message: message || 'Internal server error' }, { status: 500 });
  }
}
