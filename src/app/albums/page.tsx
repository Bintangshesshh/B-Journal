import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import TopHeader from '@/components/dashboard/TopHeader';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';
import AlbumGrid from '@/components/albums/AlbumGrid';

export default function AlbumsPage() {
  return (
    <div className="w-full relative flex h-screen overflow-y-auto bg-[#f0f0f0]">
      {/* 1. Sidebar Kiri (Desktop) */}
      <Sidebar />

      <main className="md:ml-64 flex-1 min-h-screen pb-24 md:pb-0 w-full overflow-y-auto">
        {/* 2. Header Atas (Mobile & Desktop) */}
        <TopHeader />

        <div className="p-6 md:p-8 lg:p-12">
          {/* Page Header */}
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-4 border-pitch-black pb-4">
            <div>
              <h2 className="font-headline-lg font-black tracking-tighter uppercase text-4xl sm:text-5xl lg:text-6xl text-pitch-black">
                Album Management
              </h2>
              <p className="font-body-lg font-bold text-liverpool-red mt-2 uppercase tracking-widest">
                Curate Your Visuals
              </p>
            </div>
            <div className="flex gap-2">
              <span className="bg-pitch-black text-white font-label-md px-3 py-1 uppercase tracking-wider border-2 border-pitch-black">Total: 12</span>
              <span className="bg-liverpool-red text-white font-label-md px-3 py-1 uppercase tracking-wider border-2 border-liverpool-red">Storage: 45%</span>
            </div>
          </div>

          {/* Albums Grid */}
          <AlbumGrid />
        </div>
      </main>

      {/* 4. Navigasi Bawah (Mobile) */}
      <MobileBottomNav />
    </div>
  );
}