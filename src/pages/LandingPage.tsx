import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FlaskConical, Globe, Zap, Eye, ArrowRight, Activity, Users, BarChart2, Clock } from 'lucide-react';
import ThreeScene from '../components/ThreeScene';

const features = [
  { icon: FlaskConical, title: 'Blood Work Analysis', description: 'AI-powered analysis of 20+ blood parameters detecting deficiencies, organ stress, and metabolic disorders in seconds.', color: '#06b6d4', glow: 'rgba(6,182,212,0.2)' },
  { icon: Eye, title: '3D Visualization', description: 'Interactive 3D organ models highlight affected systems based on your blood work in real-time.', color: '#8b5cf6', glow: 'rgba(139,92,246,0.2)' },
  { icon: Globe, title: 'Geo-aware Clinics', description: 'Instantly find nearby hospitals, diagnostic labs, and specialists based on your GPS location.', color: '#10b981', glow: 'rgba(16,185,129,0.2)' },
  { icon: Zap, title: 'Early Detection', description: 'Predictive risk scoring for diabetes, cardiovascular disease, anemia, and more before symptoms appear.', color: '#f59e0b', glow: 'rgba(245,158,11,0.2)' },
];

const stats = [
  { icon: BarChart2, value: '25+', label: 'Parameters Analyzed' },
  { icon: Globe, value: '150+', label: 'Countries' },
  { icon: Activity, value: '99.7%', label: 'Accuracy Rate' },
  { icon: Clock, value: 'Real-time', label: 'Insights' },
  { icon: Users, value: '10K+', label: 'Health Profiles' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">
        {/* Background radial glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        </div>

        <div className="relative z-10 max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: '#06b6d4' }}>
              <Activity size={12} />
              AI-Powered Health Intelligence Platform
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              The Future of{' '}
              <span style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Personalized
              </span>{' '}
              Health Monitoring
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg mb-8" style={{ color: '#94a3b8', lineHeight: 1.7 }}>
              Enter your blood work data and our advanced analysis engine evaluates 25+ biomarkers,
              detects nutritional deficiencies, organ stress patterns, and metabolic disorders —
              then connects you with nearby specialists.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/analysis"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', boxShadow: '0 0 30px rgba(6,182,212,0.3)' }}
              >
                Start Health Analysis
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' }}
              >
                View Dashboard
              </Link>
            </motion.div>

            {/* Mini stats */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-6 mt-10">
              {['99.7% Accuracy', '25+ Biomarkers', 'Real-time Results', 'Free Analysis'].map((statText) => (
                <div key={statText} className="flex items-center gap-2 text-sm" style={{ color: '#64748b' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#06b6d4' }} />
                  {statText}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: 3D Scene */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(6,182,212,0.15)', boxShadow: '0 0 60px rgba(6,182,212,0.08)' }}>
            <ThreeScene height="480px" interactive />
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-6 px-6" style={{ background: 'rgba(6,182,212,0.04)', borderTop: '1px solid rgba(6,182,212,0.1)', borderBottom: '1px solid rgba(6,182,212,0.1)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8">
            {stats.map(({ icon: Icon, value, label }) => (
              <motion.div key={label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.15)' }}>
                  <Icon size={16} color="#06b6d4" />
                </div>
                <div>
                  <div className="text-lg font-bold" style={{ color: '#06b6d4' }}>{value}</div>
                  <div className="text-xs" style={{ color: '#64748b' }}>{label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.h2 variants={fadeUp} className="text-4xl font-bold mb-4">
              <span style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Comprehensive Health Intelligence
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg max-w-2xl mx-auto" style={{ color: '#64748b' }}>
              Everything you need to understand and improve your health, powered by clinical-grade analysis algorithms.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description, color, glow }) => (
              <motion.div key={title} variants={fadeUp} whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.2 }} className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}22`, boxShadow: `0 0 30px ${glow}` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                  <Icon size={22} color={color} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#f1f5f9' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-12 rounded-3xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(6,182,212,0.2)', boxShadow: '0 0 60px rgba(6,182,212,0.06)' }}>
            <h2 className="text-4xl font-bold mb-4">
              Ready to understand your{' '}
              <span style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                blood work?
              </span>
            </h2>
            <p className="text-lg mb-8" style={{ color: '#64748b' }}>
              Get your personalized health analysis in under 3 minutes. No sign-up required.
            </p>
            <Link
              to="/analysis"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', boxShadow: '0 0 40px rgba(6,182,212,0.35)', fontSize: '1.05rem' }}
            >
              <FlaskConical size={20} />
              Start Free Analysis
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
