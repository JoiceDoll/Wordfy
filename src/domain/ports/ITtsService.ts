export type TtsSpeakOptions = {
  language?: string;
  rate?: number;
  /** Progresso da fala de 0 a 1 (início → fim). */
  onProgress?: (progress: number) => void;
};

/**
 * Port de Text-to-Speech.
 * A View/ViewModel só dependem desta interface; a lib concreta
 * fica atrás do adapter + factory em `services/tts`.
 */
export interface ITtsService {
  speak(text: string, options?: TtsSpeakOptions): Promise<void>;
  stop(): Promise<void>;
}
