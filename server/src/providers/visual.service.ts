import { Injectable, Logger } from '@nestjs/common';
import { createCanvas } from 'canvas';

@Injectable()
export class VisualService {
  private readonly logger = new Logger(VisualService.name);

  async generatePlaceholderBase64(text: string, width = 1080, height = 1920): Promise<string> {
    this.logger.log(`Generating placeholder image for text: "${text}"`);
    
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Random solid background color
    const colors = ['#1e1b4b', '#172554', '#064e3b', '#450a0a', '#4a044e'];
    const bgColor = colors[Math.floor(Math.random() * colors.length)];
    
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Draw text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Wrap text logic
    const words = text.split(' ');
    let line = '';
    let y = height / 2 - 100;
    const lineHeight = 100;
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > width - 100 && n > 0) {
        ctx.fillText(line, width / 2, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, width / 2, y);

    return canvas.toDataURL('image/png');
  }
}
