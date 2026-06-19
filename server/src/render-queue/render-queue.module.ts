import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { RenderQueueService } from './render-queue.service';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'render-jobs',
    }),
  ],
  providers: [RenderQueueService],
})
export class RenderQueueModule {}
