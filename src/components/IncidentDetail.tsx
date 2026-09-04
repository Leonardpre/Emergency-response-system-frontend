import type { Incident, Responder } from '@/types';
import { typeLabel, typeColor, statusLabel, statusColor, formatElapsed, formatTime, severityColor } from '@/lib/format';
import { MapPin, Clock, Phone, User, AlertTriangle, CheckCircle2, XCircle, Navigation, FileText, Camera, Mic, Video } from 'lucide-react';

interface IncidentDetailProps {
  incident: Incident;
  onAccept: (responderId: string) => void;
  onDecline: () => void;
  onResolve: () => void;
  onOpenMedia?: () => void;
}

export function IncidentDetail({ incident, onAccept, onDecline, onResolve, onOpenMedia }: IncidentDetailProps) {
  const c = typeColor(incident.type);
  const isPending = incident.status === 'pending';
  const isActive = incident.status === 'accepted' || incident.status === 'en_route';
  const isResolved = incident.status === 'resolved';

  return (
    <div className="flex flex-col h-full animate-slide-up">
      {/* Header */}
      <div className={`px-5 py-4 border-b border-ink-700 ${c.bg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
              <AlertTriangle className={`w-5 h-5 ${c.text}`} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{typeLabel(incident.type)}</h2>
              <span className={`text-[11px] font-mono ${c.text}`}>{incident.code}</span>
            </div>
          </div>
          <span className={`px-2.5 py-1 text-[10px] font-mono rounded border ${statusColor(incident.status)}`}>
            {statusLabel(incident.status)}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Severity + elapsed */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-ink-800 border border-ink-600 px-3 py-2.5">
            <div className="text-[10px] text-ink-400 font-mono tracking-wider">SEVERITY</div>
            <div className={`text-sm font-bold uppercase ${severityColor(incident.severity)}`}>{incident.severity}</div>
          </div>
          <div className="rounded-lg bg-ink-800 border border-ink-600 px-3 py-2.5">
            <div className="text-[10px] text-ink-400 font-mono tracking-wider">ELAPSED</div>
            <div className="text-sm font-bold text-white font-mono">{formatElapsed(incident.elapsedSec)}</div>
          </div>
        </div>

        {/* Location */}
        <div className="rounded-lg bg-ink-800 border border-ink-600 p-3">
          <div className="text-[10px] text-ink-400 font-mono tracking-wider mb-1.5">LOCATION</div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-ember-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-slate-200">{incident.address}</p>
              <p className="text-[11px] font-mono text-ink-400 mt-0.5">
                {incident.coordinates.lat.toFixed(4)}°N, {incident.coordinates.lng.toFixed(4)}°E
              </p>
            </div>
          </div>
        </div>

        {/* Reporter */}
        <div className="rounded-lg bg-ink-800 border border-ink-600 p-3 space-y-2">
          <div className="text-[10px] text-ink-400 font-mono tracking-wider">CALLER INFO</div>
          <div className="flex items-center gap-2 text-sm text-slate-200">
            <User className="w-3.5 h-3.5 text-ink-400" />{incident.reporterName}
          </div>
          <div className="flex items-center gap-2 text-sm font-mono text-slate-300">
            <Phone className="w-3.5 h-3.5 text-ink-400" />{incident.reporterPhone}
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-ink-400">
            <Clock className="w-3 h-3" />Received {formatTime(incident.timestamp)}
          </div>
        </div>

        {/* Description */}
        <div className="rounded-lg bg-ink-800 border border-ink-600 p-3">
          <div className="text-[10px] text-ink-400 font-mono tracking-wider mb-1.5">SITUATION REPORT</div>
          <p className="text-sm text-slate-200 leading-relaxed">{incident.description}</p>
        </div>

        {/* Responders */}
        <div className="rounded-lg bg-ink-800 border border-ink-600 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] text-ink-400 font-mono tracking-wider">CANDIDATE RESPONDERS</div>
            <span className="text-[10px] font-mono text-ink-400">{incident.candidateResponders.length} found</span>
          </div>
          <div className="space-y-2">
            {incident.candidateResponders.map((r) => (
              <ResponderRow key={r.id} responder={r} assigned={incident.assignedResponder?.id === r.id} onAssign={() => onAccept(r.id)} disabled={!isPending} />
            ))}
            {incident.candidateResponders.length === 0 && (
              <div className="text-[11px] font-mono text-critical-400 py-2">No responders in radius — escalating to vicinity broadcast</div>
            )}
          </div>
        </div>

        {/* Media */}
        <div className="rounded-lg bg-ink-800 border border-ink-600 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] text-ink-400 font-mono tracking-wider">VERIFICATION MEDIA</div>
            <span className={`text-[10px] font-mono ${incident.mediaStatus === 'media_verified' ? 'text-signal-400' : 'text-ink-400'}`}>
              {incident.mediaStatus === 'media_verified' ? '✓ Verified' : 'Unverified'}
            </span>
          </div>
          {incident.media.length > 0 ? (
            <div className="space-y-1.5">
              {incident.media.map((m, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] font-mono text-slate-300">
                  {m.type === 'photo' && <Camera className="w-3 h-3 text-info-400" />}
                  {m.type === 'voice' && <Mic className="w-3 h-3 text-ember-400" />}
                  {m.type === 'video' && <Video className="w-3 h-3 text-signal-400" />}
                  <span>{m.label}</span>
                  <span className="text-ink-400">({m.sizeKb}KB)</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[11px] font-mono text-ink-400">
              <FileText className="w-3 h-3" />No media attached — initial SOS was zero-block
            </div>
          )}
          {onOpenMedia && (
            <button onClick={onOpenMedia} className="mt-2 text-[11px] font-mono text-ember-400 hover:text-ember-300 transition">
              + Attach verification media
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-4 border-t border-ink-700 bg-ink-900/80">
        {isPending && (
          <div className="flex gap-2">
            <button
              onClick={() => incident.candidateResponders[0] && onAccept(incident.candidateResponders[0].id)}
              disabled={incident.candidateResponders.length === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-signal-600 hover:bg-signal-500 text-white text-sm font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4" />Accept & Dispatch
            </button>
            <button
              onClick={onDecline}
              className="px-4 py-2.5 rounded-lg bg-ink-700 hover:bg-ink-600 text-slate-300 text-sm font-medium transition flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />Reroute
            </button>
          </div>
        )}
        {isActive && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Navigation className="w-4 h-4 text-ember-400 animate-blip" />
              <span>En route — ETA <span className="font-mono text-white">{incident.assignedResponder?.etaMin ?? '—'} min</span></span>
            </div>
            <button onClick={onResolve} className="px-4 py-2 rounded-lg bg-signal-600 hover:bg-signal-500 text-white text-xs font-bold transition">
              Mark Resolved
            </button>
          </div>
        )}
        {isResolved && (
          <div className="flex items-center justify-center gap-2 text-sm text-signal-400 font-medium">
            <CheckCircle2 className="w-4 h-4" />Case closed — incident resolved
          </div>
        )}
      </div>
    </div>
  );
}

function ResponderRow({ responder, assigned, onAssign, disabled }: { responder: Responder; assigned: boolean; onAssign: () => void; disabled: boolean }) {
  const kindIcon = responder.kind === 'hospital' ? '🏥' : responder.kind === 'fire_station' ? '🚒' : '👤';
  const kindLabel = responder.kind === 'hospital' ? 'Hospital' : responder.kind === 'fire_station' ? 'Fire Station' : 'Volunteer';

  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-lg border transition ${assigned ? 'border-signal-500/40 bg-signal-500/5' : 'border-ink-600 bg-ink-700/30'}`}>
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="text-base">{kindIcon}</span>
        <div className="min-w-0">
          <div className="text-[12px] text-slate-200 truncate">{responder.name}</div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-ink-400">
            <span>{kindLabel}</span>
            <span>•</span>
            <span>{responder.distanceKm}km</span>
            <span>•</span>
            <span>ETA {responder.etaMin}m</span>
            {responder.capacity !== undefined && <><span>•</span><span>{responder.capacity} cap</span></>}
          </div>
        </div>
      </div>
      {assigned ? (
        <span className="text-[10px] font-mono text-signal-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />ASSIGNED</span>
      ) : (
        <button
          onClick={onAssign}
          disabled={disabled}
          className="text-[10px] font-mono px-2 py-1 rounded bg-ember-500/10 text-ember-400 border border-ember-500/30 hover:bg-ember-500/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          DISPATCH
        </button>
      )}
    </div>
  );
}
