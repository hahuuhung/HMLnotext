import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { AssetCleanupService } from './asset-cleanup.service';

@Module({
  providers: [ProvidersService, AssetCleanupService]
})
export class ProvidersModule {}
