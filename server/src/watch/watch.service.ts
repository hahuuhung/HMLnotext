import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as chokidar from 'chokidar';
import * as os from 'os';
import * as path from 'path';
import { Subject } from 'rxjs';
import * as fs from 'fs';

@Injectable()
export class WatchService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WatchService.name);
  private watcher: chokidar.FSWatcher | null = null;
  private watchPath: string;

  public readonly fileEvents$ = new Subject<{ type: string; path: string; name: string }>();

  constructor() {
    // Default to a folder named "VietFlow_Assets" in user's home directory
    this.watchPath = path.join(os.homedir(), 'VietFlow_Assets');
  }

  onModuleInit() {
    this.startWatching(this.watchPath);
  }

  onModuleDestroy() {
    if (this.watcher) {
      this.watcher.close();
    }
  }

  public getWatchPath(): string {
    return this.watchPath;
  }

  public async setWatchPath(newPath: string): Promise<boolean> {
    try {
      if (!fs.existsSync(newPath)) {
        fs.mkdirSync(newPath, { recursive: true });
      }
      this.watchPath = newPath;
      await this.startWatching(this.watchPath);
      return true;
    } catch (err) {
      this.logger.error(`Error setting watch path: ${err.message}`);
      return false;
    }
  }

  private async startWatching(targetPath: string) {
    if (this.watcher) {
      await this.watcher.close();
    }

    if (!fs.existsSync(targetPath)) {
      try {
        fs.mkdirSync(targetPath, { recursive: true });
      } catch (err) {
        this.logger.error(`Could not create default watch path: ${targetPath}`);
        return;
      }
    }

    this.logger.log(`Starting to watch directory: ${targetPath}`);

    this.watcher = chokidar.watch(targetPath, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true,
    });

    this.watcher
      .on('add', (filePath) => {
        this.logger.log(`File added: ${filePath}`);
        // Notify frontend via SSE
        this.fileEvents$.next({
          type: 'add',
          path: filePath,
          name: path.basename(filePath),
        });
      })
      .on('unlink', (filePath) => {
        this.fileEvents$.next({
          type: 'remove',
          path: filePath,
          name: path.basename(filePath),
        });
      });
  }
}
