import { useEffect, useState } from 'react';
import { Radio, Clock, Wifi, ChevronDown } from 'lucide-react';

interface TopBarProps {
  tickerMessages: string[];
}

export function TopBar({ tickerMessages }: TopBarProps) {
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const i = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const timeStr = clock.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const dateStr = clock.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <header className="sticky top-0 z-30 glass border-b border-ink-700">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Radio className="w-4 h-4 text-ember-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-signal-500 animate-blip" />
            </div>
            <span className="text-xs font-mono text-ink-400 tracking-wider">LIVE DISPATCH FEED</span>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-ink-800 border border-ink-600">
            <span className="w-2 h-2 rounded-full bg-signal-500 animate-blip" />
            <span className="text-[10px] font-mono text-slate-300">SOCKET.IO GATEWAY</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-ink-400">
            <Wifi className="w-3.5 h-3.5 text-signal-500" />
            <span>3G/4G</span>
            <span className="text-ink-500">|</span>
            <span>SMS Fallback Ready</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <Clock className="w-3.5 h-3.5 text-ember-400" />
            <span className="text-slate-200">{timeStr}</span>
            <span className="text-ink-400 hidden sm:inline">{dateStr}</span>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ink-800 border border-ink-600 hover:border-ink-500 transition">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-ember-500 to-critical-600 flex items-center justify-center text-[10px] font-bold text-white">
              DS
            </div>
            <span className="text-xs text-slate-300 hidden sm:inline">Dispatcher</span>
            <ChevronDown className="w-3 h-3 text-ink-400" />
          </button>
        </div>
      </div>

      {/* Ticker */}
      <div className="overflow-hidden border-t border-ink-700 bg-ink-950/60 py-1">
        <div className="flex whitespace-nowrap animate-ticker">
          {[...tickerMessages, ...tickerMessages].map((msg, i) => (
            <span key={i} className="px-6 text-[10px] font-mono text-ink-400">
              <span className="text-ember-500 mr-2">▸</span>{msg}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
