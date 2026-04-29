import React from "react";
import { DuctTape } from "./DuctTape";

export const LeftPhotoPanel = ({
  imageUrl,
  titleTop,
  titleBottom,
  subtitle
}: {
  imageUrl: string;
  titleTop: string;
  titleBottom: string;
  subtitle: string;
}) => (
  <div className="relative w-full md:w-7/12 h-[30vh] md:h-screen bg-pitch-black border-b-8 md:border-b-0 md:border-r-8 border-pitch-black z-10 distressed hidden md:flex">
    <img
      alt="Brutalist Architecture"
      className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 opacity-70"
      src={imageUrl} 
    />
    <div className="absolute inset-0 bg-liverpool-red mix-blend-multiply opacity-50"></div>
    <div className="absolute inset-0 bg-gradient-to-t from-pitch-black/80 to-transparent"></div>
    <div className="absolute inset-0 halftone-overlay"></div>
    
    <div className="relative z-10 m-auto p-8 bg-paper-texture border-[8px] border-pitch-black shadow-[16px_16px_0px_0px_#C8102E] transform -rotate-2 distressed max-w-lg hover:rotate-0 transition-transform">
      <DuctTape className="-top-3 -left-5 w-16 h-6 transform -rotate-12" />
      <DuctTape className="-bottom-3 -right-5 w-16 h-6 transform rotate-12" />
      <h2 className="text-5xl md:text-6xl font-black text-pitch-black mb-4 uppercase leading-none tracking-tighter relative z-10">
        {titleTop}<br/>{titleBottom}
      </h2>
      <p className="text-2xl font-bold text-liverpool-red uppercase">{subtitle}</p>
    </div>
  </div>
);
