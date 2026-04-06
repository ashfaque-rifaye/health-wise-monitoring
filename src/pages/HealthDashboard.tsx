import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, RadialBarChart, RadialBar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Activity, Shield, AlertTriangle, TrendingUp } from 'lucide-react';
import OrganModel from '../components/OrganModel';
import { useHealthStore } from '../store/healthStore';
import { getHealthDimensions, calculateHealthScore } from '../utils/healthAnalysis';

import type { AnalysisResult } from '../types/health';

const DEMO_RESULTS: AnalysisResult[] = [
  { parameter: 'Hemoglobin', value: 10.5, unit: 'g/dL', status: 'abnormal', normalRange: '12.0 – 17.5 g/dL', recommendation: 'Low hemoglobin – possible anemia.' },
  { parameter: 'ALT (Liver Enzyme)', value: 62, unit: 'U/L', status: 'borderline', normalRange: '7 – 40 U/L', recommendation: 'Elevated liver enzyme.' },
  { parameter: 'Fasting Glucose', value: 112, unit: 'mg/dL', status: 'borderline', normalRange: '70 – 100 mg/dL', recommendation: 'Pre-diabetes range.' },
  { parameter: 'LDL Cholesterol', value: 145, unit: 'mg/dL', status: 'abnormal', normalRange: '0 – 100 mg/dL', recommendation: 'High LDL.' },
  { parameter: 'Vitamin D (25-OH)', value: 18, unit: 'ng/mL', status: 'abnormal', normalRange: '30 – 80 ng/mL', recommendation: 'Vitamin D deficiency.' },
  { parameter: 'Creatinine', value: 1.1, unit: 'mg/dL', status: 'normal', normalRange: '0.6 – 1.2 mg/dL', recommendation: 'Normal.' },
  { parameter: 'TSH', value: 3.2, unit: 'mIU/L', status: 'normal', normalRange: '0.4 – 4.0 mIU/L', recommendation: 'Normal.' },
  { parameter: 'Total Cholesterol', value: 225, unit: 'mg/dL', status: 'borderline', normalRange: '0 – 200 mg/dL', recommendation: 'High cholesterol.' },
];

const trendData = [
  { month: 'Jan', score: 68 }, { month: 'Feb', score: 72 }, { month: 'Mar', score: 70 },
  { month: 'Apr', score: 75 }, { month: 'May', score: 73 }, { month: 'Jun', score: 78 },
];

function ScoreGauge({ score }: { score: number }) {
  const data = [{ name: 'score', value: score, fill: score > 75 ? '#10b981' : score > 50 ? '#f59e0b' : '#ef4444' }];
  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="55%" innerRadius="60%" outerRadius="85%" startAngle={180} endAngle={0} data={data}>
          <RadialBar dataKey="value" cornerRadius={8} background={{ fill: 'rgba(255,255,255,0.05)' }} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center mt-8">
        <span className="text-4xl font-bold" style={{ color: score > 75 ? '#10b981' : score > 50 ? '#f59e0b' : '#ef4444' }}>{score}</span>
        <span className="text-xs" style={{ color: '#64748b' }}>/ 100</span>
        <span className="text-sm font-medium mt-1" style={{ color: score > 75 ? '#10b981' : score > 50 ? '#f59e0b' : '#ef4444' }}>
          {score > 75 ? 'Good' : score > 50 ? 'Fair' : 'Needs Attention'}
        </span>
      </div>
    </div>
  );
}

function getOrganStatuses(results: AnalysisResult[]) {
  const find = (keyword: string) => results.find(r => r.parameter.toLowerCase().includes(keyword.toLowerCase()));
  const toStatus = (r: AnalysisResult | undefined) => {
    if (!r) return 'normal' as const;
    if (r.status === 'critical' || r.status === 'abnormal') return 'critical' as const;
    if (r.status === 'borderline') return 'warning' as const;
    return 'normal' as const;
  };
  return {
    heart: toStatus(find('cholesterol') || find('LDL')),
    liver: toStatus(find('ALT') || find('AST') || find('bilirubin')),
    kidneys: toStatus(find('Creatinine') || find('eGFR') || find('BUN')),
    lungs: 'normal' as const,
    brain: toStatus(find('B12') || find('Thyroid') || find('TSH')),
  };
}

export default function HealthDashboard() {
  const { results: storeResults, healthScore: storeScore, hasAnalysis, profile } = useHealthStore();
  const results = hasAnalysis ? storeResults : DEMO_RESULTS;
  const healthScore = hasAnalysis ? storeScore : calculateHealthScore(DEMO_RESULTS);
  const dimensions = useMemo(() => getHealthDimensions(results), [results]);
  const organStatuses = useMemo(() => getOrganStatuses(results), [results]);

  const abnormalCount = results.filter(r => r.status === 'abnormal' || r.status === 'critical').length;
  const borderlineCount = results.filter(r => r.status === 'borderline').length;

  const statCards = [
    { label: 'Health Score', value: `${healthScore}`, unit: '/100', color: healthScore > 75 ? '#10b981' : healthScore > 50 ? '#f59e0b' : '#ef4444', icon: Activity },
    { label: 'Risk Level', value: abnormalCount > 3 ? 'High' : abnormalCount > 0 ? 'Moderate' : 'Low', unit: '', color: abnormalCount > 3 ? '#ef4444' : abnormalCount > 0 ? '#f59e0b' : '#10b981', icon: Shield },
    { label: 'Parameters', value: `${results.length}`, unit: 'checked', color: '#06b6d4', icon: TrendingUp },
    { label: 'Issues Found', value: `${abnormalCount + borderlineCount}`, unit: 'flagged', color: abnormalCount > 0 ? '#f59e0b' : '#10b981', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-2" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: '#06b6d4' }}>
              <Activity size={11} /> Live Health Monitor
            </div>
            <h1 className="text-3xl font-bold">
              <span style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {profile ? `${profile.name}'s Dashboard` : 'Health Dashboard'}
              </span>
            </h1>
            {!hasAnalysis && <p className="text-sm mt-1" style={{ color: '#64748b' }}>Showing demo data — run analysis for personalized results</p>}
          </div>
        </motion.div>

        {/* Stat Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, unit, color, icon: Icon }, i) => (
            <motion.div key={label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.06 }} className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}22` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                  <Icon size={18} color={color} />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold" style={{ color }}>{value}</span>
                {unit && <span className="text-xs" style={{ color: '#475569' }}>{unit}</span>}
              </div>
              <p className="text-xs mt-1" style={{ color: '#64748b' }}>{label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* 3D Organ Model */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1 rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="p-4 pb-0">
              <h3 className="text-sm font-semibold" style={{ color: '#94a3b8' }}>3D Organ Status</h3>
              <div className="flex flex-wrap gap-3 mt-2 text-xs">
                {[['#10b981', 'Healthy'], ['#f59e0b', 'Warning'], ['#ef4444', 'Critical']].map(([color, label]) => (
                  <div key={label} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <span style={{ color: '#64748b' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <OrganModel statuses={organStatuses} height="380px" />
          </motion.div>

          {/* Score + Radar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 grid gap-6">
            {/* Score Gauge */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 className="text-sm font-semibold mb-2" style={{ color: '#94a3b8' }}>Overall Health Score</h3>
              <ScoreGauge score={healthScore} />
            </div>

            {/* Radar */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: '#94a3b8' }}>Health Dimensions</h3>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={dimensions}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Radar name="Score" dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trend Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#94a3b8' }}>Health Score Trend (6 Months)</h3>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} />
                <YAxis domain={[40, 100]} tick={{ fill: '#475569', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }} />
                <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Parameter Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-2xl p-6 mt-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#94a3b8' }}>Parameter Overview</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {results.map((r) => {
              const statusColors: Record<string, string> = { normal: '#10b981', borderline: '#f59e0b', abnormal: '#ef4444', critical: '#dc2626' };
              const c = statusColors[r.status];
              return (
                <div key={r.parameter} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: `${c}0d`, border: `1px solid ${c}22` }}>
                  <span className="text-sm" style={{ color: '#e2e8f0' }}>{r.parameter}</span>
                  <div className="text-right">
                    <span className="text-sm font-bold" style={{ color: c }}>{r.value}</span>
                    <span className="text-xs ml-1" style={{ color: '#475569' }}>{r.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
