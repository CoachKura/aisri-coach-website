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
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

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
// AISRI
// ---------------------------------------------------------------------------
export async function fetchAISRI(): Promise<AISRIData> {
  const { data } = await api.get<{
    score: number;
    status: string;
    breakdown: Record<string, number>;
  }>('/api/aisri/latest');

  return {
    score: data.score,
    status: data.status as AISRIData['status'],
    pillars: Object.entries(data.breakdown ?? {}).map(([name, score]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      score: Math.round(score),
    })),
  };
}

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

// New: daily check-in payload (raw, server interprets)
export interface CheckinPayload {
  sleep_hours: number;
  fatigue: number;
  mood: number;
  injury: boolean;
}

export async function submitCheckin(payload: CheckinPayload): Promise<AISRIData> {
  // Map UI fields -> backend DTO (CalculateAisriDto expects: hrv, sleep, load, fatigue 1-10, mood 1-10)
  const sleepHours = Math.max(4, Math.min(10, payload.sleep_hours));
  const sleep = Math.round(((sleepHours - 4) / 6) * 100);
  const fatigue = Math.max(1, Math.min(10, Math.round(payload.fatigue * 2)));
  const mood = Math.max(1, Math.min(10, Math.round(payload.mood * 2)));
  const hrv = 65;
  const load = payload.injury ? 75 : 50;

  const dto = { hrv, sleep, load, fatigue, mood };
  const { data } = await api.post('/api/aisri/calculate', dto);
  return {
    score: (data?.score as number) ?? 0,
    status: (data?.status as AISRIData['status']) ?? 'moderate',
    pillars: Array.isArray(data?.pillars) ? data.pillars : [],
  };
}
// ---------------------------------------------------------------------------
// Workouts
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

export interface WorkoutStats {
  totalKm: number;
  sessions: number;
  calories: number;
  perDay?: number[]; // 0..6 distance per day (most recent last)
}

export async function fetchWorkoutStats(days: number = 7): Promise<WorkoutStats> {
  try {
    const { data } = await api.get<Partial<WorkoutStats> & Record<string, unknown>>(
      `/api/workouts/stats?days=${days}`,
    );
    return {
      totalKm: Math.round(((data.totalKm as number) ?? 0) * 10) / 10,
      sessions: (data.sessions as number) ?? 0,
      calories: Math.round((data.calories as number) ?? 0),
      perDay: (data.perDay as number[]) ?? undefined,
    };
  } catch {
    // Derive locally from /workouts list as a soft fallback
    try {
      const list = await fetchWorkouts();
      const totalMinutes = list.reduce((s, w) => s + (w.duration ?? 0), 0);
      return {
        totalKm: Math.round(totalMinutes / 6) / 10, // very rough fallback
        sessions: list.length,
        calories: Math.round(totalMinutes * 9),
        perDay: undefined,
      };
    } catch {
      return { totalKm: 0, sessions: 0, calories: 0 };
    }
  }
}

// ---------------------------------------------------------------------------
// Biomechanics
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
    balance: 90,
  });

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

// ---------------------------------------------------------------------------
// Coach chat
// ---------------------------------------------------------------------------
export interface CoachMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendCoachMessage(
  message: string,
  history: CoachMessage[] = [],
): Promise<string> {
  try {
    const { data } = await api.post<{ reply?: string; message?: string; content?: string }>(
      '/api/voice-coach',
      { message, history },
    );
    return data.reply || data.message || data.content || "I'm here. Tell me more.";
  } catch {
    return "I'm warming up — try again in a moment 🏃";
  }
}