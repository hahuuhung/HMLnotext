import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { LlmService } from './llm.service';
import { VisualService } from './visual.service';
import { TtsService } from './tts.service';

export class GenerateScriptDto {
  prompt: string;
}

export class GenerateTtsDto {
  text: string;
}

@Controller('providers')
export class ProvidersController {
  constructor(
    private readonly llmService: LlmService,
    private readonly visualService: VisualService,
    private readonly ttsService: TtsService
  ) {}

  @Post('generate-script')
  async generateScript(@Body() body: GenerateScriptDto) {
    const script = await this.llmService.generateScript(body.prompt);
    
    // Auto-generate placeholder images for each scene
    for (const scene of script) {
      (scene as any).image = await this.visualService.generatePlaceholderBase64(scene.scene.substring(0, 30));
    }

    return {
      success: true,
      data: script
    };
  }

  @Get('placeholder')
  async getPlaceholder(@Query('text') text: string) {
    const base64 = await this.visualService.generatePlaceholderBase64(text || 'No Text');
    return { success: true, image: base64 };
  }

  @Post('generate-tts')
  async generateTts(@Body() body: GenerateTtsDto) {
    const url = await this.ttsService.generateTTS(body.text);
    return { success: true, url };
  }
}
