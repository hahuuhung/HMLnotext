import { Injectable, Logger } from '@nestjs/common';
import * as googleTTS from 'google-tts-api';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TtsService {
  private readonly logger = new Logger(TtsService.name);

  async generateTTS(text: string, lang = 'vi'): Promise<string> {
    this.logger.log(`Generating TTS for text: "${text.substring(0, 30)}..."`);
    
    try {
      const outputDir = path.join(process.cwd(), 'outputs');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // google-tts-api has a 200 character limit per request. 
      // For MVP, we will only use getAllAudioBase64 for longer text.
      const results = await googleTTS.getAllAudioBase64(text, {
        lang: lang,
        slow: false,
        host: 'https://translate.google.com',
        splitPunct: ',.?',
      });

      // We need to decode the base64 chunks and write to a single file
      const fileName = `tts_${uuidv4()}.mp3`;
      const filePath = path.join(outputDir, fileName);

      const writeStream = fs.createWriteStream(filePath);
      for (const result of results) {
        const buffer = Buffer.from(result.base64, 'base64');
        writeStream.write(buffer);
      }
      writeStream.end();

      // Return public URL
      return `http://localhost:3000/outputs/${fileName}`;
    } catch (error) {
      this.logger.error('TTS Generation failed', error);
      throw error;
    }
  }
}
