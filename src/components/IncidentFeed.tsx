import type { Incident } from '@/types';
import { typeLabel, typeColor, statusLabel, statusColor, formatElapsed, formatTime, severityColor } from '@/lib/format';
import { MapPin, Clock, ChevronRight, CheckCircle2, Radio } from 'lucide-react';

interface IncidentFeedProps {
  incidents: Incident[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

export function IncidentFeed({ incidents, selectedId, onSelect }: IncidentFeedProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-ink-700">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-ember-400" />
          <h3 className="text-sm font-semibold text-white">Live Incident Feed</h3>
        </div>
        <span className="text-[10px] font-mono text-ink-400">{incidents.length} records</span>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-ink-700/60">
        {incidents.map((inc) => {
          const c = typeColor(inc.type);
          const isSelected = inc.id === selectedId;
          const isPending = inc.status === 'pending';
          return (
            <button
              key={inc.id}
              onClick={() => onSelect?.(inc.id)}
              className={`w-full text-left px-4 py-3 transition-all hover:bg-ink-700/30 ${isSelected ? 'bg-ember-500/5 border-l-2 border-l-ember-500' : 'border-l-2 border-l-transparent'}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-mono font-bold ${c.text}`}>{inc.code}</span>
                    <span className={`px-1.5 py-0.5 text-[9px] font-mono rounded border ${c.bg} ${c.border} ${c.text}`}>{typeLabel(inc.type)}</span>
                    <span className={`px-1.5 py-0.5 text-[9px] font-mono rounded border ${statusColor(inc.status)}`}>{statusLabel(inc.status)}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1.5 truncate">{inc.address}</p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-ink-400">
                    <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{inc.coordinates.lat.toFixed(4)}, {inc.coordinates.lng.toFixed(4)}</span>
                    <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{formatElapsed(inc.elapsedSec)}</span>
                    {inc.mediaStatus === 'media_verified' && (
                      <span className="flex items-center gap-1 text-signal-400"><CheckCircle2 className="w-2.5 h-2.5" />Verified</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-[9px] font-mono uppercase font-bold ${severityColor(inc.severity)}`}>{inc.severity}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-ink-400" />
                </div>
              </div>
              {isPending && (
                <div className="mt-2 flex items-center gap-1.5 text-[9px] font-mono text-critical-400 animate-blip">
                  <span className="w-1.5 h-1.5 rounded-full bg-critical-500" />AWAITING DISPATCH
                </div>
              )}
            </button>
          );
        })}
        {incidents.length === 0 && (
          <div className="px-4 py-12 text-center text-ink-400 text-xs font-mono">No incidents in feed</div>
        )}
      </div>
    </div>
  );
}
