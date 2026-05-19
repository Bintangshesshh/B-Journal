"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PhotoModal from '../ui/PhotoModal';
import LoginPrompt from '../ui/LoginPrompt';

type PhotoRow = {
  FotoID: number;
  JudulFoto: string;
  DeskripsiFoto: string;
  TanggalUnggah: string;
  LokasiFile: string;
  user: { Username: string } | null;
  likeCount: number;
};

type ModalPost = {
  id: number;
  title: string;
  desc: string;
  author: string;
  imgSrc: string;
};

export default function FeedList() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'latest' | 'trending'>('latest');
  const [photos, setPhotos] = useState<PhotoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<ModalPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    setLoading(true);
    const { data: photoRows, error } = await supabase
      .from('foto')
      .select('FotoID, JudulFoto, DeskripsiFoto, TanggalUnggah, LokasiFile, user(Username)')
      .order('TanggalUnggah', { ascending: false });

    if (error || !photoRows) {
      setLoading(false);
      return;
    }

    const { data: likeRows } = await supabase
      .from('likefoto')
      .select('FotoID');

    const likeCountByPhoto: Record<number, number> = {};
    (likeRows || []).forEach((row: { FotoID: number }) => {
      likeCountByPhoto[row.FotoID] = (likeCountByPhoto[row.FotoID] || 0) + 1;
    });

    const normalized = photoRows.map((photo: any) => ({
      ...photo,
      likeCount: likeCountByPhoto[photo.FotoID] || 0
    }));

    setPhotos(normalized);
    setLoading(false);
  };

  const ensureLoggedIn = () => {
    const storedUser = localStorage.getItem('bJournalUser');
    if (!storedUser) {
      setShowLoginPrompt(true);
      return false;
    }

    try {
      const parsed = JSON.parse(storedUser);
      if (!parsed?.UserID) {
        setShowLoginPrompt(true);
        return false;
      }
    } catch {
      setShowLoginPrompt(true);
      return false;
    }

    return true;
  };

  const toModalPost = (photo: PhotoRow): ModalPost => ({
    id: photo.FotoID,
    title: photo.JudulFoto,
    desc: photo.DeskripsiFoto,
    author: photo.user?.Username ? `@${photo.user.Username}` : '@unknown',
    imgSrc: photo.LokasiFile
  });

  const handleOpenModal = (photo: PhotoRow) => {
    if (!ensureLoggedIn()) return;
    setSelectedPost(toModalPost(photo));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const visiblePhotos = useMemo(() => {
    if (activeTab === 'latest') return photos;
    return [...photos].sort((a, b) => b.likeCount - a.likeCount);
  }, [activeTab, photos]);

  return (
    <div className="flex-1">
      <div className="flex items-end justify-between mb-8 pb-4 border-b-4 border-pitch-black relative">
        <h2 className="font-headline-lg text-pitch-black uppercase tracking-tighter">Feed</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('latest')} 
            className={`relative px-3 py-1 font-label-md uppercase border-2 border-pitch-black transition-colors ${
              activeTab === 'latest' 
                ? 'bg-liverpool-red text-on-primary' 
                : 'bg-surface-container-lowest text-pitch-black hover:bg-stadium-grey'
            }`}
          >
            Latest
          </button>
          <button 
            onClick={() => setActiveTab('trending')} 
            className={`relative px-3 py-1 font-label-md uppercase border-2 border-pitch-black transition-colors ${
              activeTab === 'trending' 
                ? 'bg-liverpool-red text-on-primary' 
                : 'bg-surface-container-lowest text-pitch-black hover:bg-stadium-grey'
            }`}
          >
            Trending
          </button>
        </div>
      </div>

      {/* Grid Posts menggunakan map() dari array posts hasil fetch */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {loading ? (
          <div className="col-span-full py-12 flex justify-center items-center">
            <p className="font-headline-sm uppercase animate-pulse">Scanning the matrix...</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="col-span-full py-12 flex justify-center items-center border-4 border-pitch-black border-dashed bg-zinc-200">
            <p className="font-label-lg font-bold uppercase text-zinc-500">NO TRANSMISSION DETECTED.</p>
          </div>
        ) : (
          visiblePhotos.map((post) => (
            <article key={post.FotoID} className="break-inside-avoid relative group border-4 border-pitch-black bg-stadium-grey shadow-[8px_8px_0_0_#C8102E] transition-transform hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#C8102E] overflow-hidden">
              
              <div className="relative overflow-hidden border-b-4 border-pitch-black">
                <img 
                  onClick={() => handleOpenModal(post)}
                  alt={post.JudulFoto} 
                  className="w-full h-auto object-cover grayscale group-hover:grayscale-0 halftone-effect cursor-pointer transition-all duration-500 scale-100 group-hover:scale-105" 
                  src={post.LokasiFile} 
                />
                <div className="absolute inset-0 bg-liverpool-red mix-blend-multiply opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none"></div>
              </div>
              <div className="p-5 bg-surface-container-lowest relative z-10">
                <h3 
                  onClick={() => handleOpenModal(post)}
                  className="font-headline-sm text-pitch-black uppercase mb-1 cursor-pointer hover:text-liverpool-red transition-colors"
                >
                  {post.JudulFoto}
                </h3>
                <p className="font-body-sm text-secondary mb-3 line-clamp-2">{post.DeskripsiFoto}</p>
                <div className="flex justify-between items-center">
                  <span className="font-label-md text-liverpool-red font-bold">
                    {post.user?.Username ? `@${post.user.Username}` : '@unknown'}
                  </span>
                  <div className="flex gap-3 text-pitch-black items-center">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined">favorite</span>
                      <span className="font-label-sm font-bold">{post.likeCount}</span>
                    </div>
                    <span 
                      className="material-symbols-outlined hover:scale-110 cursor-pointer transition-transform hover:text-liverpool-red"
                      onClick={() => handleOpenModal(post)}
                    >
                      chat_bubble
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <PhotoModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        post={selectedPost}
      />

      <LoginPrompt
        open={showLoginPrompt}
        title="Login dulu?"
        message="Biar bisa buka foto ukuran penuh."
        onClose={() => setShowLoginPrompt(false)}
        onLogin={() => router.push('/login')}
      />
    </div>
  );
}