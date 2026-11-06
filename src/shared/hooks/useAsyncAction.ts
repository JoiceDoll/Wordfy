import { useCallback, useState } from 'react';

export function useAsyncAction<TArgs extends unknown[]>(
  action: (...args: TArgs) => Promise<void>,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (...args: TArgs) => {
      setLoading(true);
      setError(null);
      try {
        await action(...args);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Algo deu errado. Tente novamente.';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [action],
  );

  const clearError = useCallback(() => setError(null), []);

  return { run, loading, error, clearError };
}
