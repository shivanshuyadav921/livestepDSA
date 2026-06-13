import { Module } from '@nestjs/common';
import { RecipeEngineModule } from '../recipe-engine/recipe-engine.module';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

@Module({
  imports: [RecipeEngineModule],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
