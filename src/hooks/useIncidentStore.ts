import { useEffect, useRef, useState, useCallback } from 'react';
import type { Incident, IncidentStatus, MediaAttachment } from '@/types';
import { SEED_INCIDENTS, generateIncident } from '@/data/mockData';

export interface IncidentStore {
  incidents: Incident[];
  activeIncident: Incident | null;
  tickerMessages: string[];
  acceptIncident: (id: string, responderId: string) => void;
  declineIncident: (id: string) => void;
  assignResponder: (id: string, responderId: string) => void;
  attachMedia: (id: string, media: MediaAttachment) => void;
  resolveIncident: (id: string) => void;
  selectIncident: (id: string | null) => void;
  clearAlert: () => void;
}

export function useIncidentStore(): IncidentStore {
  const [incidents, setIncidents] = useState<Incident[]>(SEED_INCIDENTS);
  const [activeIncident, setActiveIncident] = useState<Incident | null>(null);
  const [tickerMessages, setTickerMessages] = useState<string[]>([
    'SYSTEM ONLINE — Aide Check Emergency Network operational',
    'Connected to 5 hospitals, 3 fire stations, 4 community volunteers',
    'Geo-radius engine active: 10km medical / 20km fire / 2km vicinity',
  ]);
  const tickRef = useRef<number>(0);

  // Live incident simulation — spawns a new incident every 18s, but not the first 6s
  useEffect(() => {
    const spawn = window.setTimeout(function spawnFirst() {
      const fresh = generateIncident();
      setIncidents((prev) => [fresh, ...prev].slice(0, 50));
      setActiveIncident(fresh);
      setTickerMessages((m) => [
        `NEW ALERT — ${fresh.code} | ${fresh.type.toUpperCase()} | ${fresh.address}`,
        ...m,
      ].slice(0, 12));
    }, 6000);

    const interval = window.setInterval(() => {
      const fresh = generateIncident();
      setIncidents((prev) => [fresh, ...prev].slice(0, 50));
      setActiveIncident(fresh);
      setTickerMessages((m) => [
        `NEW ALERT — ${fresh.code} | ${fresh.type.toUpperCase()} | ${fresh.address}`,
        ...m,
      ].slice(0, 12));
    }, 18000);

    return () => {
      clearTimeout(spawn);
      clearInterval(interval);
    };
  }, []);

  // Elapsed time ticker — updates every second
  useEffect(() => {
    const interval = window.setInterval(() => {
      tickRef.current++;
      setIncidents((prev) =>
        prev.map((inc) =>
          inc.status === 'pending' || inc.status === 'accepted' || inc.status === 'en_route'
            ? { ...inc, elapsedSec: inc.elapsedSec + 1 }
            : inc
        )
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const acceptIncident = useCallback((id: string, responderId: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== id) return inc;
        const responder = inc.candidateResponders.find((r) => r.id === responderId);
        return {
          ...inc,
          status: 'accepted' as IncidentStatus,
          assignedResponder: responder,
          mediaStatus: inc.mediaStatus,
        };
      })
    );
    setTickerMessages((m) => [`ACCEPTED — ${id} dispatched to responder`, ...m].slice(0, 12));
  }, []);

  const declineIncident = useCallback((id: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id ? { ...inc, status: 'rerouted' as IncidentStatus } : inc
      )
    );
    setTickerMessages((m) => [`REROUTED — ${id} declined, reassigning...`, ...m].slice(0, 12));
  }, []);

  const assignResponder = useCallback((id: string, responderId: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== id) return inc;
        const responder = inc.candidateResponders.find((r) => r.id === responderId);
        return { ...inc, status: 'en_route' as IncidentStatus, assignedResponder: responder };
      })
    );
  }, []);

  const attachMedia = useCallback((id: string, media: MediaAttachment) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id
          ? {
              ...inc,
              media: [...inc.media, media],
              mediaStatus: 'media_verified' as Incident['mediaStatus'],
            }
          : inc
      )
    );
    setTickerMessages((m) => [`MEDIA_ATTACHED — ${id} verified: ${media.label}`, ...m].slice(0, 12));
  }, []);

  const resolveIncident = useCallback((id: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: 'resolved' as IncidentStatus } : inc))
    );
    setTickerMessages((m) => [`RESOLVED — ${id} closed by dispatcher`, ...m].slice(0, 12));
  }, []);

  const selectIncident = useCallback((id: string | null) => {
    setIncidents((prev) => {
      if (!id) {
        setActiveIncident(null);
        return prev;
      }
      const found = prev.find((i) => i.id === id);
      if (found && found.status === 'pending') setActiveIncident(found);
      return prev;
    });
  }, []);

  const clearAlert = useCallback(() => {
    setActiveIncident(null);
  }, []);

  return {
    incidents,
    activeIncident,
    tickerMessages,
    acceptIncident,
    declineIncident,
    assignResponder,
    attachMedia,
    resolveIncident,
    selectIncident,
    clearAlert,
  };
}
