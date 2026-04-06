import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, TrendingUp, Award, Droplet, Sun, Activity, Heart, Shield, Calendar } from 'lucide-react';
import { useHealthStore } from '../store/healthStore';
import { getRecommendations, getHealthPredictions, analyzeBloodWork, detectConditions } from '../utils/healthAnalysis';
import type { HealthRecommendation, HealthPrediction } from '../types/health';

const DEMO_PARAMS: Record<string, number> = {
  hemoglobin: 10.5, alt: 62, glucose: 112, ldl: 145, vitaminD: 18,
  totalCholesterol: 225, ferritin: 9, vitaminB12: 185,
};

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  AlertTriangle, Droplet, Sun, Activity, Heart, Shield, Calendar, TrendingUp, Award,
};

const categoryConfig = {
  critical: { label: 'Critical Alerts', icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)' },
  warning: { label: 'Warnings', icon: AlertCircle, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)' },
  optimization: { label: 'Optimizations', icon: TrendingUp, color: '#06b6d4', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.25)' },
  achievement: { label: 'Achievements', icon: Award, color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)' },
};

function RecommendationCard({ rec, index }: { rec: HealthRecommendation; index: number }) {
  const cat = categoryConfig[rec.category];
  const CatIcon = cat.icon;
  const RecIcon = iconMap[rec.icon] || Activity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-5 rounded-2xl"
      style={{ background: cat.bg, border: `1px solid ${cat.border}` }}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${cat.color}20` }}>
          <RecIcon size={20} color={cat.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-semibold text-sm" style={{ color: '#f1f5f9' }}>{rec.title}</h3>
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium" style={{ color: cat.color, background: `${cat.color}20` }}>
              <CatIcon size={10} /> {cat.label}
            </span>
          </div>
          <p className="text-xs leading-relaxed mb-3" style={{ color: '#94a3b8' }}>{rec.description}</p>
          {rec.actionSteps.length > 0 && (
            <ul className="space-y-1">
              {rec.actionSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-xs" style={{ color: '#64748b' }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: cat.color }} />
                  {step}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function PredictionBar({ prediction, index }: { prediction: HealthPrediction; index: number }) {
  const riskColors = { low: '#10b981', moderate: '#f59e0b', high: '#ef4444' };
  const color = riskColors[prediction.riskLevel];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="mb-4"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium" style={{ color: '#e2e8f0' }}>{prediction.condition}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize" style={{ color, background: `${color}20` }}>
            {prediction.riskLevel} risk
          </span>
          <span className="text-sm font-bold" style={{ color }}>{prediction.riskScore}%</span>
        </div>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${prediction.riskScore}%` }}
          transition={{ duration: 0.8, delay: index * 0.06 + 0.3, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}90, ${color})` }}
        />
      </div>
      <p className="text-xs mt-1" style={{ color: '#475569' }}>{prediction.description}</p>
    </motion.div>
  );
}

export default function HealthInsights() {
  const { results: storeResults, recommendations: storeRecs, hasAnalysis } = useHealthStore();

  const { recommendations, predictions } = useMemo(() => {
    if (hasAnalysis && storeResults.length > 0) {
      return {
        recommendations: storeRecs.length > 0 ? storeRecs : getRecommendations(storeResults),
        predictions: getHealthPredictions(storeResults),
      };
    }
    const demoResults = analyzeBloodWork(DEMO_PARAMS);
    return {
      recommendations: getRecommendations(demoResults),
      predictions: getHealthPredictions(demoResults),
    };
  }, [hasAnalysis, storeResults, storeRecs]);

  // Separate recommendations by category
  const grouped = useMemo(() => {
    const g: Record<string, HealthRecommendation[]> = { critical: [], warning: [], optimization: [], achievement: [] };
    recommendations.forEach(r => { g[r.category]?.push(r); });
    return g;
  }, [recommendations]);

  // Detect conditions for supplement summary
  const conditions = useMemo(() => {
    if (hasAnalysis && storeResults.length > 0) return detectConditions(storeResults);
    return detectConditions(analyzeBloodWork(DEMO_PARAMS));
  }, [hasAnalysis, storeResults]);

  const supplementRecommendations = [
    ...(conditions.some(c => c.name.includes('Anemia') || c.name.includes('Iron')) ? [{ name: 'Ferrous Sulfate', dosage: '325mg once daily with vitamin C', reason: 'Iron deficiency', color: '#ef4444' }] : []),
    ...(conditions.some(c => c.name.includes('Vitamin D')) ? [{ name: 'Vitamin D3', dosage: '2000–5000 IU daily with meal', reason: 'Vitamin D deficiency', color: '#f59e0b' }] : []),
    ...(conditions.some(c => c.name.includes('B12')) ? [{ name: 'Methylcobalamin (B12)', dosage: '1000mcg daily sublingual', reason: 'B12 deficiency', color: '#8b5cf6' }] : []),
    ...(conditions.some(c => c.name.includes('Cardiovascular') || c.name.includes('Dyslipidemia')) ? [{ name: 'Omega-3 Fish Oil', dosage: '1000mg EPA+DHA twice daily', reason: 'Cardiovascular support', color: '#06b6d4' }] : []),
    { name: 'Magnesium Glycinate', dosage: '300–400mg before bed', reason: 'General health optimization', color: '#10b981' },
  ];

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-4" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', color: '#8b5cf6' }}>
            <Activity size={12} /> AI Health Intelligence
          </div>
          <h1 className="text-4xl font-bold mb-2">
            <span style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Personalized Health Insights
            </span>
          </h1>
          <p style={{ color: '#64748b' }}>
            {hasAnalysis ? 'Based on your blood work analysis' : 'Demo insights — run analysis for personalized recommendations'}
          </p>
        </motion.div>

        {/* Recommendations by Category */}
        {(['critical', 'warning', 'optimization', 'achievement'] as const).map((cat) => {
          const items = grouped[cat];
          if (!items || items.length === 0) return null;
          const cfg = categoryConfig[cat];
          const CatIcon = cfg.icon;
          return (
            <motion.section key={cat} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${cfg.color}20` }}>
                  <CatIcon size={16} color={cfg.color} />
                </div>
                <h2 className="text-lg font-semibold" style={{ color: cfg.color }}>{cfg.label}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${cfg.color}15`, color: cfg.color }}>{items.length}</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {items.map((rec, i) => (
                  <RecommendationCard key={rec.title} rec={rec} index={i} />
                ))}
              </div>
            </motion.section>
          );
        })}

        {/* Supplement Recommendations */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-10">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span style={{ color: '#06b6d4' }}>💊</span>
            <span style={{ color: '#f1f5f9' }}>Supplement Protocol</span>
          </h2>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            {supplementRecommendations.map((supp, i) => (
              <div
                key={supp.name}
                className="flex items-center justify-between px-5 py-4"
                style={{
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.015)',
                  borderBottom: i < supplementRecommendations.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: supp.color }} />
                  <div>
                    <span className="text-sm font-medium" style={{ color: '#f1f5f9' }}>{supp.name}</span>
                    <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{supp.reason}</p>
                  </div>
                </div>
                <span className="text-xs text-right ml-4" style={{ color: '#64748b' }}>{supp.dosage}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Health Predictions */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-10">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <span style={{ color: '#8b5cf6' }}>🔮</span>
            <span style={{ color: '#f1f5f9' }}>Health Risk Predictions</span>
          </h2>
          <p className="text-sm mb-5" style={{ color: '#475569' }}>Estimated risk scores based on your current biomarker profile</p>
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {predictions.map((pred, i) => (
              <PredictionBar key={pred.condition} prediction={pred} index={i} />
            ))}
          </div>
        </motion.section>

        {/* Dietary & Lifestyle Recommendations */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="p-6 rounded-2xl" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#10b981' }}>
              🥗 Dietary Recommendations
            </h3>
            <ul className="space-y-2">
              {[
                'Increase leafy greens (spinach, kale) for iron & folate',
                'Eat fatty fish 3× per week for omega-3 & vitamin D',
                'Add legumes, lentils, and beans for plant-based protein',
                'Reduce processed foods and refined carbohydrates',
                'Hydrate with 8–10 glasses of water daily',
                'Include turmeric + black pepper for liver support',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#94a3b8' }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#10b981' }} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="p-6 rounded-2xl" style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)' }}>
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#06b6d4' }}>
              🏃 Lifestyle Recommendations
            </h3>
            <ul className="space-y-2">
              {[
                'Exercise 150 min/week (brisk walk, cycling, swimming)',
                'Aim for 7–9 hours of quality sleep nightly',
                'Manage stress with meditation or breathing exercises',
                'Get 15–20 min of sunlight exposure daily',
                'Limit alcohol to ≤1 drink/day (women) or ≤2 (men)',
                'Schedule regular health check-ups every 6–12 months',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#94a3b8' }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#06b6d4' }} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Doctor Visit Recommendations */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span style={{ color: '#8b5cf6' }}>👨‍⚕️</span>
            <span style={{ color: '#f1f5f9' }}>Specialist Referrals</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              ...(conditions.some(c => c.name.includes('Anemia')) ? [{ specialty: 'Hematologist', reason: 'Iron deficiency anemia evaluation', urgency: 'Within 2 weeks', color: '#ef4444' }] : []),
              ...(conditions.some(c => c.name.includes('Diabetes') || c.name.includes('Pre-diabetes')) ? [{ specialty: 'Endocrinologist', reason: 'Blood sugar management', urgency: 'Within 1 week', color: '#f59e0b' }] : []),
              ...(conditions.some(c => c.name.includes('Cardiovascular') || c.name.includes('Dyslipidemia')) ? [{ specialty: 'Cardiologist', reason: 'Lipid management & CVD risk assessment', urgency: 'Within 1 month', color: '#06b6d4' }] : []),
              ...(conditions.some(c => c.name.includes('Kidney') || c.name.includes('Renal')) ? [{ specialty: 'Nephrologist', reason: 'Kidney function evaluation', urgency: 'Within 2 weeks', color: '#8b5cf6' }] : []),
              ...(conditions.some(c => c.name.includes('Hepatic') || c.name.includes('Liver')) ? [{ specialty: 'Hepatologist / Gastroenterologist', reason: 'Liver enzyme elevation assessment', urgency: 'Within 2 weeks', color: '#f59e0b' }] : []),
              { specialty: 'Primary Care Physician', reason: 'Annual wellness review and follow-up', urgency: 'Within 3 months', color: '#10b981' },
            ].map((ref) => (
              <div key={ref.specialty} className="p-4 rounded-xl" style={{ background: `${ref.color}0a`, border: `1px solid ${ref.color}25` }}>
                <div className="font-semibold text-sm mb-1" style={{ color: '#f1f5f9' }}>{ref.specialty}</div>
                <p className="text-xs mb-2" style={{ color: '#64748b' }}>{ref.reason}</p>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ color: ref.color, background: `${ref.color}20` }}>
                  🕐 {ref.urgency}
                </span>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
