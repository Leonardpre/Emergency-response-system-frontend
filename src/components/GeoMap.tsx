import type { Incident, Responder, Coordinates } from '@/types';
import { typeColor } from '@/lib/format';
import { HQ_COORDS, HOSPITALS, FIRE_STATIONS } from '@/data/mockData';
import { MapPin, Crosshair, Building2, Flame, Users } from 'lucide-react';

interface GeoMapProps {
  incidents: Incident[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  compact?: boolean;
}

// Project lat/lng onto a normalized 0-100 grid centered on HQ
function project(coord: Coordinates): { x: number; y: number } {
  const span = 0.12;
  const x = ((coord.lng - (HQ_COORDS.lng - span / 2)) / span) * 100;
  const y = ((HQ_COORDS.lat + span / 2) - coord.lat) / span * 100;
  return { x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) };
}

export function GeoMap({ incidents, selectedId, onSelect, compact }: GeoMapProps) {
  return (
    <div className={`relative ${compact ? 'h-full' : 'h-full'} rounded-2xl overflow-hidden border border-ink-600 bg-ink-950 bg-grid`}>
      {/* radial glow */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      {/* scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-ember-500/30 to-transparent animate-scan-line" />
      </div>

      {/* Range rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[120, 220, 340].map((sz, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-dashed"
            style={{
              width: sz, height: sz,
              borderColor: i === 0 ? 'rgba(16,185,129,0.15)' : i === 1 ? 'rgba(249,115,22,0.12)' : 'rgba(59,130,246,0.08)',
            }}
          />
        ))}
      </div>

      {/* HQ marker */}
      <div className="absolute" style={{ left: `${project(HQ_COORDS).x}%`, top: `${project(HQ_COORDS).y}%`, transform: 'translate(-50%, -50%)' }}>
        <div className="relative">
          <div className="w-4 h-4 rounded-full bg-ember-500 border-2 border-white shadow-lg shadow-ember-500/50" />
          <div className="absolute inset-0 rounded-full border-2 border-ember-500 animate-pulse-ring" />
        </div>
      </div>

      {/* Hospital markers */}
      {HOSPITALS.map((h) => {
        const p = project(h.coordinates);
        return (
          <div key={h.id} className="absolute group" style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)' }}>
            <div className={`w-3 h-3 ${h.status === 'busy' ? 'bg-critical-500' : 'bg-signal-500'} rounded-sm border border-ink-900`} />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-[9px] font-mono text-signal-300 opacity-0 group-hover:opacity-100 transition bg-ink-900/90 px-1.5 py-0.5 rounded border border-ink-600">
              <Building2 className="w-2.5 h-2.5 inline mr-1" />{h.name}
            </div>
          </div>
        );
      })}

      {/* Fire station markers */}
      {FIRE_STATIONS.map((f) => {
        const p = project(f.coordinates);
        return (
          <div key={f.id} className="absolute group" style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)' }}>
            <div className={`w-3 h-3 ${f.status === 'busy' ? 'bg-critical-500' : 'bg-ember-500'} rotate-45 border border-ink-900`} />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-[9px] font-mono text-ember-300 opacity-0 group-hover:opacity-100 transition bg-ink-900/90 px-1.5 py-0.5 rounded border border-ink-600">
              <Flame className="w-2.5 h-2.5 inline mr-1" />{f.name}
            </div>
          </div>
        );
      })}

      {/* Incident markers */}
      {incidents.map((inc) => {
        const p = project(inc.coordinates);
        const c = typeColor(inc.type);
        const isPending = inc.status === 'pending';
        const isSelected = inc.id === selectedId;
        return (
          <button
            key={inc.id}
            onClick={() => onSelect?.(inc.id)}
            className="absolute group"
            style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {isPending && (
              <span className={`absolute inset-0 rounded-full ${c.dot} animate-pulse-ring`} style={{ width: 28, height: 28, left: -14, top: -14 }} />
            )}
            <div className={`relative w-3.5 h-3.5 rounded-full ${c.dot} border-2 ${isSelected ? 'border-white' : 'border-ink-900'} ${isPending ? 'animate-blip' : ''} transition group-hover:scale-125`}>
              {isPending && <span className="absolute inset-0 rounded-full bg-white/40 animate-ping" />}
            </div>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-[9px] font-mono opacity-0 group-hover:opacity-100 transition bg-ink-900/90 px-1.5 py-0.5 rounded border border-ink-600 z-10">
              <span className={c.text}>{inc.code}</span>
            </div>
          </button>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 bg-ink-900/80 backdrop-blur rounded-lg border border-ink-600 px-3 py-2">
        <div className="text-[9px] font-mono text-ink-400 mb-0.5 tracking-wider">LEGEND</div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300"><div className="w-2.5 h-2.5 rounded-full bg-ember-500" />Dispatch HQ</div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300"><Building2 className="w-2.5 h-2.5 text-signal-500" />Hospital</div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300"><Flame className="w-2.5 h-2.5 text-ember-500" />Fire Station</div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300"><Crosshair className="w-2.5 h-2.5 text-critical-500" />Active Incident</div>
      </div>

      {/* Coordinate readout */}
      <div className="absolute top-3 right-3 bg-ink-900/80 backdrop-blur rounded-lg border border-ink-600 px-3 py-1.5 font-mono text-[10px] text-ink-400">
        <div className="flex items-center gap-1.5"><MapPin className="w-2.5 h-2.5 text-ember-400" />GEO-RADIUS ENGINE</div>
        <div className="text-slate-300 mt-0.5">10km MED / 20km FIRE / 2km VIC</div>
      </div>
    </div>
  );
}
