import { Injectable, Logger } from '@nestjs/common';

export interface SceneScript {
  scene: string;
  text: string;
}

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);

  async callPrimaryProvider(prompt: string): Promise<SceneScript[]> {
    this.logger.log(`[Primary Provider - OpenAI] Calling API...`);
    // Giả lập lỗi API 50% thời gian để test Failover
    const isError = Math.random() < 0.5;
    if (isError) {
      throw new Error('OpenAI API Rate Limit Exceeded or Timeout');
    }
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      { scene: `[OpenAI] Cảnh 1 về: ${prompt}`, text: `Xin chào, đây là nội dung từ Primary Provider về ${prompt}.` },
      { scene: `[OpenAI] Cảnh 2`, text: `Thật tuyệt vời khi được chia sẻ kiến thức này.` }
    ];
  }

  async callSecondaryProvider(prompt: string): Promise<SceneScript[]> {
    this.logger.log(`[Secondary Provider - Gemini] Fallback activated...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      { scene: `[Gemini] Cảnh mở đầu: ${prompt}`, text: `Chào các bạn. Hôm nay chúng ta nói về ${prompt}.` },
      { scene: `[Gemini] Cảnh kết thúc`, text: `Đây là nội dung dự phòng. Cảm ơn đã lắng nghe.` }
    ];
  }

  async generateScript(prompt: string): Promise<SceneScript[]> {
    this.logger.log(`Generating script for prompt: "${prompt}"`);
    
    try {
      return await this.callPrimaryProvider(prompt);
    } catch (error) {
      this.logger.warn(`Primary Provider failed: ${error.message}. Switching to Secondary Provider...`);
      try {
        return await this.callSecondaryProvider(prompt);
      } catch (fallbackError) {
        this.logger.error(`Secondary Provider also failed: ${fallbackError.message}`);
        // Ultimate fallback: return generic hardcoded script
        return [
          { scene: 'Fallback Scene', text: 'Hệ thống AI đang bảo trì. Vui lòng thử lại sau.' }
        ];
      }
    }
  }
}
