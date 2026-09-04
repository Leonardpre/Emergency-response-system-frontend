import type { Incident } from '@/types';
import { StatCards } from '@/components/StatCards';
import { GeoMap } from '@/components/GeoMap';
import { IncidentFeed } from '@/components/IncidentFeed';

interface OverviewViewProps {
  incidents: Incident[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function OverviewView({ incidents, selectedId, onSelect }: OverviewViewProps) {
  return (
    <div className="p-4 space-y-4">
      <StatCards incidents={incidents} />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 h-[calc(100vh-16rem)]">
        <div className="rounded-2xl border border-ink-700 bg-ink-900 overflow-hidden">
          <GeoMap incidents={incidents} selectedId={selectedId} onSelect={onSelect} />
        </div>
        <div className="rounded-2xl border border-ink-700 bg-ink-900 overflow-hidden">
          <IncidentFeed incidents={incidents} selectedId={selectedId} onSelect={onSelect} />
        </div>
      </div>
    </div>
  );
}
