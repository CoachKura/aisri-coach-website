"use client";

import { useState, useEffect } from "react";
import { fetchAISRI, fetchWorkouts, analyzeBiomechanics } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { AISRIData, Workout, BiomechanicsData, BiomechanicsInput } from "@/lib/types";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    fn()
      .then((data) => { if (!cancelled) setState({ data, loading: false, error: null }); })
      .catch((err: unknown) => {
        if (cancelled) return;
        // axios error shape
        const e = err as { response?: { status?: number; data?: { message?: string | string[] } }; message?: string };
        const status = e?.response?.status;
        const raw = e?.response?.data?.message;
        const msg = Array.isArray(raw) ? raw.join(", ") : raw;
        const friendly =
          status === 401 ? "Sign in to view this data."
          : status === 403 ? "Not allowed."
          : msg || e?.message || "Something went wrong";
        setState({ data: null, loading: false, error: friendly });
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}

export function useAISRI(): AsyncState<AISRIData> {
  const { token } = useAuth();
  return useAsync(fetchAISRI, [token]);
}

export function useWorkouts(): AsyncState<Workout[]> {
  const { token } = useAuth();
  return useAsync(fetchWorkouts, [token]);
}

export function useBiomechanics(input: BiomechanicsInput): AsyncState<BiomechanicsData> {
  const { token } = useAuth();
  return useAsync(() => analyzeBiomechanics(input), [token]);
}