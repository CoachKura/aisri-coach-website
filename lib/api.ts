import axios from 'axios';
import type { AISRIData, Workout, BiomechanicsData, BiomechanicsInput } from './types';

// ---------------------------------------------------------------------------
// Token helpers (browser-safe)
// ---------------------------------------------------------------------------
export const tokenStorage = {
  get: (): string | null =>
    typeof window !== 'undefined' ? localStorage.getItem('aisri_token') : null,

  set: (token: string): void => {
    if (typeof window !== 'undefined') localStorage.setItem('aisri_token', token);
  },

  clear: (): void => {
    if (typeof window !== 'undefined') localStorage.removeItem('aisri_token');
  },
};

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request when a token exists
api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: { id: string; email: string; name: string };
  token: { access_token: string; type: string };
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/auth/login', payload);
  tokenStorage.set(data.token.access_token);
  return data;
}

export async function register(payload: {
  email: string;
  name: string;
  password: string;
}): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/auth/register', payload);
  tokenStorage.set(data.token.access_token);
  return data;
}

export function logout(): void {
  tokenStorage.clear();
}

// ---------------------------------------------------------------------------
// AISRI  — GET /api/aisri/latest
// ---------------------------------------------------------------------------
export async function fetchAISRI(): Promise<AISRIData> {
  const { data } = await api.get<{
    score: number;
    status: string;
    breakdown: Record<string, number>;
  }>('/api/aisri/latest');

  // Map the backend shape to the frontend AISRIData type
  return {
    score: data.score,
    status: data.status as AISRIData['status'],
    pillars: Object.entries(data.breakdown ?? {}).map(([name, score]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      score: Math.round(score),
    })),
  };
}

// POST /api/aisri/calculate
export async function calculateAISRI(input: {
  hrv: number;
  sleep: number;
  load: number;
  fatigue: number;
  mood: number;
}): Promise<AISRIData> {
  const { data } = await api.post('/api/aisri/calculate', input);
  return {
    score: data.score,
    status: data.status as AISRIData['status'],
    pillars: Object.entries(data.breakdown ?? {}).map(([name, score]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      score: Math.round(score as number),
    })),
  };
}

// ---------------------------------------------------------------------------
// Workouts  — GET /api/workouts  |  POST /api/workouts
// ---------------------------------------------------------------------------
export async function fetchWorkouts(): Promise<Workout[]> {
  const { data } = await api.get<Workout[]>('/api/workouts');
  return data;
}

export async function createWorkout(
  payload: Omit<Workout, 'id'>,
): Promise<Workout> {
  const { data } = await api.post<Workout>('/api/workouts', payload);
  return data;
}

// ---------------------------------------------------------------------------
// Biomechanics  — POST /api/biomechanics/analyze
// ---------------------------------------------------------------------------
export async function analyzeBiomechanics(
  input: BiomechanicsInput,
): Promise<BiomechanicsData> {
  const { data } = await api.post<{
    overallScore: number;
    issues: { type: string; severity: string; message: string }[];
    recommendations: { priority: string; message: string }[];
  }>('/api/biomechanics/analyze', {
    cadence: input.cadence,
    strideLength: input.strideLength,
    verticalOscillation: input.verticalOscillation,
    groundContactTime: input.groundContactTime,
    balance: 90, // default when not provided by the page
  });

  // Map backend shape → frontend BiomechanicsData shape
  const metricMap: { key: keyof BiomechanicsInput; unit: string; label: string }[] = [
    { key: 'cadence', unit: 'spm', label: 'Cadence' },
    { key: 'strideLength', unit: 'm', label: 'Stride Length' },
    { key: 'groundContactTime', unit: 'ms', label: 'Ground Contact' },
    { key: 'verticalOscillation', unit: 'cm', label: 'Vertical Oscillation' },
  ];

  const issueTypes = new Set(data.issues.map((i) => i.type));

  const insights = metricMap.map(({ key, unit, label }) => {
    const value = input[key];
    let status: 'good' | 'warning' | 'critical' = 'good';

    if (
      (key === 'cadence' && issueTypes.has('low_cadence')) ||
      (key === 'verticalOscillation' && issueTypes.has('high_oscillation'))
    ) {
      status = 'warning';
    }

    const rec = data.recommendations.find(
      (r) =>
        (key === 'cadence' && r.message.toLowerCase().includes('cadence')) ||
        (key === 'verticalOscillation' && r.message.toLowerCase().includes('oscillation')) ||
        (key === 'strideLength' && r.message.toLowerCase().includes('stride')),
    );

    return {
      metric: label,
      value: Math.round(value * 10) / 10,
      unit,
      status,
      recommendation: rec?.message ?? 'Maintain current form.',
    };
  });

  return { overallScore: data.overallScore, insights };
}
