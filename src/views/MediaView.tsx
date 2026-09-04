import type { Incident } from '@/types';
import { GeoMap } from '@/components/GeoMap';
import { mediaStatusLabel, typeLabel, typeColor, formatElapsed } from '@/lib/format';
import { Camera, Mic, Video, CheckCircle2, FileText } from 'lucide-react';

interface MediaViewProps {
  incidents: Incident[];
}

export function MediaView({ incidents }: MediaViewProps) {
  const withMedia = incidents.filter((i) => i.media.length > 0 || i.mediaStatus !== 'media_verified');
  return (
    <div className="p-4 space-y-4">
      <div className="rounded-xl border border-info-500/20 bg-info-500/5 px-4 py-3 flex items-center gap-3">
        <span className="text-base">📡</span>
        <div>
          <h2 className="text-sm font-bold text-info-400">Zero-Block Async Proof Engine</h2>
          <p className="text-[11px] text-slate-300">SOS sends instantly — media is attached after without blocking dispatch</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {withMedia.map((inc) => {
          const c = typeColor(inc.type);
          return (
            <div key={inc.id} className="rounded-xl border border-ink-700 bg-ink-900 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-mono font-bold ${c.text}`}>{inc.code}</span>
                  <span className={`px-1.5 py-0.5 text-[9px] font-mono rounded border ${c.bg} ${c.border} ${c.text}`}>{typeLabel(inc.type)}</span>
                </div>
                <span className={`text-[10px] font-mono ${inc.mediaStatus === 'media_verified' ? 'text-signal-400' : 'text-ink-400'}`}>
                  {mediaStatusLabel(inc.mediaStatus)}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate">{inc.address}</p>
              <div className="text-[10px] font-mono text-ink-400">{formatElapsed(inc.elapsedSec)} elapsed</div>
              {inc.media.length > 0 ? (
                <div className="space-y-1.5 pt-1 border-t border-ink-700">
                  {inc.media.map((m, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] font-mono text-slate-300">
                      {m.type === 'photo' && <Camera className="w-3.5 h-3.5 text-info-400" />}
                      {m.type === 'voice' && <Mic className="w-3.5 h-3.5 text-ember-400" />}
                      {m.type === 'video' && <Video className="w-3.5 h-3.5 text-signal-400" />}
                      <span className="flex-1 truncate">{m.label}</span>
                      <span className="text-ink-400">{m.sizeKb}KB</span>
                      <CheckCircle2 className="w-3 h-3 text-signal-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[11px] font-mono text-ink-400 pt-1 border-t border-ink-700">
                  <FileText className="w-3.5 h-3.5" />No media — zero-block initial SOS
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
