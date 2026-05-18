"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/dashboard/Sidebar';
import TopHeader from '@/components/dashboard/TopHeader';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';
import PhotoModal from '@/components/ui/PhotoModal';
import { supabase } from '@/lib/supabase';

type AlbumPhoto = {
  FotoID: number;
  JudulFoto: string;
  DeskripsiFoto: string;
  LokasiFile: string;
};

type AlbumDetail = {
  id: number;
  title: string;
  author: string;
  count: number;
  photos: AlbumPhoto[];
};

export default function AlbumDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [album, setAlbum] = useState<AlbumDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<AlbumPhoto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { id } = React.use(params);
  const albumId = useMemo(() => Number(id), [id]);

  useEffect(() => {
    const fetchAlbum = async () => {
      if (!albumId || Number.isNaN(albumId)) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const { data, error } = await supabase
        .from('album')
        .select('AlbumID, NamaAlbum, user(Username), foto(FotoID, JudulFoto, DeskripsiFoto, LokasiFile)')
        .eq('AlbumID', albumId)
        .single();

      if (error || !data) {
        setIsLoading(false);
        return;
      }

      const albumUser = Array.isArray(data.user) ? data.user[0] : data.user;

      setAlbum({
        id: data.AlbumID,
        title: data.NamaAlbum,
        author: albumUser?.Username ? `@${albumUser.Username}` : '@unknown',
        count: data.foto?.length || 0,
        photos: data.foto || []
      });
      setIsLoading(false);
    };

    fetchAlbum();
  }, [albumId]);

  const handleOpenModal = (post: AlbumPhoto) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  return (
    <div className="w-full relative flex h-screen overflow-y-auto">
      {/* 1. Sidebar Kiri (Desktop) */}
      <Sidebar />

      <main className="md:ml-64 flex-1 min-h-screen pb-24 md:pb-0 w-full overflow-y-auto bg-surface-container-lowest">
        {/* 2. Header Atas */}
        <TopHeader />

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Header Album */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 pb-6 border-b-8 border-pitch-black relative">
            <div className="duct-tape w-32 h-8 -top-4 -right-4 -rotate-6"></div>
            
            <div className="w-full relative">
              <Link 
                href="/trending-albums" 
                className="inline-flex items-center gap-2 font-label-md uppercase font-bold text-pitch-black bg-stadium-grey px-3 py-1 border-2 border-pitch-black hover:bg-liverpool-red hover:text-white mb-6 transition-all shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none w-fit"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Back to Albums
              </Link>
              <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 w-full">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black italic upperca se tracking-tighter text-pitch-black">
                    {album ? album.title : 'Album'}
                  </h1>
                  <p className="font-body-lg text-secondary uppercase font-bold mt-2 tracking-widest">
                    {album ? (
                      <>By <span className="text-liverpool-red underline decoration-2 decoration-pitch-black underline-offset-4 cursor-pointer hover:bg-pitch-black hover:text-white transition-colors">{album.author}</span> • {album.count} Captures</>
                    ) : (
                      'Loading album...'
                    )}
                  </p>
                </div>
                
              </div>
            </div>
          </div>

          {/* Full Grid Content (Mirip feed tapi melebar karena gak ada sidebar kanan) */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {isLoading ? (
              <div className="col-span-full py-20 text-center font-black text-2xl uppercase tracking-tighter text-pitch-black animate-pulse">
                Loading photos...
              </div>
            ) : !album || album.photos.length === 0 ? (
              <div className="col-span-full py-20 text-center font-black text-2xl uppercase tracking-tighter text-tertiary border-4 border-pitch-black border-dashed bg-zinc-200">
                No photos in this album yet.
              </div>
            ) : (
              album.photos.map((post) => (
                <article 
                  key={post.FotoID} 
                  className="break-inside-avoid relative group border-4 border-pitch-black bg-stadium-grey shadow-[8px_8px_0_0_#000] transition-transform hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#C8102E] cursor-pointer"
                  onClick={() => handleOpenModal(post)}
                >
                  <img 
                    alt={post.JudulFoto} 
                    className="w-full h-auto object-cover grayscale group-hover:grayscale-0 halftone-effect border-b-4 border-pitch-black transition-all duration-300" 
                    src={post.LokasiFile} 
                  />
                  
                  <div className="absolute inset-0 bg-liverpool-red/80 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                    <div className="bg-white border-4 border-pitch-black p-4 rotate-[-3deg] shadow-[4px_4px_0_0_#000] flex flex-col items-center">
                      <span className="material-symbols-outlined text-pitch-black text-4xl mb-1">fullscreen</span>
                      <span className="text-pitch-black font-label-md uppercase font-black tracking-widest">View Post</span>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

        </div>
      </main>

      {/* 4. Photo Modal Popup */}
      <PhotoModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        post={selectedPost ? {
          id: selectedPost.FotoID,
          title: selectedPost.JudulFoto,
          desc: selectedPost.DeskripsiFoto,
          author: album?.author || '@unknown',
          imgSrc: selectedPost.LokasiFile
        } : null}
      />

      <MobileBottomNav />
    </div>
  );
}