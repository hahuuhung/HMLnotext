import { Test, TestingModule } from '@nestjs/testing';
import { NodeRegistryService } from './node-registry.service';

describe('NodeRegistryService', () => {
  let service: NodeRegistryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NodeRegistryService],
    }).compile();

    service = module.get<NodeRegistryService>(NodeRegistryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
