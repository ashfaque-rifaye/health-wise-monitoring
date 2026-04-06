import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AnalysisResult, HealthProfile, DetectedCondition, HealthRecommendation } from '../types/health';

interface HealthState {
  profile: HealthProfile | null;
  results: AnalysisResult[];
  conditions: DetectedCondition[];
  recommendations: HealthRecommendation[];
  healthScore: number;
  hasAnalysis: boolean;
  setProfile: (profile: HealthProfile) => void;
  setAnalysisData: (results: AnalysisResult[], conditions: DetectedCondition[], recommendations: HealthRecommendation[], score: number) => void;
  clearAnalysis: () => void;
}

const HealthContext = createContext<HealthState | null>(null);

export function HealthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<HealthProfile | null>(null);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [conditions, setConditions] = useState<DetectedCondition[]>([]);
  const [recommendations, setRecommendations] = useState<HealthRecommendation[]>([]);
  const [healthScore, setHealthScore] = useState<number>(0);
  const [hasAnalysis, setHasAnalysis] = useState<boolean>(false);

  const setProfile = (p: HealthProfile) => setProfileState(p);

  const setAnalysisData = (
    r: AnalysisResult[],
    c: DetectedCondition[],
    rec: HealthRecommendation[],
    score: number
  ) => {
    setResults(r);
    setConditions(c);
    setRecommendations(rec);
    setHealthScore(score);
    setHasAnalysis(true);
  };

  const clearAnalysis = () => {
    setProfileState(null);
    setResults([]);
    setConditions([]);
    setRecommendations([]);
    setHealthScore(0);
    setHasAnalysis(false);
  };

  return (
    <HealthContext.Provider value={{ profile, results, conditions, recommendations, healthScore, hasAnalysis, setProfile, setAnalysisData, clearAnalysis }}>
      {children}
    </HealthContext.Provider>
  );
}

export function useHealthStore(): HealthState {
  const ctx = useContext(HealthContext);
  if (!ctx) throw new Error('useHealthStore must be used within HealthProvider');
  return ctx;
}
