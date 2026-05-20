"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';
import DiscoveryFeed from '@/components/discovery/DiscoveryFeed';

export default function DiscoveryPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

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

  return (
    <div className="w-full relative flex h-[100svh] md:h-screen overflow-hidden bg-pitch-black">
      <main
        className={`w-full h-[calc(100svh-64px)] md:h-screen relative transition-opacity duration-300 ${
          contentReady ? 'opacity-100' : 'opacity-0'
        } ${isLocked ? 'overflow-hidden pointer-events-none blur-[2px] scale-[0.99]' : 'snap-container'}`}
        aria-hidden={isLocked}
      >
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
              Discovery Locked
            </h2>
            <p className="mt-2 text-sm md:text-base font-bold uppercase tracking-wider text-secondary">
              Login untuk buka full-screen discovery, like, dan komentar.
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
              {['Like', 'Comment', 'Scrolling'].map((label) => (
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