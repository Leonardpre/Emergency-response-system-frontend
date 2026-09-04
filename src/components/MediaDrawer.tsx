import { useEffect, useRef, useState } from 'react';
import type { Incident, MediaAttachment } from '@/types';
import { X, Camera, Mic, Video, CheckCircle2, Upload, AlertTriangle, SkipForward, GripVertical } from 'lucide-react';

interface MediaDrawerProps {
  incident: Incident;
  onClose: () => void;
  onAttach: (media: MediaAttachment) => void;
}

export function MediaDrawer({ incident, onClose, onAttach }: MediaDrawerProps) {
  const [recording, setRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [attached, setAttached] = useState<MediaAttachment[]>([]);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (recording) {
      timerRef.current = window.setInterval(() => {
        setRecordTime((t) => {
          if (t >= 15) {
            stopRecording();
            return 15;
          }
          return t + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recording]);

  function stopRecording() {
    setRecording(false);
    clearInterval(timerRef.current);
  }

  function handleVoiceRelease() {
    if (!recording || recordTime < 1) {
      stopRecording();
      return;
    }
    stopRecording();
    setUploading(true);
    setTimeout(() => {
      const media: MediaAttachment = {
        type: 'voice',
        sizeKb: Math.min(100, Math.round(recordTime * 6.5)),
        timestamp: new Date().toISOString(),
        label: `voice_note_${attached.length + 1}.amr`,
      };
      setAttached((a) => [...a, media]);
      onAttach(media);
      setUploading(false);
      setRecordTime(0);
    }, 800);
  }

  function handlePhotoCapture() {
    setUploading(true);
    setTimeout(() => {
      const media: MediaAttachment = {
        type: 'photo',
        sizeKb: Math.round(150 + Math.random() * 130),
        timestamp: new Date().toISOString(),
        label: `scene_photo_${attached.length + 1}.jpg`,
      };
      setAttached((a) => [...a, media]);
      onAttach(media);
      setUploading(false);
    }, 1000);
  }

  function handleVideoCapture() {
    setUploading(true);
    setTimeout(() => {
      const media: MediaAttachment = {
        type: 'video',
        sizeKb: Math.round(350 + Math.random() * 180),
        timestamp: new Date().toISOString(),
        label: `clip_${attached.length + 1}.mp4`,
      };
      setAttached((a) => [...a, media]);
      onAttach(media);
      setUploading(false);
    }, 1200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl border border-ink-600 bg-ink-900 shadow-2xl animate-drawer-up overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-ink-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-info-500/10 border border-info-500/30 flex items-center justify-center">
              <Upload className="w-4.5 h-4.5 text-info-400" style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Verification Media</h3>
              <p className="text-[10px] font-mono text-ink-400">Async proof — does not block SOS dispatch</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-ink-700 hover:bg-ink-600 flex items-center justify-center text-slate-300 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Incident ref */}
        <div className="px-5 py-2.5 bg-ink-950/50 border-b border-ink-700">
          <div className="flex items-center gap-2 text-[11px] font-mono text-ink-400">
            <AlertTriangle className="w-3 h-3 text-ember-400" />
            Attaching to <span className="text-ember-400">{incident.code}</span> — {incident.address}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Info banner */}
          <div className="rounded-lg bg-info-500/5 border border-info-500/20 px-3 py-2.5">
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Your SOS has already been sent. You can optionally attach proof media to upgrade this case from
              <span className="text-critical-400"> Unverified </span> to
              <span className="text-signal-400"> Media Verified</span>.
            </p>
          </div>

          {/* Hold-to-record voice */}
          <div className="rounded-xl border border-ink-600 bg-ink-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-ember-400" />
                <span className="text-sm font-medium text-slate-200">Voice Note</span>
                <span className="text-[10px] font-mono text-ink-400">(max 15s, &lt;100KB)</span>
              </div>
              {recording && <span className="text-[11px] font-mono text-critical-400 animate-blip">● REC {recordTime}s</span>}
            </div>

            {/* Waveform */}
            <div className="flex items-center justify-center gap-1 h-16 mb-3">
              {Array.from({ length: 24 }).map((_, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full ${recording ? 'bg-ember-500 animate-waveform' : 'bg-ink-600'}`}
                  style={{
                    height: recording ? `${20 + Math.abs(Math.sin(i + recordTime)) * 60}%` : '20%',
                    animationDelay: `${i * 0.06}s`,
                  }}
                />
              ))}
            </div>

            {/* Hold button */}
            <button
              onMouseDown={() => { setRecording(true); setRecordTime(0); }}
              onMouseUp={handleVoiceRelease}
              onTouchStart={(e) => { e.preventDefault(); setRecording(true); setRecordTime(0); }}
              onTouchEnd={handleVoiceRelease}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition select-none ${
                recording
                  ? 'border-critical-500 bg-critical-500/10 text-critical-400 animate-glow'
                  : 'border-ink-500 bg-ink-700/50 text-slate-300 hover:border-ember-500/50'
              }`}
            >
              <GripVertical className="w-4 h-4" />
              <span className="text-xs font-mono">{recording ? 'RELEASE TO STOP' : 'HOLD TO RECORD'}</span>
              <GripVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Photo + Video */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handlePhotoCapture}
              disabled={uploading}
              className="rounded-xl border border-ink-600 bg-ink-800 p-4 flex flex-col items-center gap-2 hover:border-info-500/40 transition disabled:opacity-50"
            >
              <div className="w-10 h-10 rounded-lg bg-info-500/10 flex items-center justify-center">
                <Camera className="w-5 h-5 text-info-400" />
              </div>
              <span className="text-xs font-medium text-slate-200">Quick Photo</span>
              <span className="text-[9px] font-mono text-ink-400">JPEG &lt;300KB</span>
            </button>
            <button
              onClick={handleVideoCapture}
              disabled={uploading}
              className="rounded-xl border border-ink-600 bg-ink-800 p-4 flex flex-col items-center gap-2 hover:border-signal-500/40 transition disabled:opacity-50"
            >
              <div className="w-10 h-10 rounded-lg bg-signal-500/10 flex items-center justify-center">
                <Video className="w-5 h-5 text-signal-400" />
              </div>
              <span className="text-xs font-medium text-slate-200">Short Video</span>
              <span className="text-[9px] font-mono text-ink-400">10-15s clip</span>
            </button>
          </div>

          {uploading && (
            <div className="flex items-center gap-2 text-[11px] font-mono text-ember-400 animate-pulse">
              <Upload className="w-3.5 h-3.5" />Compressing & uploading...
            </div>
          )}

          {/* Attached list */}
          {attached.length > 0 && (
            <div className="rounded-lg bg-signal-500/5 border border-signal-500/20 p-3">
              <div className="text-[10px] font-mono text-signal-400 tracking-wider mb-2">ATTACHED MEDIA</div>
              <div className="space-y-1.5">
                {attached.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] font-mono text-slate-300">
                    {m.type === 'photo' && <Camera className="w-3 h-3 text-info-400" />}
                    {m.type === 'voice' && <Mic className="w-3 h-3 text-ember-400" />}
                    {m.type === 'video' && <Video className="w-3 h-3 text-signal-400" />}
                    <span>{m.label}</span>
                    <span className="text-ink-400">({m.sizeKb}KB)</span>
                    <CheckCircle2 className="w-3 h-3 text-signal-400 ml-auto" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-ink-700 bg-ink-950/50 flex items-center justify-between">
          <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ink-700 hover:bg-ink-600 text-slate-300 text-xs font-medium transition">
            <SkipForward className="w-4 h-4" />Skip & Close
          </button>
          <span className="text-[10px] font-mono text-ink-400">Alert stays active regardless</span>
        </div>
      </div>
    </div>
  );
}
