import { createTtsService } from '@/services';

describe('createTtsService (Factory)', () => {
  it('cria um ITtsService com o provider react-native-tts', () => {
    const service = createTtsService({
      provider: 'react-native-tts',
      defaultLanguage: 'en-US',
    });

    expect(service).toEqual(
      expect.objectContaining({
        speak: expect.any(Function),
        stop: expect.any(Function),
      }),
    );
  });

  it('usa react-native-tts como provider padrão', () => {
    const service = createTtsService();

    expect(typeof service.speak).toBe('function');
    expect(typeof service.stop).toBe('function');
  });
});
