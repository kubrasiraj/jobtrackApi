import { useCallback, useEffect, useState } from 'react';

// Runs an async loader whenever `deps` change and keeps the previous data
// visible while a refresh is in flight.
export function useAsync(loader, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    loader()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (!cancelled) setState((prev) => ({ ...prev, loading: false, error }));
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((value) => value + 1), []);
  // Lets callers apply a known-good result (e.g. a PATCH response) without refetching.
  const setData = useCallback(
    (updater) => setState((prev) => ({ ...prev, data: typeof updater === 'function' ? updater(prev.data) : updater })),
    [],
  );
  return { ...state, reload, setData };
}
