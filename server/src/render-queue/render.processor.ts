import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';
import { MltGeneratorService } from './mlt-generator.service';

@Processor('render-jobs')
export class RenderProcessor {
  private readonly logger = new Logger(RenderProcessor.name);

  constructor(private readonly mltGenerator: MltGeneratorService) {}

  @Process('render-video')
  async handleRender(job: Job) {
    this.logger.log(`Start rendering job ${job.id} for project ${job.data.projectId} via Shotcut MLT Engine`);
    const { scenes } = job.data.workflowData;
    const renderConfig = job.data.renderConfig || {};

    if (!scenes || scenes.length === 0) {
      throw new Error('No scenes provided for rendering.');
    }

    let outputDir = path.join(process.cwd(), 'outputs');
    if (renderConfig.outputDir && fs.existsSync(path.dirname(renderConfig.outputDir))) {
      outputDir = renderConfig.outputDir;
    }
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const finalOutputPath = path.join(outputDir, `output_${job.id}.mp4`);

    try {
      job.progress(10);
      
      // 1. Generate MLT XML
      const mltPath = this.mltGenerator.generateMltXml(scenes, finalOutputPath, 30);
      job.progress(20);

      // 2. Determine melt.exe path (Shotcut engine)
      const enginePath = process.env.MELT_PATH || 'melt'; 

      this.logger.log(`Executing MLT Engine: ${enginePath} ${mltPath} -consumer avformat:${finalOutputPath}`);

      // 3. Execute melt process
      return new Promise((resolve, reject) => {
        const meltProcess = spawn(enginePath, [mltPath, '-consumer', `avformat:${finalOutputPath}`]);

        meltProcess.stdout.on('data', (data) => {
          this.logger.debug(`MLT Engine: ${data}`);
          job.progress(50); // Mocks mid-progress
        });

        meltProcess.stderr.on('data', (data) => {
          this.logger.debug(`MLT Engine: ${data}`);
        });

        meltProcess.on('close', (code) => {
          if (code === 0) {
            this.logger.log(`Render complete via MLT: ${finalOutputPath}`);
            job.progress(100);
            resolve({ videoUrl: `/outputs/output_${job.id}.mp4` });
          } else {
            const err = new Error(`MLT Engine exited with code ${code}`);
            this.logger.error(err.message);
            reject(err);
          }
        });
        
        meltProcess.on('error', (err) => {
            this.logger.error(`Failed to start MLT Engine. Make sure Shotcut 'melt' is installed or bundled.`, err);
            reject(err);
        });
      });

    } catch (error) {
      this.logger.error('Pipeline error:', error);
      throw error;
    }
  }
}
