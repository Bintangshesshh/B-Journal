"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

type FilterType = 'ALL' | 'LIKES' | 'COMMENTS' | 'ALERTS';

export default function NotificationList() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'like' | 'comment' | 'alert';
    read: boolean;
    message: string;
    time: string;
    createdAt?: string | null;
    logId: string;
    userAvatar?: string | null;
    targetImg?: string | null;
    isSystem?: boolean;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('bJournalNotifReadIds');
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) setReadIds(parsed);
    } catch {
      setReadIds([]);
    }
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      const storedUser = localStorage.getItem('bJournalUser');
      if (!storedUser) {
        setIsLoading(false);
        return;
      }

      let userId: number | null = null;
      try {
        userId = JSON.parse(storedUser).UserID;
      } catch {
        setIsLoading(false);
        return;
      }

      if (!userId) {
        setIsLoading(false);
        return;
      }

      const { data: photos } = await supabase
        .from('foto')
        .select('FotoID')
        .eq('UserID', userId);

      const photoIds = (photos || []).map((p: any) => p.FotoID);
      if (photoIds.length === 0) {
        setNotifications([]);
        setIsLoading(false);
        return;
      }

      const [likesResult, commentsResult] = await Promise.all([
        supabase
          .from('likefoto')
          .select('FotoID, UserID, TanggalLike, user(Username), foto(LokasiFile)')
          .in('FotoID', photoIds),
        supabase
          .from('komentarfoto')
          .select('KomentarID, FotoID, UserID, IsiKomentar, TanggalKomentar, user(Username), foto(LokasiFile)')
          .in('FotoID', photoIds)
      ]);

      const formattedLikes = (likesResult.data || []).map((row: any) => ({
        id: `like-${row.FotoID}-${row.UserID}`,
        type: 'like' as const,
        read: false,
        message: `${row.user?.Username ? `@${row.user.Username}` : '@unknown'} liked your photo`,
        time: row.TanggalLike || '',
        createdAt: row.TanggalLike || null,
        logId: `${row.FotoID}`,
        userAvatar: row.foto?.LokasiFile || null,
        targetImg: row.foto?.LokasiFile || null
      }));

      const formattedComments = (commentsResult.data || []).map((row: any) => ({
        id: `comment-${row.KomentarID}`,
        type: 'comment' as const,
        read: false,
        message: `${row.user?.Username ? `@${row.user.Username}` : '@unknown'} commented: "${row.IsiKomentar}"`,
        time: row.TanggalKomentar || '',
        createdAt: row.TanggalKomentar || null,
        logId: `${row.KomentarID}`,
        userAvatar: row.foto?.LokasiFile || null,
        targetImg: row.foto?.LokasiFile || null
      }));

      const combined = [...formattedLikes, ...formattedComments]
        .sort((a, b) => (b.time || '').localeCompare(a.time || ''));

      setNotifications(combined);
      setIsLoading(false);
    };

    fetchNotifications();
  }, []);

  const readIdSet = useMemo(() => new Set(readIds), [readIds]);

  const formattedNotifications = useMemo(() => (
    notifications.map((notif) => ({
      ...notif,
      read: readIdSet.has(notif.id),
      time: notif.time ? new Date(notif.time).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : 'Just now'
    }))
  ), [notifications, readIdSet]);

  const filterOptions = useMemo(() => {
    const counts = formattedNotifications.reduce(
      (acc, item) => ({
        ...acc,
        [item.type]: (acc[item.type] || 0) + 1,
        ALL: (acc.ALL || 0) + 1
      }),
      { ALL: 0, like: 0, comment: 0, alert: 0 } as Record<string, number>
    );

    return [
      { key: 'ALL' as FilterType, label: 'All', count: counts.ALL },
      { key: 'LIKES' as FilterType, label: 'Likes', count: counts.like },
      { key: 'COMMENTS' as FilterType, label: 'Comments', count: counts.comment },
      { key: 'ALERTS' as FilterType, label: 'Alerts', count: counts.alert }
    ].filter(option => option.key === 'ALL' || option.count > 0);
  }, [formattedNotifications]);

  const filteredNotifications = formattedNotifications.filter(notif => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'LIKES') return notif.type === 'like';
    if (activeFilter === 'COMMENTS') return notif.type === 'comment';
    if (activeFilter === 'ALERTS') return notif.type === 'alert';
    return true;
  });

  const unreadCount = formattedNotifications.filter(notif => !notif.read).length;

  useEffect(() => {
    localStorage.setItem('bJournalNotifHasUnread', unreadCount > 0 ? '1' : '0');
    window.dispatchEvent(new Event('bjournal-notif-update'));
  }, [unreadCount]);

  const handleMarkAllRead = () => {
    const ids = formattedNotifications.map((notif) => notif.id);
    localStorage.setItem('bJournalNotifReadIds', JSON.stringify(ids));
    localStorage.setItem('bJournalNotifHasUnread', '0');
    setReadIds(ids);
    window.dispatchEvent(new Event('bjournal-notif-update'));
  };

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {filterOptions.map((filter) => (
          <button 
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`font-black text-sm md:text-lg px-5 py-2 border-3 border-pitch-black shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-0.5 transition-transform uppercase flex items-center gap-2
              ${activeFilter === filter.key 
                ? 'bg-liverpool-red text-white' 
                : 'bg-white text-pitch-black hover:bg-stadium-grey'
              }`}
          >
            <span>{filter.label}</span>
            <span className="text-xs bg-pitch-black text-white px-2 py-0.5 border-2 border-pitch-black">
              {filter.count}
            </span>
          </button>
        ))}
        <button
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          className="font-black text-xs md:text-sm px-4 py-2 border-3 border-pitch-black shadow-[4px_4px_0px_0px_#000000] uppercase bg-white text-pitch-black hover:bg-stadium-grey transition-transform disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed"
        >
          {unreadCount === 0 ? 'All read' : 'Mark all read'}
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-6 md:space-y-8 relative">
        {isLoading && (
           <div className="bg-white border-4 border-pitch-black shadow-[8px_8px_0px_0px_#000000] p-8 text-center text-xl font-bold uppercase ink-bleed-text">
             LOADING.NOTIFICATIONS...
           </div>
        )}

        {!isLoading && filteredNotifications.length === 0 && (
           <div className="bg-white border-4 border-pitch-black shadow-[8px_8px_0px_0px_#000000] p-8 text-center text-xl font-bold uppercase ink-bleed-text">
             No notifications in this category
           </div>
        )}

        {filteredNotifications.map((notif, index) => (
          <div 
            key={notif.id}
            className={`border-4 border-black shadow-[6px_6px_0px_0px_#000000] flex flex-col md:flex-row items-stretch md:items-center p-4 md:p-5 relative group hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform duration-75 
              ${notif.isSystem ? 'bg-[#f2d3d1]' : 'bg-white'} 
              ${!notif.read && !notif.isSystem ? 'overflow-hidden' : ''}`}
          >
            {/* Unread Indicator */}
            {!notif.read && (
              <div className={`absolute left-0 top-0 bottom-0 w-4 border-r-4 border-black hidden md:block ${notif.isSystem ? 'bg-pitch-black' : 'bg-liverpool-red'}`}></div>
            )}
            
            <div className={`md:ml-6 flex items-center gap-4 md:gap-5 flex-1 ${!notif.read ? 'border-l-8 border-liverpool-red pl-4 md:border-none md:pl-0' : ''}`}>
              <div className={`w-12 h-12 md:w-14 md:h-14 border-4 border-black flex items-center justify-center flex-shrink-0 ${notif.type === 'comment' ? 'bg-stadium-grey' : 'bg-white'}`}>
                <span className="material-symbols-outlined text-pitch-black text-2xl">
                  {notif.type === 'comment' ? 'chat_bubble' : notif.type === 'like' ? 'favorite' : 'warning'}
                </span>
              </div>

              <div className="flex-1 min-w-0 pr-2">
                <p className={`text-sm md:text-lg font-black tracking-tight md:tracking-tighter ${notif.isSystem ? 'text-liverpool-red' : 'text-pitch-black'}`}>
                  {notif.message}
                </p>
                <p className="font-['Plus_Jakarta_Sans'] text-xs md:text-sm font-bold opacity-60 mt-1 tracking-wider">
                  {notif.time}
                </p>
              </div>
            </div>

            {notif.targetImg && (
              <div className="hidden md:block w-16 h-16 md:w-20 md:h-20 border-4 border-black overflow-hidden halftone ml-4 flex-shrink-0">
                <img className="w-full h-full object-cover grayscale" src={notif.targetImg} alt="target" />
              </div>
            )}

            {/* Decorative Tape */}
            {index === 0 && <div className="absolute bg-zinc-500 opacity-70 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)] -top-2 -right-4 w-14 h-5 rotate-[15deg]"></div>}
          </div>
        ))}
      </div>

      {/* Footer Meta */}
      <div className="mt-12 md:mt-24 text-center">
        <button className="bg-liverpool-red text-white border-4 border-pitch-black py-4 md:py-6 px-8 md:px-12 text-lg md:text-2xl font-black uppercase shadow-[8px_8px_0px_#000000] md:shadow-[12px_12px_0px_#000000] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all active:scale-95 group">
          <span className="ink-bleed-text">LOAD.OLDER.LOGS</span>
        </button>
        <footer className="mt-8 md:mt-12 text-[10px] md:text-xs font-black opacity-30 uppercase tracking-[0.3em] md:tracking-[0.5em] pb-12 break-words">
          B-JOURNAL // SESSION.REF: 992-X-KLA // NO.RETENTION.POLICY
        </footer>
      </div>
    </>
  );
}