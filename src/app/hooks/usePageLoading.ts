import { useState, useEffect } from 'react';

/**
 * Hook to simulate page loading with a minimum display time for skeleton
 * @param simulatedDelay - Delay in ms to simulate data fetching (default: 1500ms)
 * @param minLoadingTime - Minimum time to show skeleton (default: 800ms)
 */
export function usePageLoading(simulatedDelay = 1500, minLoadingTime = 800) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const startTime = Date.now();

    const timer = setTimeout(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minLoadingTime - elapsed);

      setTimeout(() => {
        setIsLoading(false);
      }, remaining);
    }, simulatedDelay);

    return () => clearTimeout(timer);
  }, [simulatedDelay, minLoadingTime]);

  return isLoading;
}

/**
 * Hook for section-specific loading with data dependency
 */
export function useSectionLoading<T>(
  dataFetcher: () => Promise<T>,
  deps: any[] = []
) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const result = await dataFetcher();
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, deps);

  return { isLoading, data, error };
}
