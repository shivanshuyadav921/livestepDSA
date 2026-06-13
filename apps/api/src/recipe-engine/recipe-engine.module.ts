import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { ComplexityCoach } from './complexity-coach';
import { FeedbackAnalyzer } from './feedback-analyzer';
import { HintGenerator } from './hint-generator';
import { ObservationGenerator } from './observation-generator';
import { PatternDetector } from './pattern-detector';
import { RecipeEngineService } from './recipe-engine.service';
import { StepGenerator } from './step-generator';
import { UnderstandingGenerator } from './understanding-generator';

@Module({
  imports: [AiModule],
  providers: [
    RecipeEngineService,
    UnderstandingGenerator,
    ObservationGenerator,
    PatternDetector,
    StepGenerator,
    ComplexityCoach,
    HintGenerator,
    FeedbackAnalyzer,
  ],
  exports: [RecipeEngineService],
})
export class RecipeEngineModule {}
