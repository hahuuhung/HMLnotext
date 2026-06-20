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
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { SentryExceptionFilter } from './common/filters/sentry-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HealthModule } from './health/health.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { WatchModule } from './watch/watch.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'outputs'),
      serveRoot: '/outputs',
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100, // 100 requests per minute
    }]),
    ScheduleModule.forRoot(),
    PrismaModule, 
    UsersModule, 
    AuthModule, 
    WorkspacesModule, 
    ProjectsModule, 
    NodeRegistryModule, 
    ProvidersModule, 
    RenderQueueModule,
    HealthModule,
    WatchModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: SentryExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
