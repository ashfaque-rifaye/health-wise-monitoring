export interface BloodParameter {
  name: string;
  value: number | null;
  unit: string;
  normalMin: number;
  normalMax: number;
  category: string;
}

export interface HealthProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  country: string;
  bloodType: string;
  parameters: Record<string, number>;
}

export type HealthStatus = 'normal' | 'borderline' | 'abnormal' | 'critical';

export interface AnalysisResult {
  parameter: string;
  value: number;
  unit: string;
  status: HealthStatus;
  normalRange: string;
  recommendation: string;
}

export interface DetectedCondition {
  name: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  affectedParameters: string[];
}

export interface HealthRecommendation {
  category: 'critical' | 'warning' | 'optimization' | 'achievement';
  title: string;
  description: string;
  actionSteps: string[];
  icon: string;
}

export interface Hospital {
  id: string;
  name: string;
  type: string;
  distance: string;
  rating: number;
  address: string;
  phone: string;
  specialties: string[];
  availability: string;
  country: string;
}

export interface HealthDimension {
  name: string;
  score: number;
  fullMark: number;
}

export interface HealthPrediction {
  condition: string;
  riskScore: number;
  riskLevel: 'low' | 'moderate' | 'high';
  description: string;
}
