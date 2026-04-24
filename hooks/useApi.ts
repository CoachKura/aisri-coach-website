"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAISRI, fetchWorkouts, analyzeBiomechanics } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { AISRIData, Workout, BiomechanicsData, BiomechanicsInput } from "@/lib/types";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  /** True when the failure looks like a cold-starting backend (5xx). */
  serverWaking: boolean;
  /** Manually re-run the request. */
  retry: () => void;
}

function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serverWaking, setServerWaking] = useState(false);
  const [tick, setTick] = useState(0);

  const retry = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setServerWaking(false);

    fn()
      .then((d) => {
        if (cancelled) return;
        setData(d);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const e = err as {
          response?: { status?: number; data?: { message?: string | string[] } };
          message?: string;
          code?: string;
        };
        const status = e?.response?.status;
        const raw = e?.response?.data?.message;
        const msg = Array.isArray(raw) ? raw.join(", ") : raw;
        const isWaking =
          (status !== undefined && status >= 500) ||
          e?.code === "ECONNABORTED" ||
          e?.code === "ERR_NETWORK";
        const friendly =
          status === 401 ? "Sign in to view this data."
          : status === 403 ? "Not allowed."
          : isWaking ? "Server is waking up… retrying"
          : msg || e?.message || "Something went wrong";
        setError(friendly);
        setServerWaking(!!isWaking);
        setLoading(false);
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  return { data, loading, error, serverWaking, retry };
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