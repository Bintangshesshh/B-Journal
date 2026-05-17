"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import TopHeader from '@/components/dashboard/TopHeader';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type TrendingAlbum = {
  id: number;
  title: string;
  interactions: number;
  author: string;
  imgSrc: string | null;
  updatedAt: string | null;
};

export default function TrendingAlbumsPage() {
  const [albums, setAlbums] = useState<TrendingAlbum[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const DEFAULT_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuCpcFlZgPPYv4RXQx9RvyxQovAv_H8nTrJMWFk8amvtB0u9Hgr18YcSxmhoR4tNhqxrILKTnItKO1fG2LNpAlTb2Ga0UpputArMu-uGytY6eUZDPrHLGOrg1LuQ4eV_OShMK2dvaNdOi_jgr41PBZ1bPjBTkGwdTTERs8tSyK54gSAcQVf9JGpycdjw_vYLRmoqaLcscrG9jTHMD8zpSL4Tqof83HKJyVHiwMniwb_bcSEOk5MR9S4ZAc5SUCtK9RuUohcV1rgSOls";

  useEffect(() => {
    const fetchAlbums = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('album')
        .select('AlbumID, NamaAlbum, TanggalDibuat, user(Username), foto(FotoID, LokasiFile)');

      if (error || !data) {
        setIsLoading(false);
        return;
      }

      const photoIdToAlbumId = new Map<number, number>();
      const photoIds: number[] = [];

      data.forEach((item: any) => {
        (item.foto || []).forEach((photo: any) => {
          if (photo?.FotoID) {
            photoIdToAlbumId.set(photo.FotoID, item.AlbumID);
            photoIds.push(photo.FotoID);
          }
        });
      });

      const interactionsByAlbum: Record<number, number> = {};

      if (photoIds.length > 0) {
        const [likeResult, commentResult] = await Promise.all([
          supabase.from('likefoto').select('FotoID').in('FotoID', photoIds),
          supabase.from('komentarfoto').select('FotoID').in('FotoID', photoIds)
        ]);

        (likeResult.data || []).forEach((row: any) => {
          const albumId = photoIdToAlbumId.get(row.FotoID);
          if (!albumId) return;
          interactionsByAlbum[albumId] = (interactionsByAlbum[albumId] || 0) + 1;
        });

        (commentResult.data || []).forEach((row: any) => {
          const albumId = photoIdToAlbumId.get(row.FotoID);
          if (!albumId) return;
          interactionsByAlbum[albumId] = (interactionsByAlbum[albumId] || 0) + 1;
        });
      }

      const normalized = data.map((item: any) => ({
        id: item.AlbumID,
        title: item.NamaAlbum,
        interactions: interactionsByAlbum[item.AlbumID] || 0,
        author: item.user?.Username ? `@${item.user.Username}` : '@unknown',
        imgSrc: item.foto && item.foto.length > 0 ? item.foto[0].LokasiFile : null,
        updatedAt: item.TanggalDibuat || null
      }));

      const sorted = normalized.sort((a, b) => b.interactions - a.interactions);
      setAlbums(sorted);
      setIsLoading(false);
    };

    fetchAlbums();
  }, []);

  const updatedLabel = useMemo(() => {
    const dateValue = albums[0]?.updatedAt ? new Date(albums[0].updatedAt) : new Date();
    return dateValue.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
  }, [albums]);

  return (
    <div className="w-full relative flex h-screen overflow-y-auto">
      {/* 1. Sidebar Kiri (Desktop) */}
      <Sidebar />

      <main className="md:ml-64 flex-1 min-h-screen pb-24 md:pb-0 w-full overflow-y-auto bg-surface-container-lowest">
        {/* 2. Header Atas (Mobile & Desktop) */}
        <TopHeader />

        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          
          {/* Header Banners / Title */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-8 border-pitch-black pb-6 relative">
            <div className="absolute top-2 right-12 w-48 h-8 bg-zinc-400/40 rotate-[-4deg] border-2 border-white/20 z-[-1]"></div>
            <div>
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 font-label-md uppercase font-bold text-pitch-black bg-stadium-grey px-3 py-1 border-2 border-pitch-black hover:bg-liverpool-red hover:text-white mb-6 transition-all shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none w-fit"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Back to Home
              </Link>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-pitch-black">
                Trending.Albums.
              </h1>
              <p className="font-body-lg text-liverpool-red font-bold uppercase tracking-widest mt-2">Top curated collections from the community</p>
            </div>
            <div className="bg-stadium-grey border-4 border-pitch-black px-4 py-2 shadow-[4px_4px_0_0_#C8102E] rotate-1">
              <span className="font-label-lg font-black uppercase text-pitch-black tracking-tighter">Updated: {updatedLabel}</span>
            </div>
          </div>

          {/* Grid Layout Brutalist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-full py-20 text-center font-black text-2xl uppercase tracking-tighter text-pitch-black animate-pulse">
                Loading albums...
              </div>
            ) : albums.length === 0 ? (
              <div className="col-span-full py-20 text-center font-black text-2xl uppercase tracking-tighter text-tertiary border-4 border-pitch-black border-dashed bg-zinc-200">
                No albums yet.
              </div>
            ) : (
              albums.map((album, idx) => (
                <Link 
                  href={`/trending-albums/${album.id}`}
                  key={album.id} 
                  className={`group cursor-pointer bg-stadium-grey border-4 border-pitch-black shadow-[6px_6px_0_0_#C8102E] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:border-liverpool-red flex flex-col block ${idx % 2 !== 0 ? 'md:translate-y-8' : ''}`}
                >
                  {/* Image Cover */}
                  <div className="w-full aspect-square border-b-4 border-pitch-black overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-500">
                    <div className="absolute inset-0 bg-liverpool-red mix-blend-multiply opacity-0 group-hover:opacity-60 transition-opacity z-10 pointer-events-none"></div>
                    {idx % 3 === 0 && <div className="absolute w-20 h-6 bg-zinc-300 mix-blend-difference -top-2 left-4 rotate-12 z-20"></div>}
                    <img alt={album.title} className="w-full h-full object-cover halftone-effect" src={album.imgSrc || DEFAULT_IMAGE} />
                    
                    {/* Floating count badge */}
                    <div className="absolute bottom-4 right-4 bg-pitch-black text-white font-label-md font-bold px-3 py-1 border-2 border-white z-20 uppercase rotate-[-2deg]">
                      {album.interactions} Interactions
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 bg-surface-container-lowest flex-1">
                    <h2 className="font-headline-sm uppercase text-pitch-black group-hover:text-liverpool-red tracking-tight truncate">
                      {album.title}
                    </h2>
                    <p className="font-label-md text-tertiary mt-1 uppercase font-bold">BY {album.author}</p>
                  </div>
                </Link>
              ))
            )}
          </div>

        </div>
      </main>

      {/* Navigasi Bawah (Mobile) */}
      <MobileBottomNav />
    </div>
  );
}