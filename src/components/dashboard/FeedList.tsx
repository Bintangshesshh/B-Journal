"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import PhotoModal from '../ui/PhotoModal';

export default function FeedList() {
  const [activeTab, setActiveTab] = useState<'latest' | 'trending'>('latest');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    // Mengambil data dari tabel 'foto' JOIN dengan tabel 'user' untuk mendapatkan Username pembuatnya
    const { data, error } = await supabase
      .from('foto')
      .select('*, user(Username)')
      .order('TanggalUnggah', { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const handleOpenModal = (post: any) => {
    // Mapping data asli database ke object yang dimengerti oleh PhotoModal (jika diperlukan)
    // Walaupun lebih baik PhotoModal di update juga nanti, kita pass saja datanya langsung.
    setSelectedPost({
      id: post.FotoID,
      title: post.JudulFoto,
      desc: post.DeskripsiFoto,
      author: post.user?.Username ? `@${post.user.Username}` : '@unknown_artist',
      imgSrc: post.LokasiFile,
      isLiked: false, // Akan dihandle di tahap 3
      stats: { likes: 0, comments: 0 }
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

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
            {activeTab === 'latest' && (
              <div className="duct-tape w-12 h-4 -top-2 -left-3 -rotate-12 absolute z-10"></div>
            )}
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
            {activeTab === 'trending' && (
              <div className="duct-tape w-12 h-4 -top-2 -right-3 rotate-12 absolute z-10"></div>
            )}
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
        ) : posts.length === 0 ? (
          <div className="col-span-full py-12 flex justify-center items-center border-4 border-pitch-black border-dashed bg-zinc-200">
            <p className="font-label-lg font-bold uppercase text-zinc-500">NO TRANSMISSION DETECTED.</p>
          </div>
        ) : (
          (activeTab === 'latest' ? posts : [...posts].reverse()).map((post, idx) => (
            <article key={post.FotoID} className="break-inside-avoid relative group border-4 border-pitch-black bg-stadium-grey shadow-[8px_8px_0_0_#C8102E] transition-transform hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#C8102E] overflow-hidden">
              {/* Tambahkan Duct Tape Random untuk nilai estetika Brutalist */}
              {idx % 3 === 0 && <div className="duct-tape w-12 h-4 top-2 left-2 -rotate-12 z-10"></div>}
              {idx % 5 === 0 && <div className="duct-tape w-20 h-6 bottom-16 right-0 rotate-45 z-10 mix-blend-difference"></div>}
              
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
                  <div className="flex gap-3 text-pitch-black">
                    <span 
                      className="material-symbols-outlined hover:scale-110 cursor-pointer transition-transform" 
                      onClick={(e) => {
                        e.stopPropagation();
                        // handle toggle like
                      }}
                    >
                      favorite
                    </span>
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
    </div>
  );
}