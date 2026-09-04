export type IncidentType = 'medical' | 'fire' | 'accident' | 'security';

export type IncidentStatus =
  | 'pending'        // awaiting accept
  | 'accepted'       // responder en route
  | 'en_route'       // dispatched
  | 'on_scene'       // arrived
  | 'resolved'       // closed
  | 'rerouted'       // declined / rerouted
  | 'media_verified' // media attached;

export type MediaStatus = 'unverified' | 'media_verified' | 'media_pending';

export type DispatchTier = 'station' | 'vicinity';

export type ResponderKind = 'hospital' | 'fire_station' | 'community';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Responder {
  id: string;
  name: string;
  kind: ResponderKind;
  coordinates: Coordinates;
  distanceKm: number;
  phone?: string;
  capacity?: number;       // beds / units available
  etaMin: number;
  status: 'available' | 'dispatched' | 'busy';
}

export interface MediaAttachment {
  type: 'photo' | 'voice' | 'video';
  sizeKb: number;
  timestamp: string;
  label: string;
}

export interface Incident {
  id: string;
  code: string;            // e.g. MED-2026-0047
  type: IncidentType;
  status: IncidentStatus;
  mediaStatus: MediaStatus;
  coordinates: Coordinates;
  address: string;
  reporterName: string;
  reporterPhone: string;
  timestamp: string;       // ISO
  description: string;
  severity: 'critical' | 'urgent' | 'moderate';
  assignedResponder?: Responder;
  candidateResponders: Responder[];
  dispatchTier?: DispatchTier;
  media: MediaAttachment[];
  vicinityAlert?: boolean;
  elapsedSec: number;
}

export interface IncidentAlertPayload {
  incidentId: string;
  type: IncidentType;
  coordinates: [number, number];
  timestamp: string;
}
