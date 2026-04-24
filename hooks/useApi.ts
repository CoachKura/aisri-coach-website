'use client';

import { useState, useEffect } from 'react';
import { fetchAISRI, fetchWorkouts, analyzeBiomechanics } from '@/lib/api';
import type { AISRIData, Workout, BiomechanicsData, BiomechanicsInput } from '@/lib/types';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useAsync<T>(fn: () => Promise<T>): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    fn()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Something went wrong';
          setState({ data: null, loading: false, error: message });
        }
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}

export function useAISRI(): AsyncState<AISRIData> {
  return useAsync(fetchAISRI);
}

export function useWorkouts(): AsyncState<Workout[]> {
  return useAsync(fetchWorkouts);
}

export function useBiomechanics(input: BiomechanicsInput): AsyncState<BiomechanicsData> {
  const [state, setState] = useState<AsyncState<BiomechanicsData>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    analyzeBiomechanics(input)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Something went wrong';
          setState({ data: null, loading: false, error: message });
        }
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
