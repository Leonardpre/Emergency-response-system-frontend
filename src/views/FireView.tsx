import type { Incident } from '@/types';
import { GeoMap } from '@/components/GeoMap';
import { IncidentFeed } from '@/components/IncidentFeed';

interface FireViewProps {
  incidents: Incident[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function FireView({ incidents, selectedId, onSelect }: FireViewProps) {
  const fireIncidents = incidents.filter((i) => i.type === 'fire');
  return (
    <div className="p-4 space-y-4">
      <div className="rounded-xl border border-ember-500/20 bg-ember-500/5 px-4 py-3 flex items-center gap-3">
        <span className="text-base">🔥</span>
        <div>
          <h2 className="text-sm font-bold text-ember-400">Cascading Fire Protocol</h2>
          <p className="text-[11px] text-slate-300">Tier 1: 20km station search → Tier 2: 2km vicinity community broadcast fallback</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 h-[calc(100vh-18rem)]">
        <div className="rounded-2xl border border-ink-700 bg-ink-900 overflow-hidden">
          <GeoMap incidents={fireIncidents} selectedId={selectedId} onSelect={onSelect} />
        </div>
        <div className="rounded-2xl border border-ink-700 bg-ink-900 overflow-hidden">
          <IncidentFeed incidents={fireIncidents} selectedId={selectedId} onSelect={onSelect} />
        </div>
      </div>
    </div>
  );
}
