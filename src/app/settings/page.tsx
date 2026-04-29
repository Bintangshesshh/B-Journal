import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';
import TopHeader from '@/components/dashboard/TopHeader';
import SettingsForm from '@/components/settings/SettingsForm';

export default function SettingsPage() {
  return (
    <div className="w-full relative flex min-h-screen overflow-hidden bg-stone-100 selection:bg-liverpool-red selection:text-white">
      
      {/* Decorative Overlays */}
      <div className="absolute inset-0 texture-bg pointer-events-none z-0"></div>
      <div className="absolute inset-0 halftone opacity-30 pointer-events-none z-0"></div>
      
      {/* Sidebar Kiri (Desktop) */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 w-full min-h-screen flex flex-col relative z-10 overflow-y-auto">
        <TopHeader />
        
        {/* Decorative Duct Tape for Corners */}
        <div className="fixed top-0 left-0 hidden md:block duck-tape bg-zinc-400 w-32 h-10 -rotate-45 -translate-x-12 -translate-y-4 z-[60] opacity-80 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)] pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 hidden md:block duck-tape bg-zinc-400 w-40 h-12 -rotate-45 translate-x-16 translate-y-6 z-[60] opacity-80 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)] pointer-events-none"></div>

        {/* Content Canvas */}
        <div className="p-4 md:p-8 lg:p-16 flex flex-col max-w-5xl mx-auto w-full relative z-10">
          {/* Header Section */}
          <div className="relative mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase text-pitch-black mb-2 tracking-tighter ink-bleed-text inline-block relative z-10">
              SYSTEM.SETTINGS
            </h1>
            <div className="h-4 w-48 bg-liverpool-red -skew-x-12 mb-8 shadow-[4px_4px_0px_black] relative z-0"></div>
            <div className="absolute bg-zinc-500 opacity-80 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)] w-24 h-6 -top-4 right-0 md:right-10 rotate-3 z-20"></div>
          </div>

          <SettingsForm />
        </div>
      </main>

      {/* Navigasi Bawah (Mobile) */}
      <MobileBottomNav />
    </div>
  );
}