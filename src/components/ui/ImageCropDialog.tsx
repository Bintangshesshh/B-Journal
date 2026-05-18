"use client";

import React, { useEffect, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { getCroppedBlob } from '@/lib/cropImage';

type AspectMode = 'square' | 'original';

type ImageCropDialogProps = {
  open: boolean;
  imageSrc: string | null;
  title?: string;
  aspectMode: AspectMode;
  fileType?: string;
  allowSkip?: boolean;
  confirmLabel?: string;
  skipLabel?: string;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
  onSkip?: () => void;
};

export default function ImageCropDialog({
  open,
  imageSrc,
  title = 'Crop Photo',
  aspectMode,
  fileType = 'image/jpeg',
  allowSkip = false,
  confirmLabel = 'Apply',
  skipLabel = 'Skip',
  onConfirm,
  onCancel,
  onSkip
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [aspect, setAspect] = useState(1);
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    if (!open || !imageSrc) return;
    if (aspectMode === 'square') {
      setAspect(1);
      return;
    }

    const img = new Image();
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      setAspect(Number.isFinite(ratio) && ratio > 0 ? ratio : 1);
    };
    img.src = imageSrc;
  }, [open, imageSrc, aspectMode]);

  useEffect(() => {
    if (!open) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setIsWorking(false);
    }
  }, [open]);

  const handleComplete = (_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  };

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsWorking(true);
    try {
      const blob = await getCroppedBlob(imageSrc, croppedAreaPixels, fileType);
      onConfirm(blob);
    } finally {
      setIsWorking(false);
    }
  };

  if (!open || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-pitch-black/80 backdrop-blur-sm p-4">
      <div className="bg-white border-4 border-pitch-black shadow-[12px_12px_0px_0px_rgba(200,16,46,1)] w-full max-w-3xl">
        <div className="p-4 border-b-4 border-pitch-black flex items-center justify-between">
          <h3 className="font-black uppercase text-pitch-black tracking-widest">{title}</h3>
          <button
            type="button"
            onClick={onCancel}
            className="w-9 h-9 bg-white border-2 border-pitch-black font-black hover:bg-liverpool-red hover:text-white"
          >
            X
          </button>
        </div>

        <div className="relative w-full h-[55vh] bg-pitch-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleComplete}
          />
        </div>

        <div className="p-4 border-t-4 border-pitch-black flex flex-col gap-4">
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-secondary">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="w-full"
            />
          </div>
          <div className="flex justify-end gap-3">
            {allowSkip && onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="bg-stadium-grey px-4 py-2 border-2 border-pitch-black hover:bg-zinc-300 transition-colors text-pitch-black"
              >
                {skipLabel}
              </button>
            )}
            <button
              type="button"
              disabled={isWorking}
              onClick={handleConfirm}
              className="bg-liverpool-red px-5 py-2 border-2 border-pitch-black text-white hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isWorking ? 'Processing...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
