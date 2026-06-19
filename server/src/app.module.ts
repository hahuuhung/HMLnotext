import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ProjectsModule } from './projects/projects.module';
import { NodeRegistryModule } from './node-registry/node-registry.module';
import { ProvidersModule } from './providers/providers.module';
import { RenderQueueModule } from './render-queue/render-queue.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, WorkspacesModule, ProjectsModule, NodeRegistryModule, ProvidersModule, RenderQueueModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
