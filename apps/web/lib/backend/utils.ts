import { Stage as PrismaStage } from '@algochef/database';
import { StageData } from '@algochef/recipe-engine-core';

export function toResponse(session: {
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
