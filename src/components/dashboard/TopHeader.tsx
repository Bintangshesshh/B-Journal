"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function TopHeader() {
  const pathname = usePathname();
  const [hasUnread, setHasUnread] = useState(false);
  
  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const readUnreadFlag = () => {
      const stored = localStorage.getItem('bJournalNotifHasUnread');
      setHasUnread(stored === '1');
    };

    const checkUnreadFromDb = async () => {
      const storedUser = localStorage.getItem('bJournalUser');
      if (!storedUser) return;

      let userId: number | null = null;
      try {
        userId = Number(JSON.parse(storedUser).UserID);
      } catch {
        return;
      }

      if (!userId || Number.isNaN(userId)) return;

      const readAtRaw = localStorage.getItem('bJournalNotifReadAt');
      const readAt = readAtRaw ? Number(readAtRaw) : 0;

      const { data: photos } = await supabase
        .from('foto')
        .select('FotoID')
        .eq('UserID', userId);

      const photoIds = (photos || []).map((p: any) => p.FotoID);
      if (photoIds.length === 0) {
        localStorage.setItem('bJournalNotifHasUnread', '0');
        setHasUnread(false);
        return;
      }

      const [likesResult, commentsResult] = await Promise.all([
        supabase
          .from('likefoto')
          .select('FotoID, UserID, TanggalLike')
          .in('FotoID', photoIds),
        supabase
          .from('komentarfoto')
          .select('FotoID, UserID, TanggalKomentar')
          .in('FotoID', photoIds)
      ]);

      const likeUnread = (likesResult.data || []).filter((row: any) => {
        if (Number(row.UserID) === userId) return false;
        const time = row.TanggalLike ? new Date(row.TanggalLike).getTime() : 0;
        return readAt === 0 ? true : time > readAt;
      }).length;

      const commentUnread = (commentsResult.data || []).filter((row: any) => {
        if (Number(row.UserID) === userId) return false;
        const time = row.TanggalKomentar ? new Date(row.TanggalKomentar).getTime() : 0;
        return readAt === 0 ? true : time > readAt;
      }).length;

      const hasUnreadFromDb = likeUnread + commentUnread > 0;
      localStorage.setItem('bJournalNotifHasUnread', hasUnreadFromDb ? '1' : '0');
      setHasUnread(hasUnreadFromDb);
    };

    readUnreadFlag();
    checkUnreadFromDb();

    const onStorage = (event: StorageEvent) => {
      if (event.key === 'bJournalNotifHasUnread') readUnreadFlag();
    };

    const onLocalUpdate = () => readUnreadFlag();
    const onFocus = () => checkUnreadFromDb();
    const interval = window.setInterval(checkUnreadFromDb, 30000);

    window.addEventListener('storage', onStorage);
    window.addEventListener('bjournal-notif-update', onLocalUpdate as EventListener);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('bjournal-notif-update', onLocalUpdate as EventListener);
      window.removeEventListener('focus', onFocus);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <>
      <header className="flex md:hidden justify-between items-center px-4 h-20 border-b-4 border-pitch-black bg-stadium-grey sticky top-0 z-50 shadow-[0_4px_0_0_rgba(200,16,46,1)]">
        <h1 className="text-xl font-black italic text-liverpool-red tracking-widest">B-Journal</h1>
        <div className="flex gap-4">
          <Link 
            href="/notifications" 
            className={`relative transition-all flex items-center justify-center w-10 h-10 border-[3px] border-pitch-black ${
              isActive('/notifications')
                ? 'bg-liverpool-red text-white translate-y-[3px] translate-x-[3px] shadow-none'
                : hasUnread
                  ? 'bg-liverpool-red text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[3px] active:translate-x-[3px] active:shadow-none'
                  : 'text-pitch-black bg-white hover:text-liverpool-red shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[3px] active:translate-x-[3px] active:shadow-none'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]" style={isActive('/notifications') ? { fontVariationSettings: "'FILL' 1" } : {}}>notifications</span>
          </Link>
          <Link 
            href="/settings" 
            className={`relative transition-all flex items-center justify-center w-10 h-10 border-[3px] border-pitch-black ${
              isActive('/settings')
                ? 'bg-liverpool-red text-white translate-y-[3px] translate-x-[3px] shadow-none'
                : 'text-pitch-black bg-white hover:text-liverpool-red shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[3px] active:translate-x-[3px] active:shadow-none'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]" style={isActive('/settings') ? { fontVariationSettings: "'FILL' 1" } : {}}>settings</span>
          </Link>
        </div>
      </header>

      <div className="hidden md:flex justify-between items-center px-8 h-20 w-full border-b-4 border-pitch-black bg-surface-container-lowest sticky top-0 z-30">
        <div className="flex-1 max-w-md relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-tertiary">search</span>
          <input className="w-full bg-stadium-grey border-2 border-transparent focus:border-liverpool-red focus:ring-0 pl-10 py-2 font-body-sm text-pitch-black placeholder:text-tertiary transition-colors" placeholder="Search visual journal..." type="text" />
        </div>
        <div className="flex items-center gap-6">
          <Link 
            href="/notifications" 
            className={`relative transition-all flex items-center justify-center w-12 h-12 border-4 border-pitch-black ${
              isActive('/notifications')
                ? 'bg-liverpool-red text-white translate-y-1 translate-x-1 shadow-none'
                : hasUnread
                  ? 'bg-liverpool-red text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none'
                  : 'text-pitch-black bg-white hover:text-liverpool-red shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(200,16,46,1)] active:translate-y-1 active:translate-x-1 active:shadow-none'
            }`}
          >
            <span className="material-symbols-outlined" style={isActive('/notifications') ? { fontVariationSettings: "'FILL' 1" } : {}}>notifications</span>
          </Link>
          <Link 
            href="/settings" 
            className={`relative transition-all flex items-center justify-center w-12 h-12 border-4 border-pitch-black ${
              isActive('/settings')
                ? 'bg-liverpool-red text-white translate-y-1 translate-x-1 shadow-none'
                : 'text-pitch-black bg-white hover:text-liverpool-red shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(200,16,46,1)] active:translate-y-1 active:translate-x-1 active:shadow-none'
            }`}
          >
            <span className="material-symbols-outlined" style={isActive('/settings') ? { fontVariationSettings: "'FILL' 1" } : {}}>settings</span>
          </Link>
        </div>
      </div>
    </>
  );
}