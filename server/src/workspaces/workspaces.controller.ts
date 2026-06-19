import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  create(@Request() req: any, @Body() body: { name: string; description?: string }) {
    return this.workspacesService.create(req.user.userId, body);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.workspacesService.findAllForUser(req.user.userId);
  }
}
