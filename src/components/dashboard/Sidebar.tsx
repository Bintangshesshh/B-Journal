"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  const [user, setUser] = useState<{ username: string; avatarUrl: string | null } | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem('bJournalUser');
      if (!storedUser) return;

      let userId: number | null = null;
      let fallbackUsername = 'user';
      try {
        const parsedUser = JSON.parse(storedUser);
        userId = parsedUser.UserID;
        fallbackUsername = parsedUser.Username || fallbackUsername;
      } catch {
        return;
      }

      if (!userId) return;

      const { data: userData } = await supabase
        .from('user')
        .select('Username, FotoProfil')
        .eq('UserID', userId)
        .single();

      setUser({
        username: userData?.Username || fallbackUsername,
        avatarUrl: userData?.FotoProfil || null
      });
    };

    loadUser();
  }, []);

  return (
    <aside className="hidden md:flex flex-col p-6 z-50 h-screen w-64 border-r-8 border-pitch-black fixed left-0 top-0 shadow-[10px_0px_0px_0px_rgba(0,0,0,0.1)] bg-grit bg-white">
      <div className="border-4 border-pitch-black p-4 mb-6 relative rotate-1 shadow-[4px_4px_0px_0px_rgba(200,16,46,1)] bg-white">
        <h1 className="text-3xl font-black italic text-pitch-black tracking-tighter uppercase leading-none">B-Journal</h1>
        <p className="font-label-md text-label-md text-liverpool-red font-bold uppercase mt-1">Photography Journal</p>
      </div>

      <nav className="flex-1 space-y-4 mt-4 font-['Plus_Jakarta_Sans'] uppercase tracking-tighter font-black">
        <Link 
          href="/" 
          className={`group flex items-center gap-3 p-2 transition-all border-2 border-transparent hover:border-pitch-black hover:-rotate-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
            isActive('/') 
              ? 'bg-liverpool-red text-white border-pitch-black -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative' 
              : 'hover:bg-liverpool-red hover:text-white text-pitch-black'
          }`}
        >
          {isActive('/') && <div className="absolute -left-2 -top-4 w-12 h-6 bg-zinc-300/60 -rotate-45 z-10 transition-none pointer-events-none"></div>}
          <span className="material-symbols-outlined text-2xl relative z-20" style={isActive('/') ? { fontVariationSettings: "'FILL' 1" } : {}}>home</span>
          <span className="text-lg relative z-20">Home</span>
        </Link>
        <Link 
          href="/discovery" 
          className={`group flex items-center gap-3 p-2 transition-all border-2 border-transparent hover:border-pitch-black hover:-rotate-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
            isActive('/discovery') 
              ? 'bg-liverpool-red text-white border-pitch-black -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative' 
              : 'hover:bg-liverpool-red hover:text-white text-pitch-black'
          }`}
        >
          {isActive('/discovery') && <div className="absolute -left-2 -top-4 w-12 h-6 bg-zinc-300/60 -rotate-45 z-10 transition-none pointer-events-none"></div>}
          <span className="material-symbols-outlined text-2xl relative z-20" style={isActive('/discovery') ? { fontVariationSettings: "'FILL' 1" } : {}}>explore</span>
          <span className="text-lg relative z-20">Discovery</span>
        </Link>
        <Link 
          href="/albums" 
          className={`group flex items-center gap-3 p-2 transition-all border-2 border-transparent hover:border-pitch-black hover:-rotate-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
            isActive('/albums') 
              ? 'bg-liverpool-red text-white border-pitch-black -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative' 
              : 'hover:bg-liverpool-red hover:text-white text-pitch-black'
          }`}
        >
          {isActive('/albums') && <div className="absolute -left-2 -top-4 w-12 h-6 bg-zinc-300/60 -rotate-45 z-10 transition-none pointer-events-none"></div>}
          <span className="material-symbols-outlined text-2xl relative z-20" style={isActive('/albums') ? { fontVariationSettings: "'FILL' 1" } : {}}>library_books</span>
          <span className="text-lg relative z-20">My Albums</span>
        </Link>
        <Link 
          href="/upload" 
          className={`group flex items-center gap-3 p-2 transition-all border-2 border-transparent hover:border-pitch-black hover:-rotate-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
            isActive('/upload') 
              ? 'bg-liverpool-red text-white border-pitch-black -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative' 
              : 'hover:bg-liverpool-red hover:text-white text-pitch-black'
          }`}
        >
          {isActive('/upload') && <div className="absolute -left-2 -top-4 w-12 h-6 bg-zinc-300/60 -rotate-45 z-10 transition-none pointer-events-none"></div>}
          <span className="material-symbols-outlined text-2xl relative z-20" style={isActive('/upload') ? { fontVariationSettings: "'FILL' 1" } : {}}>add_a_photo</span>
          <span className="text-lg relative z-20">Upload</span>
        </Link>
      </nav>

      <div className="mt-auto pt-6">
        <Link 
          href="/profile"
          className={`w-full flex items-center gap-4 p-4 font-black uppercase tracking-tighter text-xl transition-all border-4 border-pitch-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none group ${
            isActive('/profile')
              ? 'bg-liverpool-red text-white -rotate-1'
              : 'bg-white hover:bg-stadium-grey text-pitch-black'
          }`}
        >
          {isActive('/profile') && <div className="absolute -left-2 -top-4 w-12 h-6 bg-zinc-300/60 -rotate-45 z-10 transition-none pointer-events-none"></div>}
          <div className="w-12 h-12 rounded-full border-2 border-pitch-black bg-white flex-shrink-0 relative z-20 overflow-hidden">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-full h-full object-contain"
              />
            ) : null}
          </div>
          <span className="relative z-20">{user ? `@${user.username}` : 'My Profile'}</span>
        </Link>
      </div>
    </aside>
  );
}