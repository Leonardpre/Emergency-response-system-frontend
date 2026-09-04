import type { Incident } from '@/types';
import { Siren, Heart, Flame, Shield, Activity, Radio } from 'lucide-react';

interface StatCardsProps {
  incidents: Incident[];
}

export function StatCards({ incidents }: StatCardsProps) {
  const active = incidents.filter((i) => i.status === 'pending' || i.status === 'accepted' || i.status === 'en_route').length;
  const pending = incidents.filter((i) => i.status === 'pending').length;
  const resolved = incidents.filter((i) => i.status === 'resolved').length;
  const verified = incidents.filter((i) => i.mediaStatus === 'media_verified').length;
  const medical = incidents.filter((i) => i.type === 'medical').length;
  const fire = incidents.filter((i) => i.type === 'fire').length;

  const cards = [
    { label: 'Active Incidents', value: active, icon: Siren, color: 'text-critical-400', bg: 'bg-critical-500/10', border: 'border-critical-500/20', pulse: active > 0 },
    { label: 'Awaiting Dispatch', value: pending, icon: Radio, color: 'text-ember-400', bg: 'bg-ember-500/10', border: 'border-ember-500/20', pulse: pending > 0 },
    { label: 'Medical SOS', value: medical, icon: Heart, color: 'text-signal-400', bg: 'bg-signal-500/10', border: 'border-signal-500/20', pulse: false },
    { label: 'Fire Alerts', value: fire, icon: Flame, color: 'text-ember-400', bg: 'bg-ember-500/10', border: 'border-ember-500/20', pulse: false },
    { label: 'Media Verified', value: verified, icon: Shield, color: 'text-info-400', bg: 'bg-info-500/10', border: 'border-info-500/20', pulse: false },
    { label: 'Resolved Today', value: resolved, icon: Activity, color: 'text-signal-400', bg: 'bg-signal-500/10', border: 'border-signal-500/20', pulse: false },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.label} className={`relative rounded-xl border ${c.border} ${c.bg} p-4 overflow-hidden group hover:scale-[1.02] transition`}>
            {c.pulse && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-current animate-blip opacity-60" />}
            <div className="flex items-center justify-between mb-2">
              <Icon className={`w-4 h-4 ${c.color}`} />
            </div>
            <div className={`text-2xl font-bold ${c.color} font-mono`}>{c.value}</div>
            <div className="text-[10px] text-ink-400 font-mono mt-0.5 tracking-wider">{c.label.toUpperCase()}</div>
          </div>
        );
      })}
    </div>
  );
}
