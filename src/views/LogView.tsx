import type { Incident } from '@/types';
import { typeLabel, typeColor, statusLabel, statusColor, formatElapsed, formatTime, severityColor } from '@/lib/format';
import { MapPin, Clock, CheckCircle2 } from 'lucide-react';

interface LogViewProps {
  incidents: Incident[];
}

export function LogView({ incidents }: LogViewProps) {
  return (
    <div className="p-4">
      <div className="rounded-2xl border border-ink-700 bg-ink-900 overflow-hidden">
        <div className="px-4 py-3 border-b border-ink-700 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Full Dispatch History</h3>
          <span className="text-[10px] font-mono text-ink-400">{incidents.length} entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-ink-800/50 border-b border-ink-700">
              <tr className="text-[10px] font-mono text-ink-400 tracking-wider">
                <th className="px-4 py-2.5">CODE</th>
                <th className="px-4 py-2.5">TYPE</th>
                <th className="px-4 py-2.5">SEVERITY</th>
                <th className="px-4 py-2.5">LOCATION</th>
                <th className="px-4 py-2.5">STATUS</th>
                <th className="px-4 py-2.5">RESPONDER</th>
                <th className="px-4 py-2.5">MEDIA</th>
                <th className="px-4 py-2.5">TIME</th>
                <th className="px-4 py-2.5">ELAPSED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-700/60">
              {incidents.map((inc) => {
                const c = typeColor(inc.type);
                return (
                  <tr key={inc.id} className="text-[11px] hover:bg-ink-700/20 transition">
                    <td className="px-4 py-2.5"><span className={`font-mono font-bold ${c.text}`}>{inc.code}</span></td>
                    <td className="px-4 py-2.5"><span className={`px-1.5 py-0.5 text-[9px] font-mono rounded border ${c.bg} ${c.border} ${c.text}`}>{typeLabel(inc.type)}</span></td>
                    <td className="px-4 py-2.5"><span className={`font-mono font-bold uppercase ${severityColor(inc.severity)}`}>{inc.severity}</span></td>
                    <td className="px-4 py-2.5 text-slate-300 max-w-[200px] truncate"><MapPin className="w-3 h-3 inline mr-1 text-ink-400" />{inc.address}</td>
                    <td className="px-4 py-2.5"><span className={`px-1.5 py-0.5 text-[9px] font-mono rounded border ${statusColor(inc.status)}`}>{statusLabel(inc.status)}</span></td>
                    <td className="px-4 py-2.5 text-slate-300">{inc.assignedResponder?.name ?? '—'}</td>
                    <td className="px-4 py-2.5">
                      {inc.media.length > 0 ? (
                        <span className="flex items-center gap-1 text-signal-400 font-mono"><CheckCircle2 className="w-3 h-3" />{inc.media.length}</span>
                      ) : (
                        <span className="text-ink-400 font-mono">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-ink-400">{formatTime(inc.timestamp)}</td>
                    <td className="px-4 py-2.5 font-mono text-slate-300">{formatElapsed(inc.elapsedSec)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
