import type { Incident, IncidentType, Responder, ResponderKind, Coordinates } from '@/types';

const NOW = Date.now();
const iso = (msAgo: number) => new Date(NOW - msAgo).toISOString();

const inc = (n: number) => n;

function makeResponder(
  id: string,
  name: string,
  kind: ResponderKind,
  lat: number,
  lng: number,
  distanceKm: number,
  etaMin: number,
  capacity: number,
  status: Responder['status'] = 'available',
  phone = '+234 800 000 0000'
): Responder {
  return { id, name, kind, coordinates: { lat, lng }, distanceKm, etaMin, capacity, status, phone };
}

// Lagos-ish coordinates as the operating region
const HQ: Coordinates = { lat: 6.5244, lng: 3.3792 };

export const HOSPITALS: Responder[] = [
  makeResponder('h1', 'Lagos General Hospital', 'hospital', 6.5310, 3.3905, 2.1, 4, 12),
  makeResponder('h2', 'St. Mary Medical Center', 'hospital', 6.5180, 3.3650, 3.4, 6, 8),
  makeResponder('h3', 'Eko trauma Unit', 'hospital', 6.5420, 3.3950, 4.7, 8, 5, 'busy'),
  makeResponder('h4', 'Island Emergency Clinic', 'hospital', 6.5020, 3.3580, 6.1, 10, 3),
  makeResponder('h5', 'Mainland Trauma Center', 'hospital', 6.5100, 3.3850, 5.2, 9, 7, 'dispatched'),
];

export const FIRE_STATIONS: Responder[] = [
  makeResponder('f1', 'Lagos Island Fire Station', 'fire_station', 6.5260, 3.3850, 1.8, 3, 4),
  makeResponder('f2', 'Yaba Fire Command', 'fire_station', 6.5040, 3.3760, 4.5, 7, 6),
  makeResponder('f3', 'Surulere Fire Post', 'fire_station', 6.4880, 3.3520, 8.2, 12, 2, 'busy'),
];

export const COMMUNITY_VOLUNTEERS: Responder[] = [
  makeResponder('v1', 'Adaeze N. (Volunteer)', 'community', 6.5248, 3.3798, 0.2, 1, 0, 'available', '+234 803 111 2222'),
  makeResponder('v2', 'Tunde O. (Citizen)', 'community', 6.5232, 3.3786, 0.3, 1, 0, 'available', '+234 805 333 4444'),
  makeResponder('v3', 'Grace E. (Volunteer)', 'community', 6.5256, 3.3801, 0.4, 1, 0, 'available', '+234 807 555 6666'),
  makeResponder('v4', 'Ibrahim S. (Citizen)', 'community', 6.5240, 3.3778, 0.3, 1, 0, 'available', '+234 809 777 8888'),
];

export const SEED_INCIDENTS: Incident[] = [
  {
    id: 'inc-001',
    code: 'MED-2026-0047',
    type: 'medical',
    status: 'accepted',
    mediaStatus: 'media_verified',
    coordinates: { lat: 6.5244, lng: 3.3792 },
    address: '12 Adeola Odeku St, Victoria Island, Lagos',
    reporterName: 'Unknown Caller',
    reporterPhone: '+234 803 555 1122',
    timestamp: iso(inc(8 * 60 * 1000)),
    description: 'Adult male, conscious, suspected fracture. Breathing stable.',
    severity: 'urgent',
    assignedResponder: HOSPITALS[0],
    candidateResponders: [HOSPITALS[0], HOSPITALS[1], HOSPITALS[3]],
    dispatchTier: 'station',
    media: [
      { type: 'photo', sizeKb: 218, timestamp: iso(inc(7 * 60 * 1000)), label: 'scene_photo_01.jpg' },
      { type: 'voice', sizeKb: 82, timestamp: iso(inc(6 * 60 * 1000)), label: 'voice_note_01.amr' },
    ],
    elapsedSec: 480,
  },
  {
    id: 'inc-002',
    code: 'FIR-2026-0113',
    type: 'fire',
    status: 'en_route',
    mediaStatus: 'unverified',
    coordinates: { lat: 6.5180, lng: 3.3650 },
    address: '45 Bode Thomas St, Surulere, Lagos',
    reporterName: 'Bola A.',
    reporterPhone: '+234 805 222 3344',
    timestamp: iso(inc(3 * 60 * 1000)),
    description: 'Residential building fire, visible flames, occupants evacuated.',
    severity: 'critical',
    assignedResponder: FIRE_STATIONS[0],
    candidateResponders: [FIRE_STATIONS[0], FIRE_STATIONS[1]],
    dispatchTier: 'station',
    media: [],
    elapsedSec: 180,
  },
  {
    id: 'inc-003',
    code: 'ACC-2026-0089',
    type: 'accident',
    status: 'pending',
    mediaStatus: 'unverified',
    coordinates: { lat: 6.5420, lng: 3.3950 },
    address: 'Ikorodu Rd, Fadeyi Junction, Lagos',
    reporterName: 'Driver (anonymous)',
    reporterPhone: '+234 807 999 0011',
    timestamp: iso(inc(45 * 1000)),
    description: 'Two-vehicle collision. One passenger trapped. Traffic building.',
    severity: 'critical',
    candidateResponders: [HOSPITALS[3], HOSPITALS[0], HOSPITALS[1]],
    media: [],
    elapsedSec: 45,
  },
  {
    id: 'inc-004',
    code: 'SEC-2026-0031',
    type: 'security',
    status: 'resolved',
    mediaStatus: 'media_verified',
    coordinates: { lat: 6.5020, lng: 3.3580 },
    address: 'CMS Bus Terminal, Lagos Island',
    reporterName: 'Security Post 4',
    reporterPhone: '+234 809 444 7788',
    timestamp: iso(inc(52 * 60 * 1000)),
    description: 'Disturbance reported and resolved by patrol unit. No injuries.',
    severity: 'moderate',
    assignedResponder: HOSPITALS[4],
    candidateResponders: [HOSPITALS[4]],
    media: [
      { type: 'video', sizeKb: 480, timestamp: iso(inc(48 * 60 * 1000)), label: 'clip_15s.mp4' },
    ],
    elapsedSec: 3120,
  },
];

export const HQ_COORDS = HQ;

// Templates for live-generated incidents
const INCIDENT_TEMPLATES: { type: IncidentType; description: string; severity: Incident['severity']; address: string }[] = [
  { type: 'medical', description: 'Cardiac arrest reported, bystander performing CPR.', severity: 'critical', address: '23 Awolowo Rd, Ikoyi, Lagos' },
  { type: 'fire', description: 'Market stall fire spreading rapidly, no stations within 20km radius.', severity: 'critical', address: 'Mile 12 Market, Ikorodu Rd, Lagos' },
  { type: 'accident', description: 'Motorcycle vs pedestrian, head injury visible.', severity: 'urgent', address: 'Lekki-Epe Expressway, Ajah, Lagos' },
  { type: 'security', description: 'Armed robbery in progress, shots fired.', severity: 'critical', address: '17 Marina Rd, Lagos Island' },
  { type: 'medical', description: 'Pregnancy emergency, bleeding reported.', severity: 'urgent', address: '8 Allen Ave, Ikeja, Lagos' },
  { type: 'fire', description: 'Electrical fire in apartment complex, smoke visible.', severity: 'urgent', address: '34 Lawanson Rd, Surulere, Lagos' },
];

const TYPE_CODES: Record<IncidentType, string> = {
  medical: 'MED',
  fire: 'FIR',
  accident: 'ACC',
  security: 'SEC',
};

let incidentCounter = 120;

export function generateIncident(): Incident {
  const tpl = INCIDENT_TEMPLATES[Math.floor(Math.random() * INCIDENT_TEMPLATES.length)];
  const code = `${TYPE_CODES[tpl.type]}-2026-${String(++incidentCounter).padStart(4, '0')}`;
  const isFireVicinity = tpl.type === 'fire' && Math.random() > 0.5;

  const lat = HQ.lat + (Math.random() - 0.5) * 0.08;
  const lng = HQ.lng + (Math.random() - 0.5) * 0.08;
  const coordinates: Coordinates = { lat, lng };

  let candidates: Responder[] = [];
  let dispatchTier: 'station' | 'vicinity' | undefined;
  let vicinityAlert = false;

  if (tpl.type === 'fire') {
    if (isFireVicinity) {
      candidates = COMMUNITY_VOLUNTEERS;
      dispatchTier = 'vicinity';
      vicinityAlert = true;
    } else {
      candidates = FIRE_STATIONS.filter((f) => f.status === 'available');
      dispatchTier = 'station';
    }
  } else if (tpl.type === 'medical' || tpl.type === 'accident') {
    candidates = HOSPITALS.filter((h) => h.status !== 'busy').slice(0, 3);
  } else {
    candidates = HOSPITALS.slice(0, 2);
  }

  return {
    id: `inc-${Date.now()}`,
    code,
    type: tpl.type,
    status: 'pending',
    mediaStatus: 'unverified',
    coordinates,
    address: tpl.address,
    reporterName: ['Anonymous', 'Mobile caller', 'Witness', 'Security post'][Math.floor(Math.random() * 4)],
    reporterPhone: `+234 80${Math.floor(Math.random() * 9)} ${Math.floor(1000000 + Math.random() * 8999999)}`,
    timestamp: new Date().toISOString(),
    description: tpl.description,
    severity: tpl.severity,
    candidateResponders: candidates,
    dispatchTier,
    vicinityAlert,
    media: [],
    elapsedSec: 0,
  };
}
