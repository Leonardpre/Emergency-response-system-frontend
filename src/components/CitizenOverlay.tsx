import type { Incident } from '@/types';
import { formatElapsed } from '@/lib/format';
import { X, Flame, MapPin, Shield, AlertTriangle, Phone, Volume2 } from 'lucide-react';

interface CitizenOverlayProps {
  incident: Incident;
  onClose: () => void;
}

export function CitizenEmergencyOverlay({ incident, onClose }: CitizenOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border-2 border-critical-500 bg-ink-900 shadow-2xl shadow-critical-500/30 animate-scale-in overflow-hidden">
        {/* Flashing header */}
        <div className="animate-flash-red px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Flame className="w-8 h-8 text-white" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-8 h-8 rounded-full border-2 border-white/60 animate-pulse-ring" />
              </span>
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">CRITICAL FIRE ALERT</h2>
              <p className="text-[10px] font-mono text-white/80">IN YOUR VICINITY — 2KM RADIUS</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          {/* Audio cue indicator */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-critical-400 animate-blip">
            <Volume2 className="w-4 h-4" />
            <span>HIGH-AUDIBILITY ALERT ACTIVATED</span>
          </div>

          {/* Message */}
          <div className="rounded-lg bg-critical-500/10 border border-critical-500/30 p-3">
            <p className="text-sm text-white leading-relaxed">
              A fire outbreak has been reported near your location. No fire stations are available within response range.
              Please take immediate safety precautions.
            </p>
          </div>

          {/* Location */}
          <div className="rounded-lg bg-ink-800 border border-ink-600 p-3">
            <div className="text-[10px] text-ink-400 font-mono tracking-wider mb-1">REPORTED LOCATION</div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-critical-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-slate-200">{incident.address}</p>
                <p className="text-[11px] font-mono text-ink-400 mt-0.5">{incident.coordinates.lat.toFixed(4)}, {incident.coordinates.lng.toFixed(4)}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] font-mono text-critical-400">
              <AlertTriangle className="w-3 h-3" />Elapsed: {formatElapsed(incident.elapsedSec)}
            </div>
          </div>

          {/* Safety guidelines */}
          <div className="rounded-lg border border-warn-500/30 bg-warn-500/5 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-warn-400" />
              <span className="text-xs font-bold text-warn-400">IMMEDIATE SAFETY ACTIONS</span>
            </div>
            <ol className="text-[12px] text-slate-200 space-y-1.5 list-decimal list-inside">
              <li>Evacuate the area immediately — move upwind of the fire</li>
              <li>Do not attempt to fight large fires yourself</li>
              <li>Alert neighbors and help vulnerable persons evacuate</li>
              <li>Close doors behind you to slow fire spread</li>
              <li>If trapped, call <span className="font-mono text-white">112</span> and stay low</li>
            </ol>
          </div>

          {/* Community volunteers alerted */}
          <div className="flex items-center gap-2 rounded-lg bg-info-500/10 border border-info-500/30 px-3 py-2">
            <span className="text-base">👥</span>
            <span className="text-[11px] text-info-400 font-mono">
              {incident.candidateResponders.length} community volunteers alerted in your area
            </span>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-ink-700 bg-ink-950/50 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg bg-critical-600 hover:bg-critical-500 text-white text-sm font-bold transition"
          >
            I Understand — Dismiss
          </button>
          <a
            href="tel:112"
            className="px-4 py-2.5 rounded-lg bg-ink-700 hover:bg-ink-600 text-slate-200 text-sm font-medium transition flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />Call 112
          </a>
        </div>
      </div>
    </div>
  );
}
