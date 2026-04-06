import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Star, Clock, Filter, Navigation, Hospital, FlaskConical, Droplet, Stethoscope, AlertCircle } from 'lucide-react';
import { getUserLocation, reverseGeocode, getHospitalsForLocation } from '../utils/geolocation';
import type { Hospital as HospitalType } from '../types/health';

const TYPES = ['All', 'Emergency', 'Diagnostic Lab', 'Specialist Clinic', 'Blood Bank'];

const typeIcons: Record<string, typeof Hospital> = {
  'Emergency': AlertCircle,
  'Diagnostic Lab': FlaskConical,
  'Specialist Clinic': Stethoscope,
  'Blood Bank': Droplet,
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((starNumber) => (
        <Star
          key={starNumber}
          size={12}
          fill={starNumber <= Math.round(rating) ? '#f59e0b' : 'transparent'}
          color={starNumber <= Math.round(rating) ? '#f59e0b' : '#475569'}
        />
      ))}
      <span className="text-xs ml-1" style={{ color: '#94a3b8' }}>{rating.toFixed(1)}</span>
    </div>
  );
}

function HospitalCard({ hospital, index }: { hospital: HospitalType; index: number }) {
  const TypeIcon = typeIcons[hospital.type] || Hospital;
  const typeColors: Record<string, string> = {
    'Emergency': '#ef4444',
    'Diagnostic Lab': '#06b6d4',
    'Specialist Clinic': '#8b5cf6',
    'Blood Bank': '#f43f5e',
  };
  const color = typeColors[hospital.type] || '#94a3b8';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className="p-5 rounded-2xl transition-all duration-200"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}20` }}>
            <TypeIcon size={18} color={color} />
          </div>
          <div>
            <h3 className="font-semibold text-sm leading-tight" style={{ color: '#f1f5f9' }}>{hospital.name}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full mt-0.5 inline-block font-medium" style={{ color, background: `${color}15` }}>
              {hospital.type}
            </span>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-2">
          <div className="flex items-center gap-1 text-xs font-medium" style={{ color: '#06b6d4' }}>
            <Navigation size={11} />
            {hospital.distance}
          </div>
        </div>
      </div>

      {/* Rating */}
      <StarRating rating={hospital.rating} />

      {/* Info */}
      <div className="mt-3 space-y-1.5">
        <div className="flex items-start gap-2 text-xs" style={{ color: '#64748b' }}>
          <MapPin size={12} className="mt-0.5 flex-shrink-0" />
          <span>{hospital.address}</span>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: '#64748b' }}>
          <Phone size={12} />
          <span>{hospital.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: '#10b981' }}>
          <Clock size={12} />
          <span>{hospital.availability}</span>
        </div>
      </div>

      {/* Specialties */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {hospital.specialties.slice(0, 3).map((spec) => (
          <span key={spec} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
            {spec}
          </span>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-4">
        <a
          href={`tel:${hospital.phone}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105"
          style={{ background: `${color}20`, border: `1px solid ${color}30`, color }}
        >
          <Phone size={12} /> Call
        </a>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(hospital.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105"
          style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', color: '#06b6d4' }}
        >
          <MapPin size={12} /> Directions
        </a>
      </div>
    </motion.div>
  );
}

export default function HospitalFinder() {
  const [locationState, setLocationState] = useState<'idle' | 'loading' | 'granted' | 'denied'>('idle');
  const [locationInfo, setLocationInfo] = useState<{ city: string; country: string; countryCode: string } | null>(null);
  const [hospitals, setHospitals] = useState<HospitalType[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');

  const requestLocation = async () => {
    setLocationState('loading');
    try {
      const pos = await getUserLocation();
      const { latitude, longitude } = pos.coords;
      const info = await reverseGeocode(latitude, longitude);
      setLocationInfo(info);
      const results = getHospitalsForLocation(latitude, longitude, info.countryCode);
      setHospitals(results);
      setLocationState('granted');
    } catch {
      setLocationState('denied');
      // Fallback to demo data
      const demo = getHospitalsForLocation(0, 0, 'DEFAULT');
      setHospitals(demo);
    }
  };

  const filteredHospitals = hospitals
    .filter(h => activeFilter === 'All' || h.type === activeFilter)
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      return parseFloat(a.distance) - parseFloat(b.distance);
    });

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-4" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: '#06b6d4' }}>
            <MapPin size={12} /> Geolocation-Based Finder
          </div>
          <h1 className="text-4xl font-bold mb-2">
            <span style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Find Nearby Clinics & Hospitals
            </span>
          </h1>
          <p style={{ color: '#64748b' }}>Locate diagnostic labs, specialists, and emergency centers near you</p>
        </motion.div>

        {/* Location Panel */}
        {locationState === 'idle' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto text-center p-10 rounded-3xl mb-10" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(6,182,212,0.2)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}>
              <Navigation size={28} color="#06b6d4" />
            </div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: '#f1f5f9' }}>Enable Location Access</h2>
            <p className="text-sm mb-6" style={{ color: '#64748b' }}>
              Allow location access to find hospitals, diagnostic labs, and specialists nearest to you.
              Your location data is never stored.
            </p>
            <button
              onClick={requestLocation}
              className="px-8 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}
            >
              <span className="flex items-center gap-2 justify-center">
                <MapPin size={16} /> Allow Location Access
              </span>
            </button>
          </motion.div>
        )}

        {locationState === 'loading' && (
          <div className="text-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 rounded-full border-2 border-transparent mx-auto mb-4" style={{ borderTopColor: '#06b6d4' }} />
            <p style={{ color: '#64748b' }}>Detecting your location...</p>
          </div>
        )}

        {(locationState === 'granted' || locationState === 'denied') && (
          <>
            {/* Location Info */}
            {locationInfo && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6 p-4 rounded-xl max-w-sm" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
                <MapPin size={18} color="#06b6d4" />
                <div>
                  <p className="text-sm font-medium" style={{ color: '#f1f5f9' }}>{locationInfo.city}, {locationInfo.country}</p>
                  <p className="text-xs" style={{ color: '#64748b' }}>Showing hospitals in your region</p>
                </div>
              </motion.div>
            )}
            {locationState === 'denied' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-6 p-4 rounded-xl max-w-sm" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <AlertCircle size={18} color="#f59e0b" />
                <p className="text-sm" style={{ color: '#94a3b8' }}>Location access denied — showing demo hospital data.</p>
              </motion.div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex items-center gap-2 mr-2">
                <Filter size={14} color="#64748b" />
                <span className="text-sm" style={{ color: '#64748b' }}>Filter:</span>
              </div>
              {TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                  style={{
                    background: activeFilter === type ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.05)',
                    border: activeFilter === type ? '1px solid rgba(6,182,212,0.5)' : '1px solid rgba(255,255,255,0.08)',
                    color: activeFilter === type ? '#06b6d4' : '#64748b',
                    boxShadow: activeFilter === type ? '0 0 10px rgba(6,182,212,0.2)' : 'none',
                  }}
                >
                  {type}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm" style={{ color: '#64748b' }}>Sort:</span>
                {['distance', 'rating'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSortBy(s as 'distance' | 'rating')}
                    className="px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all"
                    style={{
                      background: sortBy === s ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
                      border: sortBy === s ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
                      color: sortBy === s ? '#8b5cf6' : '#64748b',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Hospital Grid */}
            {filteredHospitals.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredHospitals.map((hospital, i) => (
                  <HospitalCard key={hospital.id} hospital={hospital} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16" style={{ color: '#475569' }}>
                No hospitals found for the selected filter.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
