import { Shield, Radio } from 'lucide-react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
}

export function EmptyState({ icon = 'Shield', title, message }: EmptyStateProps) {
  const Icon = icon === 'Radio' ? Radio : Shield;
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-ink-700/50 border border-ink-600 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-ink-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-300 mb-1">{title}</h3>
      <p className="text-xs text-ink-400 max-w-xs leading-relaxed">{message}</p>
    </div>
  );
}
