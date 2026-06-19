import { Module } from '@nestjs/common';
import { NodeRegistryService } from './node-registry.service';
import { NodeRegistryController } from './node-registry.controller';

@Module({
  providers: [NodeRegistryService],
  controllers: [NodeRegistryController],
})
export class NodeRegistryModule {}
