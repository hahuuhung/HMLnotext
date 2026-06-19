import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class RenderQueueService {
  constructor(@InjectQueue('render-jobs') private renderQueue: Queue) {}

  async addRenderJob(projectId: string, workflowData: any) {
    const job = await this.renderQueue.add('render-video', {
      projectId,
      workflowData,
    });
    return { jobId: job.id, status: 'queued' };
  }

  async getJobStatus(jobId: string) {
    const job = await this.renderQueue.getJob(jobId);
    if (!job) return { status: 'not-found' };
    return {
      id: job.id,
      status: await job.getState(),
      progress: job.progress(),
    };
  }
}
