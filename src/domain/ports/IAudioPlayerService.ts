export interface IAudioPlayerService {
  play(url: string): Promise<void>;
  stop(): Promise<void>;
}
