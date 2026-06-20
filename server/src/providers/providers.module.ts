import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { AssetCleanupService } from './asset-cleanup.service';
import { LlmService } from './llm.service';
import { ProvidersController } from './providers.controller';
import { VisualService } from './visual.service';
import { TtsService } from './tts.service';

@Module({
  controllers: [ProvidersController],
  providers: [ProvidersService, AssetCleanupService, LlmService, VisualService, TtsService],
  exports: [ProvidersService, LlmService, VisualService, TtsService],
})
export class ProvidersModule {}
