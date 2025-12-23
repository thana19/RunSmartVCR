export enum TestDuration {
  MIN_30 = 30,
  MIN_60 = 60,
}

export interface TrainingZone {
  name: string;
  description: string;
  minPace: number; // seconds per km
  maxPace: number; // seconds per km
  color: string;
}

export interface CalculationResult {
  distance: number;
  duration: TestDuration;
  averagePace: number; // seconds per km
  thresholdPace: number; // seconds per km (T-Pace)
  vo2MaxEstimate: number;
  zones: TrainingZone[];
}

export interface CoachResponse {
  advice: string;
  loading: boolean;
  error?: string;
}