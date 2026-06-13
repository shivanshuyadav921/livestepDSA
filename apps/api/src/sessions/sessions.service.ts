import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { prisma, Stage as PrismaStage } from '@algochef/database';
import {
  FeedbackResult,
  RecipeCard,
  Stage,
  StageData,
  createDefaultStageData,
} from '@algochef/recipe-engine-core';
import { RecipeEngineService } from '../recipe-engine/recipe-engine.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { SubmitCodeDto } from './dto/submit-code.dto';

@Injectable()
export class SessionsService {
  constructor(private recipeEngine: RecipeEngineService) {}

  async create(dto: CreateSessionDto) {
    const stageData = this.recipeEngine.createInitialStageData();

    const understanding = await this.recipeEngine.generateUnderstanding(
      dto.problemText,
    );
    stageData.understanding = understanding;

    const session = await prisma.session.create({
      data: {
        problemText: dto.problemText,
        sourceUrl: dto.sourceUrl,
        currentStage: PrismaStage.UNDERSTAND,
        stageData: stageData as object,
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

    return this.toResponse(session);
  }

  async findOne(id: string) {
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        submissions: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    if (!session) throw new NotFoundException('Session not found');
    return this.toResponse(session);
  }

  async advance(id: string) {
    const session = await prisma.session.findUnique({ where: { id } });
    if (!session) throw new NotFoundException('Session not found');

    const currentStage = session.currentStage as Stage;
    const stageData = session.stageData as unknown as StageData;

    const result = await this.recipeEngine.advanceStage(
      session.problemText,
      currentStage,
      stageData,
    );

    const updated = await prisma.session.update({
      where: { id },
      data: {
        currentStage: result.stage as PrismaStage,
        stageData: result.stageData as object,
        recipe: result.recipe ? (result.recipe as object) : undefined,
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

    return this.toResponse(updated);
  }

  async revealStep(id: string) {
    const session = await prisma.session.findUnique({ where: { id } });
    if (!session) throw new NotFoundException('Session not found');

    const stageData = session.stageData as unknown as StageData;
    if (!stageData.recipe) {
      throw new BadRequestException('Recipe not available yet');
    }

    const updatedStageData = await this.recipeEngine.revealNextStep(stageData);

    const updated = await prisma.session.update({
      where: { id },
      data: { stageData: updatedStageData as object },
    });

    const stepNum = updatedStageData.revealedSteps;
    const step = stageData.recipe.steps[stepNum - 1];

    if (step) {
      await prisma.message.create({
        data: {
          sessionId: id,
          role: 'coach',
          content: `Step ${step.order} unlocked: ${step.action}`,
          stage: session.currentStage,
        },
      });
    }

    return this.toResponse(updated);
  }

  async hint(id: string) {
    const session = await prisma.session.findUnique({ where: { id } });
    if (!session) throw new NotFoundException('Session not found');

    const stageData = session.stageData as unknown as StageData;
    const { hint, stageData: updatedStageData } =
      await this.recipeEngine.requestHint(
        session.problemText,
        session.currentStage as Stage,
        stageData,
      );

    const updated = await prisma.session.update({
      where: { id },
      data: {
        stageData: updatedStageData as object,
        hintsUsed: updatedStageData.hintsUsed,
      },
    });

    await prisma.message.create({
      data: {
        sessionId: id,
        role: 'coach',
        content: `Hint: ${hint}`,
        stage: session.currentStage,
      },
    });

    return { session: this.toResponse(updated), hint };
  }

  async submit(
    id: string,
    dto: SubmitCodeDto,
  ): Promise<{ submission: { id: string }; feedback: FeedbackResult }> {
    const session = await prisma.session.findUnique({ where: { id } });
    if (!session) throw new NotFoundException('Session not found');

    const recipe = (session.recipe ?? (session.stageData as unknown as StageData).recipe) as
      | RecipeCard
      | undefined;

    if (!recipe) {
      throw new BadRequestException('Complete the recipe stage before submitting code');
    }

    const feedback = await this.recipeEngine.analyzeSubmission(
      session.problemText,
      recipe,
      dto.code,
      dto.language,
    );

    const submission = await prisma.submission.create({
      data: {
        sessionId: id,
        code: dto.code,
        language: dto.language,
        feedback: feedback as object,
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

    return { submission: { id: submission.id }, feedback };
  }

  private toResponse(session: {
    id: string;
    problemText: string;
    sourceUrl: string | null;
    currentStage: PrismaStage;
    recipe: unknown;
    stageData: unknown;
    hintsUsed: number;
    createdAt: Date;
    messages?: { id: string; role: string; content: string; stage: PrismaStage | null; createdAt: Date }[];
    submissions?: { id: string; feedback: unknown }[];
  }) {
    const stageData = session.stageData as unknown as StageData;

    return {
      id: session.id,
      problemText: session.problemText,
      sourceUrl: session.sourceUrl,
      currentStage: session.currentStage,
      stageData,
      recipe: session.recipe ?? stageData.recipe ?? null,
      hintsUsed: session.hintsUsed,
      createdAt: session.createdAt,
      messages: session.messages ?? [],
      latestFeedback: session.submissions?.[0]?.feedback ?? null,
    };
  }
}
