import { Test, TestingModule } from '@nestjs/testing';
import { RenderQueueService } from './render-queue.service';

describe('RenderQueueService', () => {
  let service: RenderQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RenderQueueService],
    }).compile();

    service = module.get<RenderQueueService>(RenderQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
