import React, { Suspense } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';
import TopHeader from '@/components/dashboard/TopHeader';
import UploadForm from '@/components/upload/UploadForm';

export default function UploadPage() {
  return (
    <div className="w-full relative flex min-h-screen overflow-hidden bg-[#fff8f7]">
      {/* Texture Overlay */}
      <div className="absolute inset-0 texture-bg pointer-events-none z-0"></div>

      {/* Sidebar Kiri (Desktop) */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 w-full min-h-screen flex flex-col relative z-10 overflow-y-auto">
        <TopHeader />
        
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 pb-24 md:pb-12 h-full">
          <Suspense fallback={<div className="font-black uppercase">Loading...</div>}>
            <UploadForm />
          </Suspense>
        </div>
      </main>

      {/* Navigasi Bawah (Mobile) */}
      <MobileBottomNav />
    </div>
  );
}