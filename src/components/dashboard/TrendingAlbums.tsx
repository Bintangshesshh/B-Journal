import React from 'react';
import Link from 'next/link';

const TRENDING_ALBUMS = [
  {
    id: 1,
    title: "Brutal Forms",
    count: "24 Captures",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuChCCybsOJ-73oUva11cSyLRX0fp65zbcFihaAwHq908wwC5DToFxoHufwJEVTD2qbuuptRlbwoo4icXhXeqbU2HQLgxVULOGn9_HZ7vQfg8m9Xkv5z1HYYJYCPRjaIo4YDEP1Kyr2ADEZukju-wX34tpnc5bB2VExUGwNAMo0K3idlJLfkXdeTYy5NpjSzjeg6MxSTJOlL498pGh4_4LpYXYXhGLbX-AJdkVQOm4OIm-D5C8smmh1Oc_nObP16VvdvktUVWKcHTM4"
  },
  {
    id: 2,
    title: "Shadow Play",
    count: "18 Captures",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiTitIgzpC-VPz67WeVc_K57_h8RcrhXYZz1H_NmsbfS7Ah1Hrcgp7yXd3jPyCq0ZGK1bHXzSPOgFxWoe6LIbCN5Uv9zRDxl1LrR-3fiDKldn335O3WwWk6iP0kv2PCVNQ0KwX5SKu_UBGFIL7bEgawwasrxKKcFrG9gOLq2XCb1iA8YlSUpdEbD6GVOV6R6YDi1hGpvzU6K2srcQ2rBbwbf4YXPLo7SvYqveYJbQfZREJbyzRoh0JRG_W5lSVFgBzYnrtXyzOUNw"
  },
  {
    id: 3,
    title: "Street Textures",
    count: "42 Captures",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDn29W7exWvNGelAYNWdsiyX9YDkrwwNieuH8oxFn3AgFpk5viPYo02nJfy5dSxji-UkBKl-CLP0K988vJ7q3nqvpIRCZyHhYp0knBYQaZFv5x5rnbKYsfnmPU3hQ_Ne0lRZk1TgWPGkZKWTnTsytygWZAlzw8-fGQWFbYNXQNcWDObSSKgxDjWsCiyppBzBlqNDSmCyB9m6RvsNPVUVOGgk8ePT1R0lVTgM6Gwb7q9yY7G8iiLJCMrU-sDOAC53-7U52sl5040mzE"
  }
];

export default function TrendingAlbums() {
  return (
    <aside className="hidden xl:block w-80 shrink-0">
      <div className="sticky top-28 border-4 border-pitch-black bg-stadium-grey p-6 shadow-[8px_8px_0_0_#C8102E]">
        <h3 className="font-headline-md text-pitch-black uppercase border-b-4 border-pitch-black pb-2 mb-4 tracking-tighter">Trending Albums</h3>
        <ul className="space-y-4">
          {TRENDING_ALBUMS.map((album) => (
            <li key={album.id}>
              <Link href={`/trending-albums/${album.id}`} className="group flex items-center gap-3">
                <div className="w-12 h-12 border-2 border-pitch-black overflow-hidden relative">
                  <div className="absolute inset-0 bg-liverpool-red mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                  <img alt="Album cover" className="w-full h-full object-cover grayscale transition-transform duration-300 group-hover:scale-110" src={album.imgSrc} />
                </div>
                <div>
                  <h4 className="font-label-lg text-pitch-black group-hover:text-liverpool-red transition-colors uppercase font-bold">{album.title}</h4>
                  <p className="font-label-md text-secondary border-t-2 border-pitch-black border-dashed mt-1 pt-1 opacity-70">{album.count}</p>
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