import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';
import TopHeader from '@/components/dashboard/TopHeader';
import NotificationList from '@/components/notifications/NotificationList';

export default function NotificationsPage() {
  return (
    <div className="w-full relative flex min-h-screen overflow-hidden bg-[#f0ede6]">
      {/* Sidebar Kiri (Desktop) */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 w-full min-h-screen flex flex-col relative z-10 overflow-y-auto brutalist-grid">
        <TopHeader />
        
        {/* Floating UI Decoration */}
        <div className="fixed bottom-24 md:bottom-8 right-8 z-50 pointer-events-none">
          <div className="bg-yellow-400 border-4 border-black p-2 md:p-4 font-black md:text-xl shadow-[4px_4px_0px_0px_#000000] -rotate-6 uppercase">
            SYSTEM.STATUS: NOMINAL
          </div>
        </div>

        {/* Decorative Duct Tape for Corners */}
        <div className="fixed top-0 left-0 hidden md:block duck-tape bg-zinc-400 w-32 h-10 -rotate-45 -translate-x-12 -translate-y-4 z-[60] opacity-80 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)]"></div>
        <div className="fixed bottom-0 right-0 hidden md:block duck-tape bg-zinc-400 w-40 h-12 -rotate-45 translate-x-16 translate-y-6 z-[60] opacity-80 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)]"></div>

        {/* Notification Container */}
        <div className="p-4 md:p-8 lg:p-16 flex flex-col gap-8 md:gap-12 max-w-5xl mx-auto w-full relative z-10 pb-28 md:pb-16">
          <div className="relative inline-block w-fit">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase text-pitch-black mb-2 tracking-tighter ink-bleed-text">SYSTEM.NOTIFICATIONS</h1>
            <div className="h-4 w-48 bg-liverpool-red -skew-x-12 mb-8 shadow-[4px_4px_0px_black]"></div>
            <div className="absolute bg-zinc-500 opacity-80 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)] w-24 h-6 -top-4 right-0 md:-right-10 rotate-3"></div>
          </div>

          <NotificationList />
        </div>
      </main>

      {/* Navigasi Bawah (Mobile) */}
      <MobileBottomNav />
    </div>
  );
}