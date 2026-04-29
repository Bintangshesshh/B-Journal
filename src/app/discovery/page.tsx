"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';
import DiscoveryFeed from '@/components/discovery/DiscoveryFeed';

export default function DiscoveryPage() {
  const [isZenMode, setIsZenMode] = useState(false);

  return (
    <div className="w-full relative flex h-screen overflow-hidden bg-stadium-grey text-pitch-black bg-grit">
      {/* 1. Sidebar Kiri (Desktop) */}
      {!isZenMode && <Sidebar />}

      {/* Main Content : Immersive Feed */}
      <main className={`${isZenMode ? 'ml-0' : 'ml-0 md:ml-64'} transition-all duration-300 w-full h-screen overflow-hidden bg-black snap-container relative pt-0`}>
        <DiscoveryFeed isZenMode={isZenMode} toggleZenMode={() => setIsZenMode(!isZenMode)} />
      </main>

      {/* Navigasi Bawah (Mobile) */}
      {!isZenMode && <MobileBottomNav />}
    </div>
  );
}