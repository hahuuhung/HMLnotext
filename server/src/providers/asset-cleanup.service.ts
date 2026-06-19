import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AssetCleanupService {
  private readonly logger = new Logger(AssetCleanupService.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleCron() {
    this.logger.debug('Running asset cleanup task for files older than 7 days...');
    // Lógica dọn dẹp file lưu tạm trên S3 / hệ thống file
  }
}
