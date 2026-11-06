import SoundPlayer from 'react-native-sound-player';

import type { IAudioPlayerService } from '@/domain';

export class AudioPlayerService implements IAudioPlayerService {
  async play(url: string): Promise<void> {
    if (!url) {
      throw new Error('Áudio indisponível para esta palavra.');
    }
    await this.stop();
    SoundPlayer.playUrl(url);
  }

  async stop(): Promise<void> {
    try {
      SoundPlayer.stop();
    } catch {
      return;
    }
  }
}
