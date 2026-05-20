"use client";

import React from 'react';

interface RedirectOverlayProps {
  open: boolean;
  title: string;
  message: string;
  durationMs?: number;
  actionLabel?: string;
  onAction?: () => void;
  cancelLabel?: string;
  onCancel?: () => void;
}

export default function RedirectOverlay({
  open,
  title,
  message,
  durationMs = 1400,
  actionLabel,
  onAction,
  cancelLabel,
  onCancel
}: RedirectOverlayProps) {
  if (!open) return null;

  const progressStyle: React.CSSProperties = {
    ['--redirect-duration' as any]: `${durationMs}ms`
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-pitch-black/80 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-paper-texture border-4 border-pitch-black shadow-[10px_10px_0px_0px_#000] p-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-liverpool-red">autorenew</span>
          <h3 className="text-xl font-black uppercase tracking-widest text-pitch-black">{title}</h3>
        </div>
        <p className="mt-2 text-sm font-bold uppercase tracking-wider text-secondary" aria-live="polite">
          {message}
        </p>

        <div className="mt-4 h-2 border-2 border-pitch-black bg-white overflow-hidden">
          <div className="h-full w-full bg-liverpool-red redirect-progress" style={progressStyle} />
        </div>

        <div className="mt-3 text-[10px] font-black uppercase tracking-widest text-tertiary">
          Memindahkan...
        </div>

        {(onAction || onCancel) && (
          <div className="mt-5 flex items-center justify-end gap-3">
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-3 py-2 border-2 border-pitch-black bg-white text-pitch-black uppercase font-black hover:bg-stadium-grey transition-colors"
              >
                {cancelLabel || 'Nanti'}
              </button>
            )}
            {onAction && (
              <button
                onClick={onAction}
                className="px-3 py-2 border-2 border-pitch-black bg-liverpool-red text-white uppercase font-black hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000] transition-all"
              >
                {actionLabel || 'Lanjut'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
