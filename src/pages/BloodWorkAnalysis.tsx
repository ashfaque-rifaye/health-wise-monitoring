import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, FlaskConical, User, Activity, CheckCircle2, AlertCircle, AlertTriangle, XCircle } from 'lucide-react';
import { PARAMETER_RANGES, analyzeBloodWork, calculateHealthScore, detectConditions, getRecommendations } from '../utils/healthAnalysis';
import { useHealthStore } from '../store/healthStore';
import type { HealthProfile } from '../types/health';

const STEPS = ['Personal Info', 'Blood Parameters', 'Analysis Results'];

const COUNTRIES: [string, string][] = [
  ['US', 'United States'], ['GB', 'United Kingdom'], ['IN', 'India'],
  ['AU', 'Australia'], ['DE', 'Germany'], ['CA', 'Canada'],
  ['FR', 'France'], ['BR', 'Brazil'], ['JP', 'Japan'], ['OTHER', 'Other'],
];

interface PersonalInfo {
  name: string;
  age: string;
  gender: 'male' | 'female' | 'other';
  country: string;
  bloodType: string;
}

const PARAM_GROUPS = [
  {
    label: 'Complete Blood Count (CBC)',
    keys: ['wbc', 'rbc', 'hemoglobin', 'hematocrit', 'platelets'],
  },
  {
    label: 'Metabolic Panel',
    keys: ['glucose', 'bun', 'creatinine', 'egfr', 'alt', 'ast', 'alp', 'bilirubin'],
  },
  {
    label: 'Lipid Panel',
    keys: ['totalCholesterol', 'ldl', 'hdl', 'triglycerides'],
  },
  {
    label: 'Thyroid Function',
    keys: ['tsh', 't3', 't4'],
  },
  {
    label: 'Vitamins & Minerals',
    keys: ['vitaminB12', 'vitaminD', 'ferritin', 'iron'],
  },
];

const statusConfig = {
  normal: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', icon: CheckCircle2, label: 'Normal' },
  borderline: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', icon: AlertCircle, label: 'Borderline' },
  abnormal: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', icon: AlertTriangle, label: 'Abnormal' },
  critical: { color: '#dc2626', bg: 'rgba(220,38,38,0.15)', border: 'rgba(220,38,38,0.5)', icon: XCircle, label: 'Critical' },
};

const severityConfig = {
  low: { color: '#10b981', label: 'Low Risk' },
  medium: { color: '#f59e0b', label: 'Medium Risk' },
  high: { color: '#ef4444', label: 'High Risk' },
};

export default function BloodWorkAnalysis() {
  const navigate = useNavigate();
  const { setProfile, setAnalysisData } = useHealthStore();
  const [step, setStep] = useState(0);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '', age: '', gender: 'male', country: 'US', bloodType: 'O+',
  });
  const [params, setParams] = useState<Record<string, string>>({});

  const handlePersonalChange = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleParamChange = (key: string, value: string) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const filledParams = Object.entries(params).filter(([, v]) => v !== '' && !isNaN(parseFloat(v)));

  const runAnalysis = () => {
    const numericParams: Record<string, number> = {};
    filledParams.forEach(([k, v]) => { numericParams[k] = parseFloat(v); });

    const profile: HealthProfile = {
      name: personalInfo.name || 'Patient',
      age: parseInt(personalInfo.age) || 30,
      gender: personalInfo.gender,
      country: personalInfo.country,
      bloodType: personalInfo.bloodType,
      parameters: numericParams,
    };
    setProfile(profile);

    const results = analyzeBloodWork(numericParams);
    const score = calculateHealthScore(results);
    const conditions = detectConditions(results);
    const recommendations = getRecommendations(results);
    setAnalysisData(results, conditions, recommendations, score);
    setStep(2);
  };

  const { results } = useHealthStore();

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-4" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: '#06b6d4' }}>
            <FlaskConical size={12} /> Blood Work Analysis Engine
          </div>
          <h1 className="text-4xl font-bold mb-2">
            <span style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Analyze Your Blood Work
            </span>
          </h1>
          <p style={{ color: '#64748b' }}>Enter your lab results for comprehensive AI-powered health analysis</p>
        </motion.div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10 gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                  style={{
                    background: i <= step ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)' : 'rgba(255,255,255,0.06)',
                    border: i === step ? '2px solid #06b6d4' : '1px solid rgba(255,255,255,0.1)',
                    color: i <= step ? 'white' : '#475569',
                    boxShadow: i === step ? '0 0 16px rgba(6,182,212,0.4)' : 'none',
                  }}
                >
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="text-sm font-medium hidden sm:block" style={{ color: i === step ? '#06b6d4' : '#475569' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className="w-12 h-px" style={{ background: i < step ? '#06b6d4' : 'rgba(255,255,255,0.08)' }} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Personal Info */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-3 mb-6">
                <User size={20} color="#06b6d4" />
                <h2 className="text-xl font-semibold">Personal Information</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                {[
                  { label: 'Full Name', field: 'name', type: 'text', placeholder: 'Enter your name' },
                  { label: 'Age', field: 'age', type: 'number', placeholder: 'e.g. 35' },
                ].map(({ label, field, type, placeholder }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={personalInfo[field as keyof PersonalInfo]}
                      onChange={(e) => handlePersonalChange(field as keyof PersonalInfo, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-white transition-all duration-200 outline-none"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }}
                      onFocus={(e) => { e.target.style.borderColor = '#06b6d4'; e.target.style.boxShadow = '0 0 12px rgba(6,182,212,0.2)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>Gender</label>
                  <select
                    value={personalInfo.gender}
                    onChange={(e) => handlePersonalChange('gender', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }}
                  >
                    <option value="male" style={{ background: '#1e293b' }}>Male</option>
                    <option value="female" style={{ background: '#1e293b' }}>Female</option>
                    <option value="other" style={{ background: '#1e293b' }}>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>Blood Type</label>
                  <select
                    value={personalInfo.bloodType}
                    onChange={(e) => handlePersonalChange('bloodType', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }}
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bt => (
                      <option key={bt} value={bt} style={{ background: '#1e293b' }}>{bt}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>Country</label>
                  <select
                    value={personalInfo.country}
                    onChange={(e) => handlePersonalChange('country', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }}
                  >
                    {COUNTRIES.map(([code, name]) => (
                      <option key={code} value={code} style={{ background: '#1e293b' }}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}
                >
                  Next: Blood Parameters <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 1: Blood Parameters */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="rounded-2xl p-6 mb-4" style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)' }}>
                <p className="text-sm" style={{ color: '#94a3b8' }}>
                  <span style={{ color: '#06b6d4', fontWeight: 600 }}>Tip:</span> Enter only the values you have from your lab report. Leave empty fields blank. All values should match the units shown.
                </p>
              </div>

              {PARAM_GROUPS.map((group) => (
                <div key={group.label} className="rounded-2xl p-6 mb-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: '#06b6d4' }}>
                    <Activity size={16} />
                    {group.label}
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.keys.map((key) => {
                      const range = PARAMETER_RANGES[key];
                      if (!range) return null;
                      return (
                        <div key={key}>
                          <label className="block text-xs font-medium mb-1" style={{ color: '#94a3b8' }}>
                            {range.description}
                            <span className="ml-1 font-normal" style={{ color: '#475569' }}>({range.unit})</span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            placeholder={`${range.normalMin}–${range.normalMax}`}
                            value={params[key] || ''}
                            onChange={(e) => handleParamChange(key, e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }}
                            onFocus={(e) => { e.target.style.borderColor = '#06b6d4'; }}
                            onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(0)} className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                  <ChevronLeft size={18} /> Back
                </button>
                <button
                  onClick={runAnalysis}
                  disabled={filledParams.length === 0}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', boxShadow: filledParams.length > 0 ? '0 0 20px rgba(6,182,212,0.3)' : 'none' }}
                >
                  <FlaskConical size={18} />
                  Analyze {filledParams.length > 0 ? `(${filledParams.length} values)` : ''}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Results */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="text-center mb-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <CheckCircle2 size={48} color="#10b981" className="mx-auto mb-3" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-1" style={{ color: '#f1f5f9' }}>Analysis Complete</h2>
                <p style={{ color: '#64748b' }}>
                  {results.length} parameters analyzed
                </p>
              </div>

              {/* Results Grid */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {results.map((result, i) => {
                  const cfg = statusConfig[result.status];
                  const StatusIcon = cfg.icon;
                  return (
                    <motion.div
                      key={result.parameter}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="p-4 rounded-xl"
                      style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-medium" style={{ color: '#f1f5f9' }}>{result.parameter}</span>
                        <div className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: cfg.color, background: `${cfg.color}20` }}>
                          <StatusIcon size={11} />
                          {cfg.label}
                        </div>
                      </div>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-2xl font-bold" style={{ color: cfg.color }}>{result.value}</span>
                        <span className="text-xs" style={{ color: '#64748b' }}>{result.unit}</span>
                      </div>
                      <div className="text-xs mb-2" style={{ color: '#475569' }}>Normal: {result.normalRange}</div>
                      {result.status !== 'normal' && (
                        <p className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>{result.recommendation}</p>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Detected Conditions */}
              {useHealthStore().conditions.length > 0 && (
                <div className="rounded-2xl p-6 mb-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#f59e0b' }}>⚠ Potential Conditions Detected</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {useHealthStore().conditions.map((cond) => {
                      const scfg = severityConfig[cond.severity];
                      return (
                        <div key={cond.name} className="p-4 rounded-xl" style={{ background: `${scfg.color}0f`, border: `1px solid ${scfg.color}33` }}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-sm" style={{ color: '#f1f5f9' }}>{cond.name}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ color: scfg.color, background: `${scfg.color}22` }}>{scfg.label}</span>
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>{cond.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex flex-wrap gap-4 justify-center mt-6">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                  <ChevronLeft size={18} /> Edit Parameters
                </button>
                <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}>
                  View 3D Dashboard <ChevronRight size={18} />
                </button>
                <button onClick={() => navigate('/insights')} className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
                  Health Insights <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
