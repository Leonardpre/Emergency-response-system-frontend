import type { IncidentType, IncidentStatus, MediaStatus } from '@/types';

export function typeLabel(type: IncidentType): string {
  switch (type) {
    case 'medical': return 'Medical SOS';
    case 'fire': return 'Fire Outbreak';
    case 'accident': return 'Accident';
    case 'security': return 'Security';
  }
}

export function typeColor(type: IncidentType): { text: string; bg: string; border: string; dot: string } {
  switch (type) {
    case 'medical': return { text: 'text-signal-400', bg: 'bg-signal-500/10', border: 'border-signal-500/30', dot: 'bg-signal-500' };
    case 'fire': return { text: 'text-ember-400', bg: 'bg-ember-500/10', border: 'border-ember-500/30', dot: 'bg-ember-500' };
    case 'accident': return { text: 'text-warn-400', bg: 'bg-warn-500/10', border: 'border-warn-500/30', dot: 'bg-warn-500' };
    case 'security': return { text: 'text-info-400', bg: 'bg-info-500/10', border: 'border-info-500/30', dot: 'bg-info-500' };
  }
}

export function statusLabel(status: IncidentStatus): string {
  switch (status) {
    case 'pending': return 'PENDING';
    case 'accepted': return 'ACCEPTED';
    case 'en_route': return 'EN ROUTE';
    case 'on_scene': return 'ON SCENE';
    case 'resolved': return 'RESOLVED';
    case 'rerouted': return 'REROUTED';
    case 'media_verified': return 'MEDIA VERIFIED';
  }
}

export function statusColor(status: IncidentStatus): string {
  switch (status) {
    case 'pending': return 'text-critical-400 bg-critical-500/10 border-critical-500/30';
    case 'accepted': return 'text-info-400 bg-info-500/10 border-info-500/30';
    case 'en_route': return 'text-ember-400 bg-ember-500/10 border-ember-500/30';
    case 'on_scene': return 'text-warn-400 bg-warn-500/10 border-warn-500/30';
    case 'resolved': return 'text-signal-400 bg-signal-500/10 border-signal-500/30';
    case 'rerouted': return 'text-ink-400 bg-ink-600/40 border-ink-500/40';
    case 'media_verified': return 'text-signal-400 bg-signal-500/10 border-signal-500/30';
  }
}

export function mediaStatusLabel(status: MediaStatus): string {
  switch (status) {
    case 'unverified': return 'Unverified';
    case 'media_verified': return 'Media Verified';
    case 'media_pending': return 'Upload in Progress';
  }
}

export function formatElapsed(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m < 60) return `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

export function severityColor(sev: 'critical' | 'urgent' | 'moderate'): string {
  switch (sev) {
    case 'critical': return 'text-critical-400';
    case 'urgent': return 'text-ember-400';
    case 'moderate': return 'text-warn-400';
  }
}
