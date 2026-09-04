import type { Incident } from '@/types';
import { IncidentFeed } from '@/components/IncidentFeed';
import { IncidentDetail } from '@/components/IncidentDetail';
import { GeoMap } from '@/components/GeoMap';
import { EmptyState } from '@/components/EmptyState';

interface TriageViewProps {
  incidents: Incident[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onAccept: (incidentId: string, responderId: string) => void;
  onDecline: (incidentId: string) => void;
  onResolve: (incidentId: string) => void;
  onOpenMedia: (incidentId: string) => void;
}

export function TriageView(props: TriageViewProps) {
  const selected = props.incidents.find((i) => i.id === props.selectedId) ?? null;

  return (
    <div className="flex h-[calc(100vh-8.5rem)] gap-4 p-4">
      <div className="w-80 shrink-0 rounded-2xl border border-ink-700 bg-ink-900 overflow-hidden">
        <IncidentFeed
          incidents={props.incidents.filter((i) => i.type === 'medical' || i.type === 'accident')}
          selectedId={props.selectedId}
          onSelect={props.onSelect}
        />
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        <div className="rounded-2xl border border-ink-700 bg-ink-900 overflow-hidden min-h-0">
          <GeoMap incidents={props.incidents} selectedId={props.selectedId} onSelect={props.onSelect} />
        </div>
        <div className="rounded-2xl border border-ink-700 bg-ink-900 overflow-hidden min-h-0">
          {selected ? (
            <IncidentDetail
              incident={selected}
              onAccept={(responderId) => props.onAccept(selected.id, responderId)}
              onDecline={() => props.onDecline(selected.id)}
              onResolve={() => props.onResolve(selected.id)}
              onOpenMedia={() => props.onOpenMedia(selected.id)}
            />
          ) : (
            <EmptyState icon="Heart" title="Select an incident" message="Choose a medical or accident incident from the feed to view triage details and dispatch responders." />
          )}
        </div>
      </div>
    </div>
  );
}
