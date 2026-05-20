"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import TopHeader from '@/components/dashboard/TopHeader';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';
import AlbumGrid from '@/components/albums/AlbumGrid';
import { supabase } from '@/lib/supabase';

export default function AlbumsPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [albumCount, setAlbumCount] = useState(0);
  const [photoCount, setPhotoCount] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    let canceled = false;

    const checkAuth = async () => {
      const storedUser = localStorage.getItem('bJournalUser');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed?.UserID) {
            if (!canceled) setIsLoggedIn(true);
            if (!canceled) setHasCheckedAuth(true);
            return;
          }
        } catch {
          // ignore
        }
      }

      try {
        const response = await fetch('/api/auth/me', { cache: 'no-store' });
        const payload = await response.json();
        if (payload?.user) {
          localStorage.setItem('bJournalUser', JSON.stringify(payload.user));
          if (!canceled) setIsLoggedIn(true);
        }
      } catch {
        if (!canceled) setIsLoggedIn(false);
      } finally {
        if (!canceled) setHasCheckedAuth(true);
      }
    };

    checkAuth();
    return () => {
      canceled = true;
    };
  }, []);

  const isLocked = hasCheckedAuth && !isLoggedIn;
  const contentReady = hasCheckedAuth && isLoggedIn;

  useEffect(() => {
    const fetchStats = async () => {
      const storedUser = localStorage.getItem('bJournalUser');
      if (!storedUser) {
        setIsLoadingStats(false);
        return;
      }

      let userId: number | null = null;
      try {
        userId = JSON.parse(storedUser).UserID;
      } catch {
        setIsLoadingStats(false);
        return;
      }

      if (!userId) {
        setIsLoadingStats(false);
        return;
      }

      const [albumResult, photoResult] = await Promise.all([
        supabase.from('album').select('AlbumID', { count: 'exact', head: true }).eq('UserID', userId),
        supabase.from('foto').select('FotoID', { count: 'exact', head: true }).eq('UserID', userId)
      ]);

      setAlbumCount(albumResult.count || 0);
      setPhotoCount(photoResult.count || 0);
      setIsLoadingStats(false);
    };

    fetchStats();
  }, []);

  return (
    <div className="w-full relative flex h-screen overflow-y-auto bg-[#f0f0f0]">
      {/* 1. Sidebar Kiri (Desktop) */}
      <Sidebar />

      <main
        className={`md:ml-64 flex-1 min-h-screen pb-24 md:pb-0 w-full overflow-y-auto transition-opacity duration-300 ${
          contentReady ? 'opacity-100' : 'opacity-0'
        } ${isLocked ? 'pointer-events-none blur-[2px] scale-[0.99]' : ''}`}
        aria-hidden={isLocked}
      >
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
              <span className="bg-pitch-black text-white font-label-md px-3 py-1 uppercase tracking-wider border-2 border-pitch-black">
                {isLoadingStats ? 'Albums: ...' : `Albums: ${albumCount}`}
              </span>
              <span className="bg-liverpool-red text-white font-label-md px-3 py-1 uppercase tracking-wider border-2 border-liverpool-red">
                {isLoadingStats ? 'Photos: ...' : `Photos: ${photoCount}`}
              </span>
            </div>
          </div>

          {/* Albums Grid */}
          {contentReady && <AlbumGrid />}
        </div>
      </main>

      {/* 4. Navigasi Bawah (Mobile) */}
      <MobileBottomNav />

      {isLocked && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-5 md:p-8">
          <div className="absolute inset-0 bg-pitch-black/85 backdrop-blur-sm" />
          <div className="absolute inset-0 opacity-25 mix-blend-multiply bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:14px_14px]" />
          <div className="relative w-full max-w-2xl bg-paper-texture border-4 border-pitch-black shadow-[12px_12px_0px_0px_#C8102E] p-6 md:p-8 overflow-hidden">
            <div className="absolute -top-3 -right-10 w-40 h-10 bg-zinc-300/80 rotate-6 border-2 border-pitch-black" />
            <div className="absolute -bottom-6 -left-12 w-44 h-12 bg-zinc-300/80 -rotate-6 border-2 border-pitch-black" />

            <div className="inline-flex items-center gap-2 bg-pitch-black text-white px-3 py-1 border-2 border-pitch-black w-fit uppercase font-black tracking-widest">
              <span className="material-symbols-outlined text-sm">lock</span>
              Members Only
            </div>

            <h2 className="mt-4 text-4xl md:text-5xl font-black uppercase tracking-tighter text-pitch-black">
              Album Locked
            </h2>
            <p className="mt-2 text-sm md:text-base font-bold uppercase tracking-wider text-secondary">
              Login untuk bikin dan kelola album kamu.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push('/login')}
                className="px-5 py-3 border-2 border-pitch-black bg-liverpool-red text-white uppercase font-black tracking-widest hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] transition-all"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-5 py-3 border-2 border-pitch-black bg-white text-pitch-black uppercase font-black tracking-widest hover:bg-stadium-grey transition-colors"
              >
                Back Home
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
              {['Create', 'Edit', 'Manage'].map((label) => (
                <div
                  key={label}
                  className="border-2 border-pitch-black bg-white/80 px-3 py-2 text-xs font-black uppercase tracking-widest text-pitch-black flex items-center justify-between"
                >
                  <span>{label}</span>
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}