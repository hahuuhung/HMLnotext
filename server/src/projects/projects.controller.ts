import { Controller, Get, Post, Put, Body, Param, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Controller('workspaces/:workspaceId/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Request() req: any, @Param('workspaceId') workspaceId: string, @Body() body: { name: string; description?: string }) {
    return this.projectsService.create(req.user?.userId || 'test-user', workspaceId, body);
  }

  @Get()
  findAll(@Param('workspaceId') workspaceId: string) {
    return this.projectsService.findAllInWorkspace(workspaceId);
  }

  @Put(':id/workflow')
  updateWorkflow(@Param('id') id: string, @Body() body: { workflowData: string }) {
    return this.projectsService.updateWorkflow(id, body.workflowData);
  }

  @Post(':id/assets')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4() + path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}`);
      }
    })
  }))
  uploadAsset(@Param('id') projectId: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('File upload failed');
    }
    return {
      success: true,
      assetUrl: `http://localhost:3000/uploads/${file.filename}`,
      originalName: file.originalname,
      mimeType: file.mimetype
    };
  }
}
