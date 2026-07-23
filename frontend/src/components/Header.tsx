import { Play } from 'lucide-react';

export function Header() {
  return (
    <header className="relative w-full py-8 px-4 flex flex-col items-center justify-center border-b border-slate-900 bg-slate-950/40 backdrop-blur-md">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-indigo-500/10 blur-2xl rounded-full pointer-events-none" />
      
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
          <Play className="w-6 h-6 fill-indigo-400/10" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent">
          S3Streamer
        </h1>
      </div>
      <p className="mt-2 text-sm text-slate-400 font-medium tracking-wide">
        Immersive, high-performance AWS S3 video catalog and streaming
      </p>
    </header>
  );
}
