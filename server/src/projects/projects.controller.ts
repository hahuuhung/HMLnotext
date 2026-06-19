import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('workspaces/:workspaceId/projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Request() req: any, @Param('workspaceId') workspaceId: string, @Body() body: { name: string; description?: string }) {
    return this.projectsService.create(req.user.userId, workspaceId, body);
  }

  @Get()
  findAll(@Param('workspaceId') workspaceId: string) {
    return this.projectsService.findAllInWorkspace(workspaceId);
  }

  @Put(':id/workflow')
  updateWorkflow(@Param('id') id: string, @Body() body: { workflowData: string }) {
    return this.projectsService.updateWorkflow(id, body.workflowData);
  }
}
