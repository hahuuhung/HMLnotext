import { Injectable } from '@nestjs/common';

@Injectable()
export class NodeRegistryService {
  getAvailableNodes() {
    return [
      { type: 'trigger', subtypes: ['manual', 'schedule', 'webhook', 'watchFolder'] },
      { type: 'inputNode', subtypes: ['prompt'] },
      { type: 'docInput', subtypes: ['upload', 'url'] },
      { type: 'urlInput', subtypes: ['url'] },
      { type: 'aiNode', subtypes: ['outline', 'hook3s', 'expand', 'split', 'caption', 'translate'] },
      { type: 'visualNode', subtypes: ['aiImage', 'stockSearch', 'planner'] },
      { type: 'audioTTS', subtypes: ['tts', 'bgMusic'] },
      { type: 'subtitle', subtypes: ['timeline'] },
      { type: 'codeNode', subtypes: ['js'] },
      { type: 'customAINode', subtypes: ['prompt'] },
      { type: 'renderNode', subtypes: ['mp4', 'social'] },
    ];
  }
}
