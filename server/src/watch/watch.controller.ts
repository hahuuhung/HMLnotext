import { Controller, Get, Sse, Post, Body, MessageEvent } from '@nestjs/common';
import { WatchService } from './watch.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('watch')
export class WatchController {
  constructor(private readonly watchService: WatchService) {}

  @Get('path')
  getWatchPath() {
    return { path: this.watchService.getWatchPath() };
  }

  @Post('path')
  async setWatchPath(@Body() body: { path: string }) {
    if (!body.path) {
      return { success: false, message: 'Path is required' };
    }
    const success = await this.watchService.setWatchPath(body.path);
    return { success, path: this.watchService.getWatchPath() };
  }

  @Sse('events')
  sse(): Observable<MessageEvent> {
    return this.watchService.fileEvents$.pipe(
      map((payload) => ({
        data: payload,
      } as MessageEvent)),
    );
  }
}
