import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';
import TopHeader from '@/components/dashboard/TopHeader';
import ProfilePhoto from '@/components/profile/ProfilePhoto';
import ProfileForm from '@/components/profile/ProfileForm';

export default function ProfilePage() {
  return (
    <div className="w-full relative flex min-h-screen overflow-hidden bg-surface-container-lowest">
      {/* Sidebar Kiri (Desktop) */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 w-full min-h-screen flex flex-col relative z-10 overflow-y-auto industrial-grid">
        <TopHeader />
        
        <div className="w-full p-4 md:p-12 max-w-7xl mx-auto flex-1">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Left Side: Photo area */}
            <div className="w-full lg:w-1/2 flex flex-col items-center">
              <ProfilePhoto />
            </div>
            
            {/* Right Side: Form area */}
            <div className="w-full lg:w-1/2 relative bg-grit">
              <ProfileForm />
            </div>
          </div>
        </div>
      </main>

      {/* Navigasi Bawah (Mobile) */}
      <MobileBottomNav />
    </div>
  );
}
