"use client";

import React from 'react';
import Link from 'next/link';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';
import DiscoveryFeed from '@/components/discovery/DiscoveryFeed';

export default function DiscoveryPage() {
  return (
    <div className="w-full relative flex h-[100svh] md:h-screen overflow-hidden bg-pitch-black">
      <main className="w-full h-[calc(100svh-64px)] md:h-screen snap-container relative">
        <DiscoveryFeed />
      </main>

      <div className="absolute top-0 left-0 w-full z-30 p-4 md:p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="bg-white text-pitch-black border-2 border-pitch-black px-3 py-1 font-black uppercase tracking-wider hover:bg-liverpool-red hover:text-white transition-colors"
          >
            Back Home
          </Link>
          <div className="bg-white text-pitch-black border-2 border-pitch-black px-3 py-1 font-black uppercase tracking-wider hidden sm:block">
            Discovery
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}