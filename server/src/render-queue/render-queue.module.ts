import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { RenderQueueService } from './render-queue.service';
import { RenderProcessor } from './render.processor';
import { RenderQueueController } from './render-queue.controller';
import { MltGeneratorService } from './mlt-generator.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'render-jobs',
    }),
  ],
  controllers: [RenderQueueController],
  providers: [RenderQueueService, RenderProcessor, MltGeneratorService],
  exports: [RenderQueueService],
})
export class RenderQueueModule {}
