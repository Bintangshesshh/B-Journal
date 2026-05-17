"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface TrendingAlbum {
  id: number;
  title: string;
  interactions: number;
  imgSrc: string;
}

export default function TrendingAlbums() {
  const [trendingAlbums, setTrendingAlbums] = useState<TrendingAlbum[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const DEFAULT_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuCpcFlZgPPYv4RXQx9RvyxQovAv_H8nTrJMWFk8amvtB0u9Hgr18YcSxmhoR4tNhqxrILKTnItKO1fG2LNpAlTb2Ga0UpputArMu-uGytY6eUZDPrHLGOrg1LuQ4eV_OShMK2dvaNdOi_jgr41PBZ1bPjBTkGwdTTERs8tSyK54gSAcQVf9JGpycdjw_vYLRmoqaLcscrG9jTHMD8zpSL4Tqof83HKJyVHiwMniwb_bcSEOk5MR9S4ZAc5SUCtK9RuUohcV1rgSOls";

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data, error } = await supabase
          .from('album')
          .select('AlbumID, NamaAlbum, foto(FotoID, LokasiFile)');

        if (error) throw error;
        
        if (data) {
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
            imgSrc: item.foto && item.foto.length > 0 ? item.foto[0].LokasiFile : DEFAULT_IMAGE
          }));

          const sorted = normalized.sort((a, b) => b.interactions - a.interactions);
          const top3 = sorted.slice(0, 3);
          setTrendingAlbums(top3);
        }
      } catch (error) {
        console.error('Error fetching trending albums:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <aside className="hidden xl:block w-80 shrink-0">
      <div className="sticky top-28 border-4 border-pitch-black bg-stadium-grey p-6 shadow-[8px_8px_0_0_#C8102E]">
        <h3 className="font-headline-md text-pitch-black uppercase border-b-4 border-pitch-black pb-2 mb-4 tracking-tighter">Trending Albums</h3>
        <ul className="space-y-4">
          {isLoading ? (
            <li className="animate-pulse flex items-center gap-3">
               <div className="w-12 h-12 border-2 border-pitch-black bg-zinc-300"></div>
               <div>
                  <div className="h-4 bg-zinc-300 w-24 mb-2"></div>
                  <div className="h-3 bg-zinc-300 w-16"></div>
               </div>
            </li>
          ) : trendingAlbums.map((album) => (
            <li key={album.id}>
              <Link href={`/trending-albums/${album.id}`} className="group flex items-center gap-3">
                <div className="w-12 h-12 border-2 border-pitch-black overflow-hidden relative">
                  <div className="absolute inset-0 bg-liverpool-red mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                  <img alt="Album cover" className="w-full h-full object-cover grayscale transition-transform duration-300 group-hover:scale-110" src={album.imgSrc} />
                </div>
                <div>
                  <h4 className="font-label-lg text-pitch-black group-hover:text-liverpool-red transition-colors uppercase font-bold truncate max-w-[150px]">{album.title}</h4>
                  <p className="font-label-md text-secondary border-t-2 border-pitch-black border-dashed mt-1 pt-1 opacity-70">
                    {album.interactions} Interactions
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <Link 
          href="/trending-albums" 
          className="w-full mt-6 bg-surface-container-lowest text-pitch-black font-bold uppercase tracking-widest py-2 border-2 border-pitch-black hover:bg-liverpool-red hover:text-on-primary transition-colors flex justify-center items-center"
        >
          View All
        </Link>
      </div>
    </aside>
  );
}