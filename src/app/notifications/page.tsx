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

        {/* Notification Container */}
        <div className="p-4 md:p-8 lg:p-12 flex flex-col gap-6 md:gap-8 max-w-4xl mx-auto w-full relative z-10 pb-24 md:pb-16">
          <div className="relative inline-block w-fit">
            <h1 className="text-3xl md:text-5xl font-black uppercase text-pitch-black mb-2 tracking-tighter ink-bleed-text">Notifications</h1>
            <p className="font-label-md text-secondary uppercase tracking-widest">Likes and comments on your photos</p>
          </div>

          <NotificationList />
        </div>
      </main>

      {/* Navigasi Bawah (Mobile) */}
      <MobileBottomNav />
    </div>
  );
}