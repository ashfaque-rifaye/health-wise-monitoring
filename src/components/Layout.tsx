import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, FlaskConical, LayoutDashboard, MapPin, Lightbulb, Dna } from 'lucide-react';

const navLinks = [
  { path: '/', label: 'Home', icon: Activity },
  { path: '/analysis', label: 'Analysis', icon: FlaskConical },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/hospitals', label: 'Hospitals', icon: MapPin },
  { path: '/insights', label: 'Insights', icon: Lightbulb },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen" style={{ background: '#030712' }}>
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          zIndex: 0,
        }}
      />

      {/* Top nav */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(3, 7, 18, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(6, 182, 212, 0.15)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', boxShadow: '0 0 16px rgba(6,182,212,0.4)' }}
            >
              <Dna size={18} color="white" />
            </div>
            <span
              className="text-xl font-bold"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              HealthWise
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    color: active ? '#06b6d4' : '#94a3b8',
                    background: active ? 'rgba(6,182,212,0.1)' : 'transparent',
                  }}
                >
                  <Icon size={15} />
                  {label}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-lg"
                      style={{ border: '1px solid rgba(6,182,212,0.4)', boxShadow: '0 0 10px rgba(6,182,212,0.2)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile nav indicator */}
          <div className="md:hidden flex gap-3">
            {navLinks.map(({ path, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <Link key={path} to={path}>
                  <Icon size={20} color={active ? '#06b6d4' : '#475569'} />
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 pt-16 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
