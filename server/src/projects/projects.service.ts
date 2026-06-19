import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, workspaceId: string, data: { name: string; description?: string, workflowData?: string }) {
    return this.prisma.project.create({
      data: {
        ...data,
        workflowData: data.workflowData || '{}',
        ownerId: userId,
        workspaceId,
      },
    });
  }

  async findAllInWorkspace(workspaceId: string) {
    return this.prisma.project.findMany({
      where: { workspaceId },
    });
  }

  async updateWorkflow(projectId: string, workflowData: string) {
    return this.prisma.project.update({
      where: { id: projectId },
      data: { workflowData },
    });
  }
}
