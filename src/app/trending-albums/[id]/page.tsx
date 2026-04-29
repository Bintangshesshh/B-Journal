"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/dashboard/Sidebar';
import TopHeader from '@/components/dashboard/TopHeader';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';
import PhotoModal from '@/components/ui/PhotoModal';

const MOCK_ALBUM_POSTS = [
  {
    id: 101,
    title: "Angle Zero",
    desc: "Looking up. Symmetry in concrete.",
    author: "@archi_grapher",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuChCCybsOJ-73oUva11cSyLRX0fp65zbcFihaAwHq908wwC5DToFxoHufwJEVTD2qbuuptRlbwoo4icXhXeqbU2HQLgxVULOGn9_HZ7vQfg8m9Xkv5z1HYYJYCPRjaIo4YDEP1Kyr2ADEZukju-wX34tpnc5bB2VExUGwNAMo0K3idlJLfkXdeTYy5NpjSzjeg6MxSTJOlL498pGh4_4LpYXYXhGLbX-AJdkVQOm4OIm-D5C8smmh1Oc_nObP16VvdvktUVWKcHTM4",
    ductTape: null,
    isLiked: false
  },
  {
    id: 102,
    title: "Shadow Walk",
    desc: "Afternoon silhouettes.",
    author: "@archi_grapher",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiTitIgzpC-VPz67WeVc_K57_h8RcrhXYZz1H_NmsbfS7Ah1Hrcgp7yXd3jPyCq0ZGK1bHXzSPOgFxWoe6LIbCN5Uv9zRDxl1LrR-3fiDKldn335O3WwWk6iP0kv2PCVNQ0KwX5SKu_UBGFIL7bEgawwasrxKKcFrG9gOLq2XCb1iA8YlSUpdEbD6GVOV6R6YDi1hGpvzU6K2srcQ2rBbwbf4YXPLo7SvYqveYJbQfZREJbyzRoh0JRG_W5lSVFgBzYnrtXyzOUNw",
    ductTape: null,
    isLiked: true
  },
  {
    id: 103,
    title: "Cracked Surface",
    desc: "Macro textures of the city wall.",
    author: "@archi_grapher",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDn29W7exWvNGelAYNWdsiyX9YDkrwwNieuH8oxFn3AgFpk5viPYo02nJfy5dSxji-UkBKl-CLP0K988vJ7q3nqvpIRCZyHhYp0knBYQaZFv5x5rnbKYsfnmPU3hQ_Ne0lRZk1TgWPGkZKWTnTsytygWZAlzw8-fGQWFbYNXQNcWDObSSKgxDjWsCiyppBzBlqNDSmCyB9m6RvsNPVUVOGgk8ePT1R0lVTgM6Gwb7q9yY7G8iiLJCMrU-sDOAC53-7U52sl5040mzE",
    ductTape: null,
    isLiked: false
  },
  {
    id: 104,
    title: "Overpass",
    desc: "Layered infrastructure.",
    author: "@archi_grapher",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqVYBSJcztRnNg_kin5s9DguIhpLPN78Ef_3S7fEtUX9HvnRLGxyW15KtJ4so4_5ig2Vhk8QxHjcVm5KMMfopR2YficZ4cVZZy-lnt0W8e-wkxR_SuPW3xPlgpQr8dY3TkieWHclG_iyyFZmt7NUGMyMIBYICl-RYLhQgxdUbUhd2VjHU7c51J3KlNHD-16gvgGqGvX-Xqjb867xtUJEsHc7rgZ6clAbI8--y7nIchUBkaEqKKlaZf25nC-HK3u_zsQETyJmxDUKA",
    ductTape: null,
    isLiked: true
  },
  {
    id: 105,
    title: "Terminal",
    desc: "Empty platform, 3 AM.",
    author: "@archi_grapher",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjvphJkkl1_lmYdcbmF3ABrswCMN3y0P4GsApSaHq3n5rWGB920P-dTmZyC2GX9TU_V4DrznT-XBriqLEzWeHbJOC6s1HdXzwH08PTEPXLpOc_dmBeNdVWTTPkJlnibGacQQ-KfkHgtuxrYE2ElA0MnY36FO0-3heEEnXhns_WpNjSLVBv_hTiz7yK8dQ4Sqcn3xOw0N5gIOAhSAeu0GS7k2RD_ss_bdQ0hyvt2fTTQW-hw9CzX8LIXUYe37UFkmFO5etVm0Gv6rs",
    ductTape: <div className="duct-tape w-20 h-4 top-1/2 -left-4 rotate-90 z-10 mix-blend-overlay"></div>,
    isLiked: false
  },
  {
    id: 106,
    title: "Static Void",
    desc: "Tuning into the silence.",
    author: "@archi_grapher",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqamv30_5afsbVs3raXw13Mn_6sSp7b7fCLyZBujGt7rf80g5XsZvrgJ8-cjmd5NRFBUrInoWhrHTcM6CpYlhkLcLWs-ucwxFGTnmdGq1nrm7ywIFCwsPWbpTb7Nq4tiiP7Nik2LFLFgHbt-gwTuk2iq2nNo7dt2aQOof0XaRG-O0iSfhSYI9jKhjlW5JCNCh6tpVsCpuxIwnVa6Gv7ltB1oLM1Pxt0qkE-6QmjszVDuN1UQuVU00ii5ImOToWJ1PDTr5Uxh2dqik",
    ductTape: null,
    isLiked: true
  },
  {
    id: 107,
    title: "Urban Canyon",
    desc: "Looking up through the towers.",
    author: "@archi_grapher",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuChCCybsOJ-73oUva11cSyLRX0fp65zbcFihaAwHq908wwC5DToFxoHufwJEVTD2qbuuptRlbwoo4icXhXeqbU2HQLgxVULOGn9_HZ7vQfg8m9Xkv5z1HYYJYCPRjaIo4YDEP1Kyr2ADEZukju-wX34tpnc5bB2VExUGwNAMo0K3idlJLfkXdeTYy5NpjSzjeg6MxSTJOlL498pGh4_4LpYXYXhGLbX-AJdkVQOm4OIm-D5C8smmh1Oc_nObP16VvdvktUVWKcHTM4",
    ductTape: null,
    isLiked: false
  },
  {
    id: 108,
    title: "Neon Rain",
    desc: "Reflections on the wet pavement.",
    author: "@archi_grapher",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7MXHL_8VLADcn938eqG50LBj1vh7EryWC5dpvey5PBbqX0jgNHnMpwgTn9RimUaHyVgz0CjgoJwKcY89XjHqDxHY81mvKD_9u8lUzZt1EOd3itKk7p35lsV5Hs_z1ljdes1JbYFS3JeoSPOTqhw0A5dMVx9mk1SDR3VJNmEMsqhjQFKbjsQU4MCIhEgeZkOoTupameoPwDvCfnWkIaFX-7R0anwSOwyJEso7skrt_IGUeTY9AAnYAp4thBEhQcYv2zSt2CUxjvkI",
    ductTape: null,
    isLiked: true
  }
];

export default function AlbumDetailPage({ params }: { params: { id: string } }) {
  const [selectedPost, setSelectedPost] = useState<typeof MOCK_ALBUM_POSTS[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (post: typeof MOCK_ALBUM_POSTS[0]) => {
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
                  <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-pitch-black">
                    Album: {params.id === '1' ? 'Brutal Forms' : `Album Vol. ${params.id}`}
                  </h1>
                  <p className="font-body-lg text-secondary uppercase font-bold mt-2 tracking-widest">
                    By <span className="text-liverpool-red underline decoration-2 decoration-pitch-black underline-offset-4 cursor-pointer hover:bg-pitch-black hover:text-white transition-colors">@archi_grapher</span> • 24 Captures
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex items-center justify-center w-12 h-12 bg-white border-4 border-pitch-black hover:bg-liverpool-red hover:text-white transition-colors shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-x-1 active:translate-y-1">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  </button>
                  <button className="flex items-center justify-center w-12 h-12 bg-pitch-black text-white border-4 border-pitch-black hover:bg-liverpool-red transition-colors shadow-[4px_4px_0_0_rgba(200,16,46,1)] active:shadow-none active:translate-x-1 active:translate-y-1">
                    <span className="material-symbols-outlined">share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Full Grid Content (Mirip feed tapi melebar karena gak ada sidebar kanan) */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {MOCK_ALBUM_POSTS.map((post) => (
              <article 
                key={post.id} 
                className="break-inside-avoid relative group border-4 border-pitch-black bg-stadium-grey shadow-[8px_8px_0_0_#000] transition-transform hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#C8102E] cursor-pointer"
                onClick={() => handleOpenModal(post)}
              >
                {post.ductTape}
                <img 
                  alt={post.title} 
                  className="w-full h-auto object-cover grayscale group-hover:grayscale-0 halftone-effect border-b-4 border-pitch-black transition-all duration-300" 
                  src={post.imgSrc} 
                />
                
                <div className="absolute inset-0 bg-liverpool-red/80 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                  <div className="bg-white border-4 border-pitch-black p-4 rotate-[-3deg] shadow-[4px_4px_0_0_#000] flex flex-col items-center">
                    <span className="material-symbols-outlined text-pitch-black text-4xl mb-1">fullscreen</span>
                    <span className="text-pitch-black font-label-md uppercase font-black tracking-widest">View Post</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </main>

      {/* 4. Photo Modal Popup */}
      <PhotoModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        post={selectedPost}
      />

      <MobileBottomNav />
    </div>
  );
}