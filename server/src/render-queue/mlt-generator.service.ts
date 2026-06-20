import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface RenderScene {
  id?: string;
  image: string;
  audioUrl?: string;
  text?: string;
  duration?: number;
  fxClass?: string;
  transitionClass?: string;
  bgClass?: string;
  speedClass?: string;
}

@Injectable()
export class MltGeneratorService {
  private readonly logger = new Logger(MltGeneratorService.name);

  /**
   * Tạo tệp XML kịch bản của Shotcut (.mlt) từ mảng scenes.
   */
  public generateMltXml(scenes: RenderScene[], outputPath: string, fps: number = 30): string {
    const mltPath = outputPath.replace('.mp4', '.mlt');
    
    let xml = `<?xml version="1.0" encoding="utf-8"?>\n`;
    xml += `<mlt LC_NUMERIC="C" version="7.15.0" title="Shotcut version 23.05.14" producer="main_bin">\n`;
    xml += `  <profile description="HD 1080p ${fps} fps" width="1920" height="1080" progressive="1" sample_aspect_num="1" sample_aspect_den="1" display_aspect_num="16" display_aspect_den="9" frame_rate_num="${fps}" frame_rate_den="1" colorspace="709"/>\n`;
    
    let playlistEntries = '';
    let currentIn = 0;

    // 1. Generate Producers for each scene
    scenes.forEach((scene, index) => {
      const durationSec = scene.duration || 5;
      const speedFactor = this.getSpeedFactor(scene.speedClass);
      
      const framesLength = Math.round(durationSec * fps / speedFactor);
      const outFrame = currentIn + framesLength - 1;

      // Handle base64 image or local path
      let imageResource = scene.image;
      if (scene.image.startsWith('http://localhost:3000')) {
          imageResource = scene.image.replace('http://localhost:3000', process.cwd());
      }
      
      const producerId = `producer_${index}`;
      xml += `  <producer id="${producerId}" in="0" out="${framesLength - 1}">\n`;
      xml += `    <property name="length">${framesLength}</property>\n`;
      xml += `    <property name="resource">${imageResource}</property>\n`;
      
      // Apply filters based on fxClass
      xml += this.generateFilters(scene, framesLength);
      
      xml += `  </producer>\n`;

      // 2. Build Playlist
      playlistEntries += `    <entry producer="${producerId}" in="0" out="${framesLength - 1}"/>\n`;
      currentIn += framesLength;
    });

    // 3. Generate main playlist
    xml += `  <playlist id="playlist0">\n`;
    xml += playlistEntries;
    xml += `  </playlist>\n`;

    // 4. Generate Tractor (Main timeline)
    xml += `  <tractor id="tractor0" title="Shotcut version 23.05.14" in="0" out="${currentIn - 1}">\n`;
    xml += `    <property name="shotcut">1</property>\n`;
    xml += `    <property name="shotcut:scaleFactor">1</property>\n`;
    xml += `    <multitrack>\n`;
    xml += `      <track producer="playlist0"/>\n`;
    xml += `    </multitrack>\n`;
    xml += `  </tractor>\n`;
    
    xml += `</mlt>\n`;

    fs.writeFileSync(mltPath, xml, 'utf8');
    this.logger.log(`Created MLT XML file at ${mltPath}`);
    return mltPath;
  }

  private getSpeedFactor(speedClass?: string): number {
    if (!speedClass) return 1.0;
    if (speedClass.includes('slow')) return 0.5;
    if (speedClass.includes('fast')) return 2.0;
    return 1.0;
  }

  private generateFilters(scene: RenderScene, length: number): string {
    let filtersXml = '';
    
    // Resize & Position (to fit 1920x1080)
    filtersXml += `    <filter id="filter_resize">\n`;
    filtersXml += `      <property name="mlt_service">qtblend</property>\n`;
    filtersXml += `      <property name="rect">0 0 1920 1080 1</property>\n`;
    filtersXml += `    </filter>\n`;

    // Video Fx Class translation (Example mapping Frei0r effects)
    if (scene.fxClass) {
      if (scene.fxClass.includes('cinematic')) {
        filtersXml += `    <filter id="filter_color">\n`;
        filtersXml += `      <property name="mlt_service">frei0r.coloradj_RGB</property>\n`;
        filtersXml += `      <property name="R">1.1</property>\n`;
        filtersXml += `      <property name="G">1.0</property>\n`;
        filtersXml += `      <property name="B">0.9</property>\n`;
        filtersXml += `    </filter>\n`;
      } else if (scene.fxClass.includes('vintage')) {
        filtersXml += `    <filter id="filter_sepia">\n`;
        filtersXml += `      <property name="mlt_service">sepia</property>\n`;
        filtersXml += `      <property name="u">50</property>\n`;
        filtersXml += `      <property name="v">150</property>\n`;
        filtersXml += `    </filter>\n`;
      }
    }

    // Add Text overlay if exists
    if (scene.text) {
      const safeText = scene.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      filtersXml += `    <filter id="filter_text">\n`;
      filtersXml += `      <property name="mlt_service">dynamictext</property>\n`;
      filtersXml += `      <property name="argument">${safeText}</property>\n`;
      filtersXml += `      <property name="geometry">0 800 1920 200 1</property>\n`;
      filtersXml += `      <property name="family">Sans</property>\n`;
      filtersXml += `      <property name="size">48</property>\n`;
      filtersXml += `      <property name="weight">400</property>\n`;
      filtersXml += `      <property name="fgcolour">#ffffff</property>\n`;
      filtersXml += `      <property name="bgcolour">#80000000</property>\n`;
      filtersXml += `    </filter>\n`;
    }

    return filtersXml;
  }
}
