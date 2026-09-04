import { useState } from 'react';
import { Sidebar, type ViewKey } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { AlertBanner } from '@/components/AlertBanner';
import { FireCADModal } from '@/components/FireCADModal';
import { CitizenEmergencyOverlay } from '@/components/CitizenOverlay';
import { MediaDrawer } from '@/components/MediaDrawer';
import { OverviewView } from '@/views/OverviewView';
import { TriageView } from '@/views/TriageView';
import { FireView } from '@/views/FireView';
import { MapOnlyView } from '@/views/MapOnlyView';
import { MediaView } from '@/views/MediaView';
import { LogView } from '@/views/LogView';
import { useIncidentStore } from '@/hooks/useIncidentStore';
import type { Incident } from '@/types';

export default function App() {
  const store = useIncidentStore();
  const [view, setView] = useState<ViewKey>('overview');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fireModalIncident, setFireModalIncident] = useState<Incident | null>(null);
  const [citizenIncident, setCitizenIncident] = useState<Incident | null>(null);
  const [mediaIncident, setMediaIncident] = useState<string | null>(null);

  // When a new active incident arrives, auto-trigger the right modal
  const activeIncident = store.activeIncident;
  const liveIncident = activeIncident
    ? store.incidents.find((i) => i.id === activeIncident.id) ?? null
    : null;

  // Auto-open fire modals for new fire incidents
  function handleActiveIncidentClick() {
    if (!liveIncident) return;
    if (liveIncident.type === 'fire') {
      if (liveIncident.dispatchTier === 'vicinity') {
        setCitizenIncident(liveIncident);
      } else {
        setFireModalIncident(liveIncident);
      }
    } else {
      setSelectedId(liveIncident.id);
      setView('triage');
    }
  }

  function handleSelectIncident(id: string) {
    setSelectedId(id);
    const inc = store.incidents.find((i) => i.id === id);
    if (inc && inc.type === 'fire' && inc.status === 'pending') {
      if (inc.dispatchTier === 'vicinity') {
        setCitizenIncident(inc);
      } else {
        setFireModalIncident(inc);
      }
    }
  }

  const mediaTarget = mediaIncident ? store.incidents.find((i) => i.id === mediaIncident) ?? null : null;
  const pendingCount = store.incidents.filter((i) => i.status === 'pending' && (i.type === 'medical' || i.type === 'accident')).length;

  return (
    <div className="flex min-h-screen bg-ink-950 text-slate-200">
      <Sidebar current={view} onNavigate={(v) => { setView(v); setSelectedId(null); }} pendingCount={pendingCount} />

      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar tickerMessages={store.tickerMessages} />
        <AlertBanner
          incident={liveIncident}
          onDismiss={store.clearAlert}
          onOpen={handleActiveIncidentClick}
        />

        <main className="flex-1 min-h-0">
          {view === 'overview' && (
            <OverviewView incidents={store.incidents} selectedId={selectedId} onSelect={handleSelectIncident} />
          )}
          {view === 'triage' && (
            <TriageView
              incidents={store.incidents}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onAccept={store.acceptIncident}
              onDecline={store.declineIncident}
              onResolve={store.resolveIncident}
              onOpenMedia={(id) => setMediaIncident(id)}
            />
          )}
          {view === 'fire' && (
            <FireView incidents={store.incidents} selectedId={selectedId} onSelect={handleSelectIncident} />
          )}
          {view === 'map' && (
            <MapOnlyView incidents={store.incidents} selectedId={selectedId} onSelect={handleSelectIncident} />
          )}
          {view === 'media' && <MediaView incidents={store.incidents} />}
          {view === 'log' && <LogView incidents={store.incidents} />}
        </main>
      </div>

      {/* Modals */}
      {fireModalIncident && (
        <FireCADModal
          incident={store.incidents.find((i) => i.id === fireModalIncident.id) ?? fireModalIncident}
          onClose={() => setFireModalIncident(null)}
          onAccept={(responderId) => {
            store.acceptIncident(fireModalIncident.id, responderId);
            setFireModalIncident(null);
          }}
        />
      )}
      {citizenIncident && (
        <CitizenEmergencyOverlay
          incident={store.incidents.find((i) => i.id === citizenIncident.id) ?? citizenIncident}
          onClose={() => setCitizenIncident(null)}
        />
      )}
      {mediaTarget && (
        <MediaDrawer
          incident={mediaTarget}
          onClose={() => setMediaIncident(null)}
          onAttach={(media) => store.attachMedia(mediaTarget.id, media)}
        />
      )}
    </div>
  );
}
