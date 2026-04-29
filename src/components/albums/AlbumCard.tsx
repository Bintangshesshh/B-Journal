import React from 'react';

interface AlbumCardProps {
  title: string;
  photoCount: number;
  updateTime: string;
  imgSrc: string;
  tapeStyle?: React.CSSProperties;
  titleBgColor?: string;
  titleTextColor?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function AlbumCard({
  title,
  photoCount,
  updateTime,
  imgSrc,
  tapeStyle,
  titleBgColor = "bg-white",
  titleTextColor = "text-pitch-black",
  onEdit,
  onDelete
}: AlbumCardProps) {
  return (
    <div className="distressed-card group relative aspect-[4/3] flex flex-col bg-stone-100">
      {tapeStyle && <div className="duct-tape-sm" style={tapeStyle}></div>}
      <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/0 transition-colors"></div>
      
      <img 
        alt={`${title} Album`} 
        className="w-full h-full object-cover absolute inset-0 halftone-img" 
        src={imgSrc} 
      />
      
      <div className="relative z-20 p-4 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <span className={`${titleBgColor} ${titleTextColor} px-2 py-1 font-label-md font-bold uppercase border-2 border-pitch-black`}>
            {title}
          </span>
          <div className="flex gap-2">
            <button onClick={onEdit} className="bg-white/90 p-1 border-2 border-pitch-black hover:bg-liverpool-red hover:text-white transition-colors" title="Edit Album">
              <span className="material-symbols-outlined text-base">edit</span>
            </button>
            <button onClick={onDelete} className="bg-white/90 p-1 border-2 border-pitch-black hover:bg-liverpool-red hover:text-white transition-colors" title="Delete Album">
              <span className="material-symbols-outlined text-base">delete</span>
            </button>
          </div>
        </div>
        
        <div className="bg-pitch-black text-white p-2 inline-block self-start border-l-4 border-liverpool-red mt-auto shadow-lg">
          <p className="font-label-md">Photos: {photoCount}</p>
          <p className="font-label-md text-gray-400">Upd: {updateTime}</p>
        </div>
      </div>
    </div>
  );
}