import { Controller, Get, UseGuards } from '@nestjs/common';
import { NodeRegistryService } from './node-registry.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('node-registry')
@UseGuards(JwtAuthGuard)
export class NodeRegistryController {
  constructor(private readonly nodeRegistryService: NodeRegistryService) {}

  @Get()
  getAvailableNodes() {
    return this.nodeRegistryService.getAvailableNodes();
  }
}
