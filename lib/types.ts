export type TrainingStatus = 'recovery' | 'moderate' | 'ready';

export interface AISRIPillar {
  name: string;
  score: number;
}

export interface AISRIData {
  score: number;
  status: TrainingStatus;
  pillars: AISRIPillar[];
}

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: string;
}

export interface Workout {
  id: string;
  title: string;
  type: string;
  duration: number; // minutes
  difficulty: 'easy' | 'moderate' | 'hard';
  exercises: Exercise[];
}

export type BiomechanicsStatus = 'good' | 'warning' | 'critical';

export interface BiomechanicsInsight {
  metric: string;
  value: number;
  unit: string;
  status: BiomechanicsStatus;
  recommendation: string;
}

export interface BiomechanicsData {
  overallScore: number;
  insights: BiomechanicsInsight[];
}

export interface BiomechanicsInput {
  cadence: number;
  strideLength: number;
  groundContactTime: number;
  verticalOscillation: number;
}
