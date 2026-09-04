import type { Incident } from '@/types';
import { typeColor, formatElapsed } from '@/lib/format';
import { Flame, MapPin, Navigation, Clock, Phone, X, Siren, Users, Shield, AlertTriangle, CheckCircle2, Truck, Radio } from 'lucide-react';

interface FireModalProps {
  incident: Incident;
  onClose: () => void;
  onAccept: (responderId: string) => void;
}

export function FireCADModal({ incident, onClose, onAccept }: FireModalProps) {
  const c = typeColor(incident.type);
  const isVicinity = incident.dispatchTier === 'vicinity';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-ember-500/40 bg-ink-900 shadow-2xl shadow-ember-500/20 animate-scale-in overflow-hidden">
        {/* Header with fire glow */}
        <div className="relative px-6 py-5 border-b border-ember-500/30 bg-gradient-to-r from-ember-600/20 via-critical-600/10 to-transparent">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ember-500 to-transparent" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ember-500 to-critical-600 flex items-center justify-center shadow-lg shadow-ember-500/30">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <span className="absolute inset-0 rounded-xl border-2 border-ember-400 animate-pulse-ring" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Fire Station CAD</h2>
                <span className={`text-[11px] font-mono ${c.text}`}>{incident.code} — {isVicinity ? 'VICINITY BROADCAST' : 'STATION DISPATCH'}</span>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-ink-700 hover:bg-ink-600 flex items-center justify-center text-slate-300 transition">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Alert classification */}
          <div className={`rounded-lg border p-3 ${isVicinity ? 'border-critical-500/40 bg-critical-500/5' : 'border-ember-500/40 bg-ember-500/5'}`}>
            <div className="flex items-center gap-2 mb-1">
              {isVicinity ? <Users className="w-4 h-4 text-critical-400" /> : <Siren className="w-4 h-4 text-ember-400" />}
              <span className={`text-xs font-bold ${isVicinity ? 'text-critical-400' : 'text-ember-400'}`}>
                {isVicinity ? 'TIER 2 — VICINITY COMMUNITY FALLBACK' : 'TIER 1 — PRIMARY STATION DISPATCH'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isVicinity
                ? 'No fire stations found within 20km radius. System has escalated to 2km vicinity broadcast, alerting registered community volunteers and citizens via WebSocket + SMS.'
                : 'Fire station located within 20km radius. CAD alert dispatched to station socket. Awaiting crew acknowledgement.'}
            </p>
          </div>

          {/* Incident info grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-ink-800 border border-ink-600 p-3">
              <div className="text-[10px] text-ink-400 font-mono tracking-wider mb-1">INCIDENT LOCATION</div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-ember-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-slate-200">{incident.address}</p>
                  <p className="text-[11px] font-mono text-ink-400 mt-0.5">{incident.coordinates.lat.toFixed(4)}, {incident.coordinates.lng.toFixed(4)}</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-ink-800 border border-ink-600 p-3">
              <div className="text-[10px] text-ink-400 font-mono tracking-wider mb-1">TIME CRITICAL</div>
              <div className="flex items-center gap-2 text-sm text-white font-mono">
                <Clock className="w-4 h-4 text-critical-400" />{formatElapsed(incident.elapsedSec)}
              </div>
              <div className="text-[10px] text-ink-400 font-mono mt-1">since dispatch alert</div>
            </div>
          </div>

          {/* Route calculation UI */}
          {!isVicinity && incident.assignedResponder && (
            <div className="rounded-lg bg-ink-800 border border-ink-600 p-3">
              <div className="text-[10px] text-ink-400 font-mono tracking-wider mb-2">ROUTE CALCULATION</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-critical-500" />
                  <span className="text-[11px] font-mono text-slate-300">ORIGIN</span>
                </div>
                <div className="flex-1 h-px border-t border-dashed border-ink-500" />
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono text-slate-300">DEST</span>
                  <span className="w-2 h-2 rounded-full bg-signal-500" />
                </div>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="text-ember-400 flex items-center gap-1"><Navigation className="w-3 h-3" />{incident.assignedResponder.distanceKm}km</span>
                <span className="text-slate-300">ETA {incident.assignedResponder.etaMin} min</span>
                <span className="text-ink-400">via fastest route</span>
              </div>
            </div>
          )}

          {/* Responder list */}
          <div>
            <div className="text-[10px] text-ink-400 font-mono tracking-wider mb-2">
              {isVicinity ? 'COMMUNITY VOLUNTEERS IN 2KM RADIUS' : 'FIRE STATIONS IN 20KM RADIUS'}
            </div>
            <div className="space-y-2">
              {incident.candidateResponders.map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-lg bg-ink-800 border border-ink-600 px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isVicinity ? 'bg-info-500/10' : 'bg-ember-500/10'}`}>
                      {isVicinity ? <Users className="w-4 h-4 text-info-400" /> : <Truck className="w-4 h-4 text-ember-400" />}
                    </div>
                    <div>
                      <div className="text-[12px] text-slate-200">{r.name}</div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-ink-400">
                        <span>{r.distanceKm}km away</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Phone className="w-2.5 h-2.5" />{r.phone}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onAccept(r.id)}
                    className="text-[10px] font-mono px-3 py-1.5 rounded bg-ember-500/10 text-ember-400 border border-ember-500/30 hover:bg-ember-500/20 transition flex items-center gap-1"
                  >
                    <Radio className="w-3 h-3" />DISPATCH
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Safety guidelines for vicinity */}
          {isVicinity && (
            <div className="rounded-lg border border-warn-500/30 bg-warn-500/5 p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Shield className="w-4 h-4 text-warn-400" />
                <span className="text-xs font-bold text-warn-400">CITIZEN SAFETY ADVISORY</span>
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                <li>Evacuate downwind immediately — do not attempt to extinguish large fires</li>
                <li>Close doors and windows to slow smoke spread</li>
                <li>Call emergency line if situation worsens</li>
                <li>Help vulnerable neighbors evacuate if safe to do so</li>
              </ul>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-ink-700 bg-ink-950/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-mono text-ink-400">
            <AlertTriangle className="w-3.5 h-3.5 text-critical-400" />
            {incident.severity.toUpperCase()} PRIORITY
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-ink-700 hover:bg-ink-600 text-slate-300 text-xs font-medium transition">
              Close
            </button>
            {incident.candidateResponders[0] && (
              <button
                onClick={() => onAccept(incident.candidateResponders[0].id)}
                className="px-4 py-2 rounded-lg bg-ember-600 hover:bg-ember-500 text-white text-xs font-bold transition flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />Acknowledge & Dispatch
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
