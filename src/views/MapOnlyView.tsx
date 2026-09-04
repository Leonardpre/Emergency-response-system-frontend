import type { Incident } from '@/types';
import { GeoMap } from '@/components/GeoMap';
import { HQ_COORDS } from '@/data/mockData';
import { Building2, Flame, Users, Crosshair } from 'lucide-react';

interface MapOnlyViewProps {
  incidents: Incident[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function MapOnlyView({ incidents, selectedId, onSelect }: MapOnlyViewProps) {
  return (
    <div className="p-4 h-[calc(100vh-8.5rem)] flex flex-col gap-4">
      <div className="flex items-center gap-3 text-[11px] font-mono">
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink-800 border border-ink-600"><Building2 className="w-3 h-3 text-signal-500" />5 Hospitals</span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink-800 border border-ink-600"><Flame className="w-3 h-3 text-ember-500" />3 Fire Stations</span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink-800 border border-ink-600"><Users className="w-3 h-3 text-info-500" />4 Volunteers</span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink-800 border border-ink-600"><Crosshair className="w-3 h-3 text-critical-500" />{incidents.length} Incidents</span>
        <span className="ml-auto text-ink-400">HQ: {HQ_COORDS.lat}°N, {HQ_COORDS.lng}°E</span>
      </div>
      <div className="flex-1 rounded-2xl border border-ink-700 bg-ink-900 overflow-hidden">
        <GeoMap incidents={incidents} selectedId={selectedId} onSelect={onSelect} />
      </div>
    </div>
  );
}
