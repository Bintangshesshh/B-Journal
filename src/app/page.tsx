import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import TopHeader from '@/components/dashboard/TopHeader';
import FeedList from '@/components/dashboard/FeedList';
import TrendingAlbums from '@/components/dashboard/TrendingAlbums';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';

export default function DashboardPage() {
  return (
    <div className="w-full relative flex h-screen overflow-y-auto">
      {/* 1. Sidebar Kiri (Desktop) */}
      <Sidebar />

      <main className="md:ml-64 flex-1 min-h-screen pb-24 md:pb-0 w-full overflow-y-auto">
        {/* 2. Header Atas (Mobile & Desktop) */}
        <TopHeader />

        <div className="p-4 md:p-8 max-w-7xl mx-auto flex gap-8">
          {/* 3. Daftar Feed / Postingan (Tengah) */}
          <FeedList />
          
          {/* 4. Album Trending (Kanan) */}
          <TrendingAlbums />
        </div>
      </main>

      {/* 5. Navigasi Bawah (Mobile) */}
      <MobileBottomNav />
    </div>
  );
}
