"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-stadium-grey border-t-4 border-pitch-black flex justify-around items-center py-3 px-4 z-50 shadow-[0_-4px_0_0_rgba(200,16,46,1)]">
      <Link href="/" className={`flex flex-col items-center gap-1 transition-colors font-black decoration-4 ${isActive('/') ? 'text-liverpool-red' : 'text-pitch-black hover:text-liverpool-red'}`}>
        <span className="material-symbols-outlined" style={isActive('/') ? { fontVariationSettings: "'FILL' 1" } : {}}>home</span>
      </Link>
      <Link href="/discovery" className={`flex flex-col items-center gap-1 transition-colors font-black decoration-4 ${isActive('/discovery') ? 'text-liverpool-red' : 'text-pitch-black hover:text-liverpool-red'}`}>
        <span className="material-symbols-outlined" style={isActive('/discovery') ? { fontVariationSettings: "'FILL' 1" } : {}}>explore</span>
      </Link>
      <Link href="/albums" className={`flex flex-col items-center gap-1 transition-colors font-black decoration-4 ${isActive('/albums') ? 'text-liverpool-red' : 'text-pitch-black hover:text-liverpool-red'}`}>
        <span className="material-symbols-outlined" style={isActive('/albums') ? { fontVariationSettings: "'FILL' 1" } : {}}>library_books</span>
      </Link>
      <Link href="/upload" className={`flex flex-col items-center gap-1 transition-colors font-black decoration-4 ${isActive('/upload') ? 'text-liverpool-red' : 'text-pitch-black hover:text-liverpool-red'}`}>
        <span className="material-symbols-outlined" style={isActive('/upload') ? { fontVariationSettings: "'FILL' 1" } : {}}>add_a_photo</span>
      </Link>
      <Link href="/profile" className={`flex flex-col items-center gap-1 transition-colors font-black decoration-4 ${isActive('/profile') ? 'text-liverpool-red' : 'text-pitch-black hover:text-liverpool-red'}`}>
        <span className="material-symbols-outlined" style={isActive('/profile') ? { fontVariationSettings: "'FILL' 1" } : {}}>account_circle</span>
      </Link>
    </nav>
  );
}