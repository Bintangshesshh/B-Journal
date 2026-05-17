import React from 'react';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Yes',
  cancelLabel = 'No',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-pitch-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white border-4 border-pitch-black shadow-[12px_12px_0px_0px_rgba(200,16,46,1)]">
        <div className="absolute -top-3 -left-3 w-20 h-6 bg-zinc-400 opacity-80 -rotate-12 border border-white"></div>
        <div className="p-6">
          <h3 className="text-2xl font-black uppercase text-pitch-black mb-3 tracking-tighter border-b-4 border-pitch-black pb-2">
            {title}
          </h3>
          <p className="font-body-md text-pitch-black mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="bg-stadium-grey px-4 py-2 border-2 border-pitch-black hover:bg-zinc-300 transition-colors text-pitch-black"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="bg-liverpool-red px-5 py-2 border-2 border-pitch-black text-white hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
