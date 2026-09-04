import { useEffect, useState } from 'react';
import type { Incident } from '@/types';
import { typeLabel, typeColor, formatElapsed, formatTime } from '@/lib/format';
import { Siren, X, MapPin, Clock, AlertTriangle, Volume2 } from 'lucide-react';

interface AlertBannerProps {
  incident: Incident | null;
  onDismiss: () => void;
  onOpen: () => void;
}

export function AlertBanner({ incident, onDismiss, onOpen }: AlertBannerProps) {
  const [beep, setBeep] = useState(0);

  useEffect(() => {
    if (!incident || incident.status !== 'pending') return;
    const i = setInterval(() => setBeep((b) => b + 1), 800);
    return () => clearInterval(i);
  }, [incident]);

  if (!incident || incident.status !== 'pending') return null;

  const c = typeColor(incident.type);

  return (
    <div
      key={beep}
      className="animate-flash-red border-y border-critical-400/40 px-6 py-3 cursor-pointer"
      onClick={onOpen}
    >
      <div className="flex items-center justify-between gap-4 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <Siren className="w-6 h-6 text-white animate-blip" />
            <Volume2 className="w-5 h-5 text-white/80" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-white tracking-wider animate-blip">
                INCOMING EMERGENCY — {typeLabel(incident.type).toUpperCase()}
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${c.bg} ${c.border} ${c.text} font-mono`}>
                {incident.code}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-black/30 text-white font-mono uppercase">
                {incident.severity}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-1 text-[11px] text-white/80 font-mono">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{incident.address}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(incident.timestamp)}</span>
              <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{formatElapsed(incident.elapsedSec)} elapsed</span>
            </div>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDismiss(); }}
          className="shrink-0 w-8 h-8 rounded-lg bg-black/20 hover:bg-black/40 flex items-center justify-center text-white/80 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
