import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { FeedbackResult } from '@algochef/recipe-engine-core';
import { CreateSessionDto } from './dto/create-session.dto';
import { SubmitCodeDto } from './dto/submit-code.dto';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private sessions: SessionsService) {}

  @Post()
  @Throttle({ ai: { limit: 10, ttl: 60_000 } })
  create(@Body() dto: CreateSessionDto) {
    return this.sessions.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessions.findOne(id);
  }

  @Post(':id/advance')
  @Throttle({ ai: { limit: 20, ttl: 60_000 } })
  advance(@Param('id') id: string) {
    return this.sessions.advance(id);
  }

  @Post(':id/reveal-step')
  revealStep(@Param('id') id: string) {
    return this.sessions.revealStep(id);
  }

  @Post(':id/hint')
  @Throttle({ ai: { limit: 15, ttl: 60_000 } })
  hint(@Param('id') id: string) {
    return this.sessions.hint(id);
  }

  @Post(':id/submit')
  @Throttle({ ai: { limit: 10, ttl: 60_000 } })
  submit(
    @Param('id') id: string,
    @Body() dto: SubmitCodeDto,
  ): Promise<{ submission: { id: string }; feedback: FeedbackResult }> {
    return this.sessions.submit(id, dto);
  }
}
