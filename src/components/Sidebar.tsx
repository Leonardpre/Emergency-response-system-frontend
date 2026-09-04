import { Shield, LayoutDashboard, Siren, MapPin, Radio, ScrollText, Activity, Heart } from 'lucide-react';

export type ViewKey = 'overview' | 'triage' | 'fire' | 'map' | 'media' | 'log';

interface SidebarProps {
  current: ViewKey;
  onNavigate: (v: ViewKey) => void;
  pendingCount: number;
}

const NAV: { key: ViewKey; label: string; icon: typeof Shield; desc: string }[] = [
  { key: 'overview', label: 'Command Overview', icon: LayoutDashboard, desc: 'Live network status' },
  { key: 'triage', label: 'Hospital Triage', icon: Heart, desc: 'Medical intake & dispatch' },
  { key: 'fire', label: 'Fire CAD', icon: Siren, desc: 'Cascading fire protocol' },
  { key: 'map', label: 'Geo Map', icon: MapPin, desc: 'Incident geo-radius view' },
  { key: 'media', label: 'Proof Engine', icon: Radio, desc: 'Async media verification' },
  { key: 'log', label: 'Incident Log', icon: ScrollText, desc: 'Full dispatch history' },
];

export function Sidebar({ current, onNavigate, pendingCount }: SidebarProps) {
  return (
    <aside className="w-64 shrink-0 border-r border-ink-700 bg-ink-900 flex flex-col h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-ink-700">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-ember-500 to-critical-600 flex items-center justify-center shadow-lg shadow-ember-500/20">
            <Shield className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-signal-500 border-2 border-ink-900 animate-blip" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">AIDE CHECK</h1>
            <p className="text-[10px] text-ink-400 font-mono tracking-wider">EMERGENCY NETWORK</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = current === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                active
                  ? 'bg-ember-500/10 border border-ember-500/30'
                  : 'hover:bg-ink-700/50 border border-transparent'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 mt-0.5 shrink-0 ${active ? 'text-ember-400' : 'text-ink-400 group-hover:text-slate-300'}`} style={{ width: 18, height: 18 }} />
              <div className="text-left flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[13px] font-medium ${active ? 'text-white' : 'text-slate-300'}`}>{item.label}</span>
                  {item.key === 'triage' && pendingCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-critical-500 text-white animate-blip">
                      {pendingCount}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-ink-400 leading-tight mt-0.5">{item.desc}</p>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-ink-700">
        <div className="flex items-center gap-2 text-[10px] text-ink-400 font-mono">
          <Activity className="w-3 h-3 text-signal-500 animate-blip" />
          <span>DISPATCHER ONLINE</span>
        </div>
        <div className="mt-2 text-[10px] text-ink-400 font-mono">
          <span className="text-signal-400">●</span> Socket gateway connected
        </div>
      </div>
    </aside>
  );
}
