import { NextRequest, NextResponse } from 'next/server';
import { prisma, Stage as PrismaStage } from '@algochef/database';
import { recipeEngineService } from '@/lib/backend/recipe-engine.service';
import { RecipeCard, StageData } from '@algochef/recipe-engine-core';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const body = await req.json();
    const { code, language } = body;

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return NextResponse.json({ message: 'code must be a non-empty string' }, { status: 400 });
    }

    if (!language || typeof language !== 'string') {
      return NextResponse.json({ message: 'language must be a string' }, { status: 400 });
    }

    const session = await prisma.session.findUnique({ where: { id } });
    if (!session) {
      return NextResponse.json({ message: 'Session not found' }, { status: 404 });
    }

    const recipe = (session.recipe ?? (session.stageData as unknown as StageData).recipe) as RecipeCard | undefined;
    if (!recipe) {
      return NextResponse.json(
        { message: 'Complete the recipe stage before submitting code' },
        { status: 400 },
      );
    }

    const feedback = await recipeEngineService.analyzeSubmission(
      session.problemText,
      recipe,
      code,
      language,
    );

    const submission = await prisma.submission.create({
      data: {
        sessionId: id,
        code,
        language,
        feedback: feedback as unknown as object,
      },
    });

    await prisma.session.update({
      where: { id },
      data: { currentStage: PrismaStage.REFLECT },
    });

    await prisma.message.create({
      data: {
        sessionId: id,
        role: 'coach',
        content: feedback.coachingNotes.join(' '),
        stage: PrismaStage.REFLECT,
      },
    });

    return NextResponse.json({
      submission: { id: submission.id },
      feedback,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error in POST /api/sessions/[id]/submit:', error);
    return NextResponse.json({ message: message || 'Internal server error' }, { status: 500 });
  }
}
