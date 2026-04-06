import type { AnalysisResult, HealthStatus, DetectedCondition, HealthRecommendation, HealthDimension, HealthPrediction } from '../types/health';

interface ParameterRange {
  unit: string;
  normalMin: number;
  normalMax: number;
  borderlineMin?: number;
  borderlineMax?: number;
  criticalMin?: number;
  criticalMax?: number;
  category: string;
  description: string;
}

export const PARAMETER_RANGES: Record<string, ParameterRange> = {
  // CBC
  wbc: { unit: 'K/µL', normalMin: 4.5, normalMax: 11.0, criticalMin: 2.0, criticalMax: 30.0, borderlineMin: 3.5, borderlineMax: 12.5, category: 'CBC', description: 'White Blood Cells' },
  rbc: { unit: 'M/µL', normalMin: 4.2, normalMax: 5.8, criticalMin: 2.5, criticalMax: 7.0, borderlineMin: 3.8, borderlineMax: 6.2, category: 'CBC', description: 'Red Blood Cells' },
  hemoglobin: { unit: 'g/dL', normalMin: 12.0, normalMax: 17.5, criticalMin: 7.0, criticalMax: 20.0, borderlineMin: 10.0, borderlineMax: 18.5, category: 'CBC', description: 'Hemoglobin' },
  hematocrit: { unit: '%', normalMin: 36, normalMax: 52, criticalMin: 20, criticalMax: 65, borderlineMin: 30, borderlineMax: 56, category: 'CBC', description: 'Hematocrit' },
  platelets: { unit: 'K/µL', normalMin: 150, normalMax: 400, criticalMin: 50, criticalMax: 1000, borderlineMin: 100, borderlineMax: 450, category: 'CBC', description: 'Platelets' },
  // Metabolic Panel
  glucose: { unit: 'mg/dL', normalMin: 70, normalMax: 100, criticalMin: 40, criticalMax: 500, borderlineMin: 60, borderlineMax: 125, category: 'Metabolic', description: 'Fasting Glucose' },
  bun: { unit: 'mg/dL', normalMin: 7, normalMax: 20, criticalMin: 2, criticalMax: 100, borderlineMin: 5, borderlineMax: 25, category: 'Metabolic', description: 'Blood Urea Nitrogen' },
  creatinine: { unit: 'mg/dL', normalMin: 0.6, normalMax: 1.2, criticalMin: 0.3, criticalMax: 10.0, borderlineMin: 0.5, borderlineMax: 1.5, category: 'Metabolic', description: 'Creatinine' },
  egfr: { unit: 'mL/min/1.73m²', normalMin: 90, normalMax: 120, criticalMin: 15, criticalMax: 150, borderlineMin: 60, borderlineMax: 130, category: 'Metabolic', description: 'eGFR' },
  alt: { unit: 'U/L', normalMin: 7, normalMax: 40, criticalMin: 2, criticalMax: 500, borderlineMin: 5, borderlineMax: 55, category: 'Liver', description: 'ALT (Liver Enzyme)' },
  ast: { unit: 'U/L', normalMin: 10, normalMax: 40, criticalMin: 5, criticalMax: 500, borderlineMin: 8, borderlineMax: 55, category: 'Liver', description: 'AST (Liver Enzyme)' },
  alp: { unit: 'U/L', normalMin: 44, normalMax: 147, criticalMin: 20, criticalMax: 1000, borderlineMin: 35, borderlineMax: 160, category: 'Liver', description: 'Alkaline Phosphatase' },
  bilirubin: { unit: 'mg/dL', normalMin: 0.1, normalMax: 1.2, criticalMin: 0.0, criticalMax: 15.0, borderlineMin: 0.0, borderlineMax: 2.0, category: 'Liver', description: 'Total Bilirubin' },
  // Lipid Panel
  totalCholesterol: { unit: 'mg/dL', normalMin: 0, normalMax: 200, criticalMin: 0, criticalMax: 400, borderlineMin: 0, borderlineMax: 240, category: 'Lipid', description: 'Total Cholesterol' },
  ldl: { unit: 'mg/dL', normalMin: 0, normalMax: 100, criticalMin: 0, criticalMax: 300, borderlineMin: 0, borderlineMax: 130, category: 'Lipid', description: 'LDL Cholesterol' },
  hdl: { unit: 'mg/dL', normalMin: 40, normalMax: 90, criticalMin: 20, criticalMax: 120, borderlineMin: 35, borderlineMax: 100, category: 'Lipid', description: 'HDL Cholesterol' },
  triglycerides: { unit: 'mg/dL', normalMin: 0, normalMax: 150, criticalMin: 0, criticalMax: 1000, borderlineMin: 0, borderlineMax: 200, category: 'Lipid', description: 'Triglycerides' },
  // Thyroid
  tsh: { unit: 'mIU/L', normalMin: 0.4, normalMax: 4.0, criticalMin: 0.01, criticalMax: 20.0, borderlineMin: 0.3, borderlineMax: 5.0, category: 'Thyroid', description: 'TSH' },
  t3: { unit: 'ng/dL', normalMin: 80, normalMax: 200, criticalMin: 40, criticalMax: 400, borderlineMin: 70, borderlineMax: 220, category: 'Thyroid', description: 'T3 (Triiodothyronine)' },
  t4: { unit: 'µg/dL', normalMin: 5.0, normalMax: 12.0, criticalMin: 2.0, criticalMax: 25.0, borderlineMin: 4.0, borderlineMax: 13.0, category: 'Thyroid', description: 'T4 (Thyroxine)' },
  // Vitamins & Minerals
  vitaminB12: { unit: 'pg/mL', normalMin: 200, normalMax: 900, criticalMin: 100, criticalMax: 2000, borderlineMin: 150, borderlineMax: 1000, category: 'Vitamins', description: 'Vitamin B12' },
  vitaminD: { unit: 'ng/mL', normalMin: 30, normalMax: 80, criticalMin: 10, criticalMax: 150, borderlineMin: 20, borderlineMax: 100, category: 'Vitamins', description: 'Vitamin D (25-OH)' },
  ferritin: { unit: 'ng/mL', normalMin: 12, normalMax: 300, criticalMin: 5, criticalMax: 1000, borderlineMin: 10, borderlineMax: 350, category: 'Vitamins', description: 'Ferritin' },
  iron: { unit: 'µg/dL', normalMin: 60, normalMax: 170, criticalMin: 20, criticalMax: 300, borderlineMin: 45, borderlineMax: 185, category: 'Vitamins', description: 'Serum Iron' },
};

function getStatus(key: string, value: number): HealthStatus {
  const range = PARAMETER_RANGES[key];
  if (!range) return 'normal';
  const { normalMin, normalMax, criticalMin, criticalMax } = range;

  if (criticalMin !== undefined && value < criticalMin) return 'critical';
  if (criticalMax !== undefined && value > criticalMax) return 'critical';

  if (value < normalMin || value > normalMax) {
    const lowerBorderline = range.borderlineMin ?? normalMin * 0.85;
    const upperBorderline = range.borderlineMax ?? normalMax * 1.15;
    if (value < lowerBorderline || value > upperBorderline) return 'abnormal';
    return 'borderline';
  }
  return 'normal';
}

function getRecommendationText(key: string, status: HealthStatus, value: number): string {
  const range = PARAMETER_RANGES[key];
  if (!range || status === 'normal') return 'Value is within normal range. Maintain healthy lifestyle.';
  const low = value < range.normalMin;

  const recommendations: Record<string, { low: string; high: string }> = {
    wbc: { low: 'Low WBC may indicate immune suppression. Consult physician; avoid infections.', high: 'Elevated WBC may indicate infection or inflammation. Seek medical evaluation.' },
    rbc: { low: 'Low RBC suggests possible anemia. Increase iron-rich foods; consult doctor.', high: 'High RBC may indicate dehydration or polycythemia. Increase fluid intake; see doctor.' },
    hemoglobin: { low: 'Low hemoglobin indicates anemia. Increase iron, B12, folate intake. Consult physician.', high: 'High hemoglobin may indicate dehydration or lung disease. Consult physician.' },
    hematocrit: { low: 'Low hematocrit suggests anemia or blood loss. Medical evaluation needed.', high: 'High hematocrit may indicate dehydration. Increase water intake; consult doctor.' },
    platelets: { low: 'Low platelets (thrombocytopenia) increases bleeding risk. Urgent medical evaluation.', high: 'High platelets may increase clotting risk. Consult hematologist.' },
    glucose: { low: 'Low blood sugar (hypoglycemia). Eat regular meals; consult endocrinologist.', high: 'Elevated glucose may indicate pre-diabetes or diabetes. Reduce sugar/carbs; see endocrinologist.' },
    bun: { low: 'Low BUN may indicate liver issues or malnutrition. Increase protein intake.', high: 'High BUN may indicate kidney disease or dehydration. Increase water; see nephrologist.' },
    creatinine: { low: 'Low creatinine may indicate low muscle mass. Monitor and consult physician.', high: 'High creatinine indicates possible kidney dysfunction. Urgent nephrology referral needed.' },
    egfr: { low: 'Low eGFR indicates reduced kidney function. Immediate nephrology consultation required.', high: 'eGFR is within acceptable high range. Continue monitoring kidney health.' },
    alt: { low: 'Very low ALT is generally not concerning.', high: 'Elevated ALT indicates liver stress. Avoid alcohol; reduce fatty foods; see hepatologist.' },
    ast: { low: 'Low AST is not clinically significant.', high: 'Elevated AST may indicate liver/muscle damage. Consult hepatologist; limit alcohol.' },
    alp: { low: 'Low ALP may indicate hypothyroidism. Thyroid evaluation recommended.', high: 'High ALP may indicate liver or bone disease. Further evaluation needed.' },
    bilirubin: { low: 'Low bilirubin is generally not concerning.', high: 'Elevated bilirubin may indicate liver disease or hemolysis. Consult hepatologist.' },
    totalCholesterol: { low: 'Low total cholesterol; ensure adequate nutrition.', high: 'High cholesterol increases cardiovascular risk. Follow heart-healthy diet; consider statins.' },
    ldl: { low: 'Low LDL; continue maintaining healthy diet.', high: 'High LDL (bad cholesterol). Reduce saturated fats; increase exercise; consider medication.' },
    hdl: { low: 'Low HDL (good cholesterol). Increase exercise; add omega-3 fatty acids to diet.', high: 'High HDL is generally protective against heart disease. Maintain current lifestyle.' },
    triglycerides: { low: 'Low triglycerides; continue healthy diet.', high: 'High triglycerides. Reduce sugar, alcohol, and refined carbs. Increase omega-3 intake.' },
    tsh: { low: 'Low TSH may indicate hyperthyroidism. Endocrinology consultation recommended.', high: 'High TSH may indicate hypothyroidism. Thyroid hormone replacement may be needed.' },
    t3: { low: 'Low T3 may indicate hypothyroidism. Consult endocrinologist.', high: 'High T3 may indicate hyperthyroidism or thyroiditis. Endocrinology evaluation needed.' },
    t4: { low: 'Low T4 suggests hypothyroidism. Thyroid hormone therapy may be required.', high: 'High T4 suggests hyperthyroidism. Antithyroid treatment may be needed.' },
    vitaminB12: { low: 'Vitamin B12 deficiency. Take B12 supplements (1000mcg/day); consider methylcobalamin form.', high: 'Very high B12 may indicate liver disease or supplements overdose. Consult physician.' },
    vitaminD: { low: 'Vitamin D deficiency. Supplement with 2000-5000 IU/day; increase sun exposure.', high: 'Vitamin D toxicity risk. Reduce supplementation; consult physician.' },
    ferritin: { low: 'Low ferritin indicates iron deficiency. Increase iron-rich foods; take iron supplements.', high: 'High ferritin may indicate inflammation or iron overload (hemochromatosis). Consult hematologist.' },
    iron: { low: 'Low serum iron suggests iron deficiency anemia. Iron supplementation and dietary changes needed.', high: 'High serum iron may indicate hemochromatosis. Consult hematologist.' },
  };

  const rec = recommendations[key];
  if (!rec) return `${status} value detected. Please consult your physician.`;
  return low ? rec.low : rec.high;
}

export function analyzeBloodWork(parameters: Record<string, number>): AnalysisResult[] {
  const results: AnalysisResult[] = [];
  for (const [key, value] of Object.entries(parameters)) {
    if (value === null || value === undefined || isNaN(value)) continue;
    const range = PARAMETER_RANGES[key];
    if (!range) continue;
    const status = getStatus(key, value);
    results.push({
      parameter: range.description,
      value,
      unit: range.unit,
      status,
      normalRange: `${range.normalMin} – ${range.normalMax} ${range.unit}`,
      recommendation: getRecommendationText(key, status, value),
    });
  }
  return results;
}

export function calculateHealthScore(results: AnalysisResult[]): number {
  if (results.length === 0) return 100;
  const weights: Record<HealthStatus, number> = { normal: 0, borderline: 15, abnormal: 30, critical: 50 };
  const totalPenalty = results.reduce((sum, r) => sum + weights[r.status], 0);
  const maxPenalty = results.length * 50;
  const score = Math.max(0, 100 - (totalPenalty / maxPenalty) * 100);
  return Math.round(score);
}

const GLUCOSE_PREDIABETES_THRESHOLD = 100;
const GLUCOSE_DIABETES_THRESHOLD = 126;

export function detectConditions(results: AnalysisResult[]): DetectedCondition[] {
  const conditions: DetectedCondition[] = [];
  const abnormal = results.filter(r => r.status === 'abnormal' || r.status === 'critical');
  const paramNames = abnormal.map(r => r.parameter.toLowerCase());

  if (paramNames.some(p => p.includes('hemoglobin') || p.includes('ferritin') || p.includes('iron'))) {
    const severity = abnormal.filter(r => r.status === 'critical').length > 0 ? 'high' : 'medium';
    conditions.push({ name: 'Iron Deficiency Anemia', severity, description: 'Low hemoglobin and/or iron stores suggest anemia, leading to fatigue and reduced oxygen transport.', affectedParameters: ['Hemoglobin', 'Ferritin', 'Serum Iron'] });
  }
  if (paramNames.some(p => p.includes('creatinine') || p.includes('bun') || p.includes('egfr'))) {
    const severity = abnormal.some(r => r.parameter.toLowerCase().includes('egfr') && r.status === 'critical') ? 'high' : 'medium';
    conditions.push({ name: 'Renal Function Concern', severity, description: 'Abnormal kidney markers may indicate reduced kidney function or early kidney disease.', affectedParameters: ['Creatinine', 'BUN', 'eGFR'] });
  }
  if (paramNames.some(p => p.includes('alt') || p.includes('ast') || p.includes('bilirubin') || p.includes('alp'))) {
    const severity = abnormal.some(r => r.status === 'critical') ? 'high' : 'medium';
    conditions.push({ name: 'Hepatic Stress', severity, description: 'Elevated liver enzymes may indicate liver inflammation, fatty liver disease, or hepatitis.', affectedParameters: ['ALT', 'AST', 'ALP', 'Bilirubin'] });
  }
  if (paramNames.some(p => p.includes('glucose'))) {
    const glucoseResult = results.find(r => r.parameter.toLowerCase().includes('glucose'));
    if (glucoseResult && glucoseResult.value > GLUCOSE_PREDIABETES_THRESHOLD) {
      const isDiabetes = glucoseResult.value > GLUCOSE_DIABETES_THRESHOLD;
      const severity = isDiabetes ? 'high' : 'medium';
      const name = isDiabetes ? 'Diabetes Risk' : 'Pre-diabetes';
      const description = isDiabetes
        ? 'Fasting glucose above 126 mg/dL is diagnostic for diabetes mellitus.'
        : 'Fasting glucose 100–125 mg/dL indicates pre-diabetes and elevated future diabetes risk.';
      conditions.push({ name, severity, description, affectedParameters: ['Fasting Glucose'] });
    }
  }
  if (paramNames.some(p => p.includes('ldl') || p.includes('total cholesterol') || p.includes('triglycerides'))) {
    conditions.push({ name: 'Dyslipidemia / Cardiovascular Risk', severity: 'medium', description: 'Abnormal lipid levels increase the risk of atherosclerosis, heart disease, and stroke.', affectedParameters: ['Total Cholesterol', 'LDL', 'Triglycerides'] });
  }
  if (paramNames.some(p => p.includes('vitamin d'))) {
    conditions.push({ name: 'Vitamin D Deficiency', severity: 'low', description: 'Low vitamin D affects bone health, immune function, and mood regulation.', affectedParameters: ['Vitamin D (25-OH)'] });
  }
  if (paramNames.some(p => p.includes('vitamin b12'))) {
    conditions.push({ name: 'Vitamin B12 Deficiency', severity: 'medium', description: 'B12 deficiency can cause neurological symptoms, fatigue, and megaloblastic anemia.', affectedParameters: ['Vitamin B12'] });
  }
  if (paramNames.some(p => p.includes('tsh') || p.includes('t3') || p.includes('t4'))) {
    const tsh = results.find(r => r.parameter === 'TSH');
    if (tsh) {
      const cond = tsh.value > 4.0 ? 'Hypothyroidism' : 'Hyperthyroidism';
      conditions.push({ name: cond, severity: 'medium', description: `${cond === 'Hypothyroidism' ? 'Underactive thyroid causing fatigue, weight gain, and cold sensitivity.' : 'Overactive thyroid causing weight loss, anxiety, and rapid heartbeat.'}`, affectedParameters: ['TSH', 'T3', 'T4'] });
    }
  }
  if (paramNames.some(p => p.includes('bun') || p.includes('creatinine') || p.includes('calcium'))) {
    const creatinine = results.find(r => r.parameter.toLowerCase().includes('creatinine'));
    if (creatinine && creatinine.value > 1.2) {
      conditions.push({ name: 'Kidney Stone Risk', severity: 'low', description: 'Elevated creatinine combined with metabolic imbalances may indicate kidney stone risk.', affectedParameters: ['Creatinine', 'BUN'] });
    }
  }
  return conditions;
}

export function getRecommendations(results: AnalysisResult[]): HealthRecommendation[] {
  const recommendations: HealthRecommendation[] = [];
  const criticalResults = results.filter(r => r.status === 'critical');
  const abnormalResults = results.filter(r => r.status === 'abnormal');
  const conditions = detectConditions(results);

  criticalResults.forEach(r => {
    recommendations.push({ category: 'critical', title: `Critical: ${r.parameter}`, description: r.recommendation, actionSteps: ['Seek immediate medical attention', 'Contact your primary care physician today', 'Do not delay treatment'], icon: 'AlertTriangle' });
  });

  if (conditions.some(c => c.name.includes('Anemia'))) {
    recommendations.push({ category: 'warning', title: 'Iron Deficiency Protocol', description: 'Your iron markers suggest deficiency. Follow this supplementation and dietary protocol.', actionSteps: ['Take ferrous sulfate 325mg daily with vitamin C', 'Eat red meat, spinach, lentils, and fortified cereals', 'Avoid coffee/tea with meals (inhibits absorption)', 'Recheck CBC in 3 months'], icon: 'Droplet' });
  }
  if (conditions.some(c => c.name.includes('Vitamin D'))) {
    recommendations.push({ category: 'warning', title: 'Vitamin D Supplementation', description: 'Vitamin D deficiency affects bone density, immunity, and mood.', actionSteps: ['Supplement 2000–5000 IU vitamin D3 daily', 'Get 15–30 min of sunlight daily (before 10am or after 4pm)', 'Eat fatty fish, egg yolks, fortified dairy', 'Retest in 3 months'], icon: 'Sun' });
  }
  if (conditions.some(c => c.name.includes('Diabetes') || c.name.includes('Pre-diabetes'))) {
    recommendations.push({ category: 'critical', title: 'Blood Sugar Management', description: 'Elevated glucose levels require immediate dietary and lifestyle intervention.', actionSteps: ['Consult endocrinologist immediately', 'Eliminate refined sugars and white flour products', 'Exercise 150 min/week (brisk walking, cycling)', 'Monitor glucose daily if prescribed'], icon: 'Activity' });
  }
  if (conditions.some(c => c.name.includes('Cardiovascular') || c.name.includes('Dyslipidemia'))) {
    recommendations.push({ category: 'warning', title: 'Cardiovascular Risk Reduction', description: 'Abnormal lipids increase heart disease and stroke risk significantly.', actionSteps: ['Follow Mediterranean diet (olive oil, fish, nuts, vegetables)', 'Exercise 30 min/day, 5 days a week', 'Quit smoking if applicable', 'Discuss statin therapy with cardiologist'], icon: 'Heart' });
  }
  if (conditions.some(c => c.name.includes('Kidney') || c.name.includes('Renal'))) {
    recommendations.push({ category: 'warning', title: 'Kidney Health Protocol', description: 'Abnormal kidney markers require careful monitoring and lifestyle changes.', actionSteps: ['Drink 8–10 glasses of water daily', 'Reduce sodium and protein intake', 'Avoid NSAIDs (ibuprofen, naproxen)', 'Schedule nephrology consultation'], icon: 'Shield' });
  }
  if (conditions.some(c => c.name.includes('Hepatic') || c.name.includes('Liver'))) {
    recommendations.push({ category: 'warning', title: 'Liver Support Protocol', description: 'Elevated liver enzymes indicate liver stress requiring dietary intervention.', actionSteps: ['Eliminate alcohol completely', 'Follow low-fat, high-fiber diet', 'Consider milk thistle supplement (silymarin 140mg 3x/day)', 'Hepatology referral within 2 weeks'], icon: 'Shield' });
  }

  const normalCount = results.filter(r => r.status === 'normal').length;
  if (normalCount > results.length * 0.7) {
    recommendations.push({ category: 'achievement', title: 'Excellent Overall Health Markers', description: `${normalCount} of your ${results.length} parameters are within normal range.`, actionSteps: ['Continue your current healthy lifestyle', 'Maintain annual blood work screening', 'Stay hydrated and exercise regularly'], icon: 'Award' });
  }

  abnormalResults.slice(0, 3).forEach(r => {
    if (!criticalResults.includes(r)) {
      recommendations.push({ category: 'optimization', title: `Optimize: ${r.parameter}`, description: r.recommendation, actionSteps: ['Discuss with your physician at next visit', 'Monitor trend over 3–6 months', 'Make targeted dietary adjustments'], icon: 'TrendingUp' });
    }
  });

  recommendations.push({ category: 'optimization', title: 'Annual Health Monitoring Plan', description: 'Regular blood work is the cornerstone of preventive healthcare.', actionSteps: ['Schedule full blood panel every 12 months', 'Track trends over time to spot early changes', 'Share results with all treating physicians', 'Use a health journal to log symptoms'], icon: 'Calendar' });

  return recommendations;
}

export function getHealthDimensions(results: AnalysisResult[]): HealthDimension[] {
  const getDimScore = (keys: string[]) => {
    const relevant = results.filter(r => keys.some(k => r.parameter.toLowerCase().includes(k.toLowerCase())));
    if (relevant.length === 0) return 85;
    const penalties: Record<HealthStatus, number> = { normal: 0, borderline: 20, abnormal: 40, critical: 70 };
    const totalPenalty = relevant.reduce((s, r) => s + penalties[r.status], 0);
    return Math.max(10, 100 - totalPenalty / relevant.length);
  };

  return [
    { name: 'Cardiovascular', score: getDimScore(['cholesterol', 'ldl', 'hdl', 'triglycerides']), fullMark: 100 },
    { name: 'Metabolic', score: getDimScore(['glucose', 'bun', 'creatinine']), fullMark: 100 },
    { name: 'Renal', score: getDimScore(['creatinine', 'egfr', 'bun']), fullMark: 100 },
    { name: 'Hepatic', score: getDimScore(['alt', 'ast', 'alp', 'bilirubin']), fullMark: 100 },
    { name: 'Endocrine', score: getDimScore(['tsh', 't3', 't4', 'glucose']), fullMark: 100 },
    { name: 'Nutritional', score: getDimScore(['vitamin', 'ferritin', 'iron', 'b12']), fullMark: 100 },
  ];
}

export function getHealthPredictions(results: AnalysisResult[]): HealthPrediction[] {
  const find = (key: string) => results.find(r => r.parameter.toLowerCase().includes(key.toLowerCase()));

  const predictions: HealthPrediction[] = [];

  const glucose = find('glucose');
  const diabetesRisk = glucose
    ? (glucose.value > GLUCOSE_DIABETES_THRESHOLD ? 85 : glucose.value > GLUCOSE_PREDIABETES_THRESHOLD ? 45 : 10)
    : 15;
  predictions.push({ condition: 'Type 2 Diabetes', riskScore: diabetesRisk, riskLevel: diabetesRisk > 60 ? 'high' : diabetesRisk > 30 ? 'moderate' : 'low', description: 'Based on fasting glucose and metabolic markers.' });

  const ldl = find('LDL');
  const hdl = find('HDL');
  const cvdRisk = ldl ? (ldl.value > 160 ? 70 : ldl.value > 130 ? 40 : 15) + (hdl && hdl.value < 40 ? 20 : 0) : 20;
  predictions.push({ condition: 'Cardiovascular Disease', riskScore: Math.min(95, cvdRisk), riskLevel: cvdRisk > 60 ? 'high' : cvdRisk > 35 ? 'moderate' : 'low', description: 'Based on lipid panel and cardiovascular markers.' });

  const hgb = find('hemoglobin');
  const anemiaRisk = hgb ? (hgb.value < 10 ? 90 : hgb.value < 12 ? 55 : 8) : 10;
  predictions.push({ condition: 'Anemia', riskScore: anemiaRisk, riskLevel: anemiaRisk > 60 ? 'high' : anemiaRisk > 30 ? 'moderate' : 'low', description: 'Based on CBC markers including hemoglobin and iron stores.' });

  const vitD = find('Vitamin D');
  const vitDRisk = vitD ? (vitD.value < 20 ? 80 : vitD.value < 30 ? 40 : 5) : 35;
  predictions.push({ condition: 'Vitamin D Deficiency', riskScore: vitDRisk, riskLevel: vitDRisk > 60 ? 'high' : vitDRisk > 25 ? 'moderate' : 'low', description: 'Based on serum 25-OH vitamin D levels.' });

  const tsh = find('TSH');
  const thyroidRisk = tsh ? (tsh.value > 5 || tsh.value < 0.3 ? 65 : tsh.value > 4 || tsh.value < 0.5 ? 30 : 8) : 12;
  predictions.push({ condition: 'Thyroid Disorder', riskScore: thyroidRisk, riskLevel: thyroidRisk > 55 ? 'high' : thyroidRisk > 25 ? 'moderate' : 'low', description: 'Based on thyroid stimulating hormone and thyroid hormones.' });

  const creatinine = find('Creatinine');
  const kidneyRisk = creatinine ? (creatinine.value > 1.5 ? 70 : creatinine.value > 1.2 ? 35 : 8) : 10;
  predictions.push({ condition: 'Chronic Kidney Disease', riskScore: kidneyRisk, riskLevel: kidneyRisk > 55 ? 'high' : kidneyRisk > 25 ? 'moderate' : 'low', description: 'Based on creatinine, BUN, and eGFR.' });

  return predictions;
}
