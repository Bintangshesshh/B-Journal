import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import TopHeader from '@/components/dashboard/TopHeader';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';
import Link from 'next/link';

// Expanded mock data based on TrendingAlbums widget
const TRENDING_ALBUMS_FULL = [
  {
    id: 1,
    title: "Brutal Forms",
    count: "24 Captures",
    author: "@archi_grapher",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuChCCybsOJ-73oUva11cSyLRX0fp65zbcFihaAwHq908wwC5DToFxoHufwJEVTD2qbuuptRlbwoo4icXhXeqbU2HQLgxVULOGn9_HZ7vQfg8m9Xkv5z1HYYJYCPRjaIo4YDEP1Kyr2ADEZukju-wX34tpnc5bB2VExUGwNAMo0K3idlJLfkXdeTYy5NpjSzjeg6MxSTJOlL498pGh4_4LpYXYXhGLbX-AJdkVQOm4OIm-D5C8smmh1Oc_nObP16VvdvktUVWKcHTM4"
  },
  {
    id: 2,
    title: "Shadow Play",
    count: "18 Captures",
    author: "@night_walker",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiTitIgzpC-VPz67WeVc_K57_h8RcrhXYZz1H_NmsbfS7Ah1Hrcgp7yXd3jPyCq0ZGK1bHXzSPOgFxWoe6LIbCN5Uv9zRDxl1LrR-3fiDKldn335O3WwWk6iP0kv2PCVNQ0KwX5SKu_UBGFIL7bEgawwasrxKKcFrG9gOLq2XCb1iA8YlSUpdEbD6GVOV6R6YDi1hGpvzU6K2srcQ2rBbwbf4YXPLo7SvYqveYJbQfZREJbyzRoh0JRG_W5lSVFgBzYnrtXyzOUNw"
  },
  {
    id: 3,
    title: "Street Textures",
    count: "42 Captures",
    author: "@urban_echo",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDn29W7exWvNGelAYNWdsiyX9YDkrwwNieuH8oxFn3AgFpk5viPYo02nJfy5dSxji-UkBKl-CLP0K988vJ7q3nqvpIRCZyHhYp0knBYQaZFv5x5rnbKYsfnmPU3hQ_Ne0lRZk1TgWPGkZKWTnTsytygWZAlzw8-fGQWFbYNXQNcWDObSSKgxDjWsCiyppBzBlqNDSmCyB9m6RvsNPVUVOGgk8ePT1R0lVTgM6Gwb7q9yY7G8iiLJCMrU-sDOAC53-7U52sl5040mzE"
  },
  {
    id: 4,
    title: "Film Grain 35",
    count: "36 Captures",
    author: "@analog_dream",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjvphJkkl1_lmYdcbmF3ABrswCMN3y0P4GsApSaHq3n5rWGB920P-dTmZyC2GX9TU_V4DrznT-XBriqLEzWeHbJOC6s1HdXzwH08PTEPXLpOc_dmBeNdVWTTPkJlnibGacQQ-KfkHgtuxrYE2ElA0MnY36FO0-3heEEnXhns_WpNjSLVBv_hTiz7yK8dQ4Sqcn3xOw0N5gIOAhSAeu0GS7k2RD_ss_bdQ0hyvt2fTTQW-hw9CzX8LIXUYe37UFkmFO5etVm0Gv6rs"
  },
  {
    id: 5,
    title: "Red Light Dist",
    count: "12 Captures",
    author: "@neon_demon",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7MXHL_8VLADcn938eqG50LBj1vh7EryWC5dpvey5PBbqX0jgNHnMpwgTn9RimUaHyVgz0CjgoJwKcY89XjHqDxHY81mvKD_9u8lUzZt1EOd3itKk7p35lsV5Hs_z1ljdes1JbYFS3JeoSPOTqhw0A5dMVx9mk1SDR3VJNmEMsqhjQFKbjsQU4MCIhEgeZkOoTupameoPwDvCfnWkIaFX-7R0anwSOwyJEso7skrt_IGUeTY9AAnYAp4thBEhQcYv2zSt2CUxjvkI"
  },
  {
    id: 6,
    title: "Studio Chaos",
    count: "50 Captures",
    author: "@flash_rat",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqamv30_5afsbVs3raXw13Mn_6sSp7b7fCLyZBujGt7rf80g5XsZvrgJ8-cjmd5NRFBUrInoWhrHTcM6CpYlhkLcLWs-ucwxFGTnmdGq1nrm7ywIFCwsPWbpTb7Nq4tiiP7Nik2LFLFgHbt-gwTuk2iq2nNo7dt2aQOof0XaRG-O0iSfhSYI9jKhjlW5JCNCh6tpVsCpuxIwnVa6Gv7ltB1oLM1Pxt0qkE-6QmjszVDuN1UQuVU00ii5ImOToWJ1PDTr5Uxh2dqik"
  }
];

export default function TrendingAlbumsPage() {
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
              <span className="font-label-lg font-black uppercase text-pitch-black tracking-tighter">Updated: JUST NOW</span>
            </div>
          </div>

          {/* Grid Layout Brutalist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TRENDING_ALBUMS_FULL.map((album, idx) => (
              <Link 
                href={`/trending-albums/${album.id}`}
                key={album.id} 
                className={`group cursor-pointer bg-stadium-grey border-4 border-pitch-black shadow-[6px_6px_0_0_#C8102E] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:border-liverpool-red flex flex-col block ${idx % 2 !== 0 ? 'md:translate-y-8' : ''}`}
              >
                {/* Image Cover */}
                <div className="w-full aspect-square border-b-4 border-pitch-black overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-500">
                  <div className="absolute inset-0 bg-liverpool-red mix-blend-multiply opacity-0 group-hover:opacity-60 transition-opacity z-10 pointer-events-none"></div>
                  {/* Decorative Tape Element randomly */}
                  {idx % 3 === 0 && <div className="absolute w-20 h-6 bg-zinc-300 mix-blend-difference -top-2 left-4 rotate-12 z-20"></div>}
                  <img alt={album.title} className="w-full h-full object-cover halftone-effect" src={album.imgSrc} />
                  
                  {/* Floating count badge */}
                  <div className="absolute bottom-4 right-4 bg-pitch-black text-white font-label-md font-bold px-3 py-1 border-2 border-white z-20 uppercase rotate-[-2deg]">
                    {album.count}
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
            ))}
          </div>

        </div>
      </main>

      {/* Navigasi Bawah (Mobile) */}
      <MobileBottomNav />
    </div>
  );
}