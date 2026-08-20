import type { Hospital } from '../types/health';

export function getUserLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
    });
  });
}

export async function reverseGeocode(lat: number, lon: number): Promise<{ city: string; country: string; countryCode: string }> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
      headers: { 'Accept-Language': 'en' },
    });
    if (!res.ok) throw new Error('Geocoding failed');
    const data = await res.json();
    const addr = data.address || {};
    return {
      city: addr.city || addr.town || addr.village || addr.county || 'Unknown City',
      country: addr.country || 'Unknown Country',
      countryCode: (addr.country_code || 'us').toUpperCase(),
    };
  } catch {
    return { city: 'Your Location', country: 'Unknown', countryCode: 'US' };
  }
}

const HOSPITAL_DATA: Record<string, Hospital[]> = {
  US: [
    { id: 'us1', name: 'Mayo Clinic - Diagnostic Center', type: 'Specialist Clinic', distance: '2.3 km', rating: 4.9, address: '200 First St SW, Rochester, MN', phone: '+1-507-284-2511', specialties: ['Hematology', 'Endocrinology', 'Nephrology'], availability: 'Today 9AM–5PM', country: 'US' },
    { id: 'us2', name: 'LabCorp - Blood Testing Center', type: 'Diagnostic Lab', distance: '0.8 km', rating: 4.6, address: '1120 Stateline Rd W', phone: '+1-800-522-2271', specialties: ['Blood Work', 'Urinalysis', 'Lipid Panel'], availability: 'Walk-in Available', country: 'US' },
    { id: 'us3', name: 'Quest Diagnostics', type: 'Diagnostic Lab', distance: '1.2 km', rating: 4.5, address: '875 Greentree Rd, Pittsburgh, PA', phone: '+1-866-697-8378', specialties: ['CBC', 'Metabolic Panel', 'Thyroid Function'], availability: 'Mon–Sat 7AM–3PM', country: 'US' },
    { id: 'us4', name: 'Johns Hopkins Emergency Medicine', type: 'Emergency', distance: '5.1 km', rating: 4.8, address: '1800 Orleans St, Baltimore, MD', phone: '+1-410-955-5000', specialties: ['Emergency Care', 'Critical Care', 'Cardiology'], availability: '24/7 Emergency', country: 'US' },
    { id: 'us5', name: 'Cleveland Clinic - Wellness Institute', type: 'Specialist Clinic', distance: '3.7 km', rating: 4.9, address: '9500 Euclid Ave, Cleveland, OH', phone: '+1-800-223-2273', specialties: ['Preventive Medicine', 'Cardiology', 'Gastroenterology'], availability: 'Next Appt: Tomorrow', country: 'US' },
    { id: 'us6', name: 'American Red Cross Blood Bank', type: 'Blood Bank', distance: '1.9 km', rating: 4.7, address: '431 18th St NW, Washington DC', phone: '+1-800-733-2767', specialties: ['Blood Donation', 'Plasma', 'Platelets'], availability: 'Mon–Sun 8AM–6PM', country: 'US' },
  ],
  GB: [
    { id: 'gb1', name: 'NHS Blood Test Centre – London', type: 'Diagnostic Lab', distance: '1.1 km', rating: 4.5, address: '60 Whitfield St, London W1T 4EU', phone: '+44-300-123-2323', specialties: ['Full Blood Count', 'Liver Function', 'Kidney Function'], availability: 'Mon–Fri 8AM–6PM', country: 'GB' },
    { id: 'gb2', name: 'Bupa Health Clinics', type: 'Specialist Clinic', distance: '2.0 km', rating: 4.7, address: '30 Cannon St, London EC4M 6XH', phone: '+44-330-134-5500', specialties: ['Health Screening', 'Cardiology', 'Thyroid'], availability: 'Today, Appointments Available', country: 'GB' },
    { id: 'gb3', name: 'Royal London Hospital', type: 'Emergency', distance: '4.2 km', rating: 4.6, address: 'Whitechapel Rd, London E1 1FR', phone: '+44-20-7377-7000', specialties: ['Emergency', 'Haematology', 'Renal Medicine'], availability: '24/7 Emergency', country: 'GB' },
    { id: 'gb4', name: 'NHS Pathology Labs – St Thomas\'s', type: 'Diagnostic Lab', distance: '3.0 km', rating: 4.4, address: 'Westminster Bridge Rd, London SE1 7EH', phone: '+44-20-7188-7188', specialties: ['Blood Cultures', 'Biochemistry', 'Immunology'], availability: 'Referral Required', country: 'GB' },
    { id: 'gb5', name: 'NHS Blood and Transplant', type: 'Blood Bank', distance: '2.8 km', rating: 4.8, address: '500 North Bristol Park, Bristol BS34 7QH', phone: '+44-300-123-23-23', specialties: ['Donor Services', 'Stem Cells', 'Blood Products'], availability: 'Mon–Sat 9AM–5PM', country: 'GB' },
  ],
  IN: [
    { id: 'in1', name: 'SRL Diagnostics', type: 'Diagnostic Lab', distance: '0.9 km', rating: 4.6, address: 'Hiranandani Gardens, Powai, Mumbai', phone: '+91-22-4035-9595', specialties: ['CBC', 'Thyroid Profile', 'Diabetes Panel'], availability: 'Walk-in 7AM–8PM', country: 'IN' },
    { id: 'in2', name: 'Apollo Diagnostics', type: 'Diagnostic Lab', distance: '1.5 km', rating: 4.7, address: '21 Greams Lane, Chennai 600006', phone: '+91-44-2829-0200', specialties: ['Lipid Profile', 'Liver Function', 'Kidney Function'], availability: 'Mon–Sun 6AM–10PM', country: 'IN' },
    { id: 'in3', name: 'AIIMS New Delhi – Emergency', type: 'Emergency', distance: '6.2 km', rating: 4.9, address: 'Sri Aurobindo Marg, New Delhi 110029', phone: '+91-11-2658-8500', specialties: ['Emergency Medicine', 'Hematology', 'Nephrology'], availability: '24/7 Emergency', country: 'IN' },
    { id: 'in4', name: 'Fortis Blood Bank', type: 'Blood Bank', distance: '2.1 km', rating: 4.5, address: 'Sector 62, Noida, Uttar Pradesh', phone: '+91-120-2967-000', specialties: ['Blood Donation', 'Component Therapy', 'Plasma'], availability: '24/7 Service', country: 'IN' },
    { id: 'in5', name: 'Manipal Hospital – Specialist Centre', type: 'Specialist Clinic', distance: '3.8 km', rating: 4.8, address: '98 HAL Airport Rd, Bangalore 560017', phone: '+91-80-2502-4444', specialties: ['Endocrinology', 'Cardiology', 'Gastroenterology'], availability: 'By Appointment', country: 'IN' },
    { id: 'in6', name: 'Thyrocare Technologies', type: 'Diagnostic Lab', distance: '1.0 km', rating: 4.4, address: 'D-37/1, TTC Industrial Area, Navi Mumbai', phone: '+91-22-2778-2525', specialties: ['Thyroid Tests', 'Full Body Checkup', 'Diabetes Screening'], availability: 'Home Collection Available', country: 'IN' },
  ],
  AU: [
    { id: 'au1', name: 'PathWest Laboratory Medicine', type: 'Diagnostic Lab', distance: '1.3 km', rating: 4.6, address: 'QEII Medical Centre, Nedlands WA 6009', phone: '+61-8-9346-3337', specialties: ['Haematology', 'Biochemistry', 'Microbiology'], availability: 'Mon–Fri 7AM–5PM', country: 'AU' },
    { id: 'au2', name: 'Royal Melbourne Hospital', type: 'Emergency', distance: '4.5 km', rating: 4.8, address: '300 Grattan St, Parkville VIC 3050', phone: '+61-3-9342-7000', specialties: ['Emergency', 'Internal Medicine', 'Renal'], availability: '24/7 Emergency', country: 'AU' },
    { id: 'au3', name: 'Australian Red Cross Lifeblood', type: 'Blood Bank', distance: '2.2 km', rating: 4.7, address: '417 St Kilda Rd, Melbourne VIC 3004', phone: '+61-1800-811-700', specialties: ['Blood Donation', 'Plasma Donation', 'Platelets'], availability: 'Mon–Sat 8AM–6PM', country: 'AU' },
    { id: 'au4', name: 'Sonic Healthcare – Douglass Hanly Moir', type: 'Diagnostic Lab', distance: '0.7 km', rating: 4.5, address: '14 Giffnock Ave, North Ryde NSW 2113', phone: '+61-2-9855-5444', specialties: ['Full Blood Count', 'Metabolic Screen', 'Vitamin Levels'], availability: 'Walk-in Available', country: 'AU' },
  ],
  DE: [
    { id: 'de1', name: 'Charité – Universitätsmedizin Berlin', type: 'Specialist Clinic', distance: '3.1 km', rating: 4.9, address: 'Charitéplatz 1, 10117 Berlin', phone: '+49-30-450-50', specialties: ['Internal Medicine', 'Hematology', 'Endocrinology'], availability: 'Mon–Fri 8AM–4PM', country: 'DE' },
    { id: 'de2', name: 'Synlab Analytics – Labor München', type: 'Diagnostic Lab', distance: '1.4 km', rating: 4.6, address: 'Wagmüllerstraße 19, 80538 Munich', phone: '+49-89-5522-5500', specialties: ['Clinical Chemistry', 'Immunology', 'Genetics'], availability: 'Mon–Sat 7AM–6PM', country: 'DE' },
    { id: 'de3', name: 'DRK Blutspende Dienst', type: 'Blood Bank', distance: '2.5 km', rating: 4.7, address: 'Spendenstr. 14, 10117 Berlin', phone: '+49-30-80681-0', specialties: ['Blood Donation', 'Apheresis', 'Stem Cells'], availability: 'Mon–Fri 8AM–7PM', country: 'DE' },
  ],
  DEFAULT: [
    { id: 'def1', name: 'City General Hospital', type: 'Emergency', distance: '3.5 km', rating: 4.4, address: '123 Medical Center Drive', phone: '+1-555-0100', specialties: ['Emergency Care', 'Internal Medicine', 'Diagnostics'], availability: '24/7 Emergency', country: 'XX' },
    { id: 'def2', name: 'LifeLab Diagnostics', type: 'Diagnostic Lab', distance: '1.2 km', rating: 4.3, address: '45 Health Avenue', phone: '+1-555-0200', specialties: ['Blood Work', 'Urinalysis', 'Pathology'], availability: 'Mon–Sat 7AM–7PM', country: 'XX' },
    { id: 'def3', name: 'Metro Specialist Clinic', type: 'Specialist Clinic', distance: '2.1 km', rating: 4.5, address: '78 Wellness Boulevard', phone: '+1-555-0300', specialties: ['Endocrinology', 'Cardiology', 'Nephrology'], availability: 'By Appointment', country: 'XX' },
    { id: 'def4', name: 'Regional Blood Bank', type: 'Blood Bank', distance: '1.8 km', rating: 4.6, address: '200 Donor Way', phone: '+1-555-0400', specialties: ['Blood Donation', 'Plasma', 'Platelets'], availability: 'Mon–Sun 8AM–6PM', country: 'XX' },
    { id: 'def5', name: 'Primary Health Centre', type: 'Specialist Clinic', distance: '0.9 km', rating: 4.2, address: '12 Community Health Road', phone: '+1-555-0500', specialties: ['General Practice', 'Preventive Care', 'Health Screening'], availability: 'Walk-in Welcome', country: 'XX' },
  ],
};

export function getHospitalsForLocation(_lat: number, _lon: number, countryCode?: string): Hospital[] {
  const code = (countryCode || 'DEFAULT').toUpperCase();
  return HOSPITAL_DATA[code] || HOSPITAL_DATA['DEFAULT'];
}
