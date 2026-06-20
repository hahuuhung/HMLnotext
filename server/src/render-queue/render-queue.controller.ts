import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { RenderQueueService } from './render-queue.service';

@Controller('render')
export class RenderQueueController {
  constructor(private readonly renderQueueService: RenderQueueService) {}

  @Post()
  async startRender(@Body() body: any) {
    const { projectId, workflowData } = body;
    const job = await this.renderQueueService.addRenderJob(projectId, workflowData);
    return { success: true, job };
  }

  @Get(':jobId/status')
  async getStatus(@Param('jobId') jobId: string) {
    const status = await this.renderQueueService.getJobStatus(jobId);
    return { success: true, status };
  }
}
