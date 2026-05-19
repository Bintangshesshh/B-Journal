"use client";

import React from 'react';

interface LoginPromptProps {
  open: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onLogin: () => void;
}

export default function LoginPrompt({
  open,
  title = 'Login dulu?',
  message = 'Login untuk akses fitur penuh.',
  onClose,
  onLogin
}: LoginPromptProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-pitch-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white border-4 border-pitch-black p-6 shadow-[8px_8px_0px_0px_#000]">
        <h3 className="text-2xl font-black uppercase tracking-widest text-pitch-black">
          {title}
        </h3>
        <p className="mt-2 text-sm font-bold uppercase tracking-wider text-secondary">
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border-2 border-pitch-black bg-white text-pitch-black uppercase font-black hover:bg-stadium-grey transition-colors"
          >
            Nanti
          </button>
          <button
            onClick={onLogin}
            className="px-4 py-2 border-2 border-pitch-black bg-liverpool-red text-white uppercase font-black hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000] transition-all"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
