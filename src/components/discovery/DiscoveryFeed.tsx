"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PhotoModal from '@/components/ui/PhotoModal';
import LoginPrompt from '@/components/ui/LoginPrompt';

type DiscoveryPost = {
  id: number;
  title: string;
  author: string;
  description: string;
  imgSrc: string;
  likes: number;
  comments: number;
  isLiked: boolean;
};

type ModalPost = {
  id: number;
  title: string;
  desc: string;
  author: string;
  imgSrc: string;
};

export default function DiscoveryFeed() {
  const router = useRouter();
  const [posts, setPosts] = useState<DiscoveryPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState<ModalPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [heartPostId, setHeartPostId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<{ UserID: number; Username?: string } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const [notification, setNotification] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
  const lastItemRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Map<number, HTMLElement>>(new Map());
  const clickTimerRef = useRef<number | null>(null);
  const PAGE_SIZE = 6;

  useEffect(() => {
    const userStr = localStorage.getItem('bJournalUser');
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch {
        setCurrentUser(null);
      }
    }
  }, []);

  const showNotification = (message: string) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  const fetchPage = async (pageIndex: number, replace = false) => {
    if (isFetching) return;
    setIsFetching(true);
    if (pageIndex === 0) setIsLoading(true);

    const from = pageIndex * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data: photoRows, error } = await supabase
      .from('foto')
      .select('FotoID, JudulFoto, DeskripsiFoto, LokasiFile, user(Username)')
      .order('TanggalUnggah', { ascending: false })
      .range(from, to);

    if (error || !photoRows) {
      setIsFetching(false);
      setIsLoading(false);
      setHasMore(false);
      return;
    }

    const photoIds = photoRows.map((row: any) => row.FotoID);
    if (photoIds.length === 0) {
      if (pageIndex === 0) setPosts([]);
      setIsFetching(false);
      setIsLoading(false);
      setHasMore(false);
      return;
    }

    const [likeRowsResult, commentRowsResult] = await Promise.all([
      supabase.from('likefoto').select('FotoID, UserID').in('FotoID', photoIds),
      supabase.from('komentarfoto').select('FotoID').in('FotoID', photoIds)
    ]);

    const likeCountByPhoto: Record<number, number> = {};
    const commentCountByPhoto: Record<number, number> = {};
    const likedSet = new Set<number>();
    const currentUserId = currentUser ? Number(currentUser.UserID) : null;

    (likeRowsResult.data || []).forEach((row: any) => {
      likeCountByPhoto[row.FotoID] = (likeCountByPhoto[row.FotoID] || 0) + 1;
      if (currentUserId !== null && Number(row.UserID) === currentUserId) likedSet.add(row.FotoID);
    });

    (commentRowsResult.data || []).forEach((row: any) => {
      commentCountByPhoto[row.FotoID] = (commentCountByPhoto[row.FotoID] || 0) + 1;
    });

    const normalized = photoRows.map((photo: any) => ({
      id: photo.FotoID,
      title: photo.JudulFoto || 'Untitled',
      author: photo.user?.Username ? `@${photo.user.Username}` : '@unknown',
      description: photo.DeskripsiFoto || photo.JudulFoto || 'Untitled',
      imgSrc: photo.LokasiFile,
      likes: likeCountByPhoto[photo.FotoID] || 0,
      comments: commentCountByPhoto[photo.FotoID] || 0,
      isLiked: likedSet.has(photo.FotoID)
    }));

    setPosts(prev => (replace ? normalized : [...prev, ...normalized]));
    setHasMore(photoRows.length === PAGE_SIZE);
    setIsFetching(false);
    setIsLoading(false);
  };

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    setPosts([]);
  }, [currentUser]);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowHint(false), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hasMore && page > 0) return;
    fetchPage(page, page === 0);
  }, [page, currentUser]);

  useEffect(() => {
    if (!hasMore) return;
    const target = lastItemRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isFetching) {
          setPage(prev => prev + 1);
        }
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [posts, hasMore, isFetching]);

  useEffect(() => {
    if (posts.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const indexAttr = entry.target.getAttribute('data-index');
          const indexValue = indexAttr ? Number(indexAttr) : 0;
          if (!Number.isNaN(indexValue)) setActiveIndex(indexValue);
        });
      },
      { threshold: 0.6 }
    );

    itemRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [posts]);

  const toggleLike = async (id: number) => {
    const currentUserId = currentUser ? Number(currentUser.UserID) : null;
    if (!currentUser || currentUserId === null || Number.isNaN(currentUserId)) {
      showNotification('Silakan login dulu.');
      return;
    }

    const post = posts.find(p => p.id === id);
    if (!post) return;

    if (post.isLiked) {
      await supabase
        .from('likefoto')
        .delete()
        .eq('FotoID', id)
        .eq('UserID', currentUserId);
    } else {
      await supabase
        .from('likefoto')
        .insert([{ FotoID: id, UserID: currentUserId, TanggalLike: new Date().toISOString().split('T')[0] }]);
    }

    setPosts(prev => prev.map(item => (
      item.id === id
        ? { ...item, isLiked: !item.isLiked, likes: item.isLiked ? Math.max(0, item.likes - 1) : item.likes + 1 }
        : item
    )));
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

  const handleOpenModal = (post: DiscoveryPost) => {
    if (!ensureLoggedIn()) return;
    setSelectedPost({
      id: post.id,
      title: post.title,
      desc: post.description,
      author: post.author,
      imgSrc: post.imgSrc
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleImageClick = (post: DiscoveryPost) => {
    if (clickTimerRef.current) return;
    clickTimerRef.current = window.setTimeout(() => {
      handleOpenModal(post);
      if (clickTimerRef.current) {
        window.clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }
    }, 220);
  };

  const handleImageDoubleClick = (post: DiscoveryPost) => {
    if (clickTimerRef.current) {
      window.clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    handleDoubleTap(post);
  };

  const triggerHeart = (postId: number) => {
    setHeartPostId(postId);
    setTimeout(() => setHeartPostId(null), 800);
  };

  const handleDoubleTap = (post: DiscoveryPost) => {
    if (!post.isLiked) {
      toggleLike(post.id);
    }
    triggerHeart(post.id);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const modalPost = useMemo(() => selectedPost, [selectedPost]);

  return (
    <>
      {notification.show && (
        <div className="fixed top-8 right-8 z-[100] bg-liverpool-red text-white p-4 font-bold border-4 border-pitch-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest animate-bounce">
          <span className="material-symbols-outlined align-middle mr-2">info</span>
          {notification.message}
        </div>
      )}
      {isLoading ? (
        <section className="snap-item w-full h-full relative flex items-center justify-center bg-pitch-black">
          <p className="font-black uppercase text-white animate-pulse">Loading discovery feed...</p>
        </section>
      ) : posts.length === 0 ? (
        <section className="snap-item w-full h-full relative flex items-center justify-center bg-pitch-black">
          <p className="font-black uppercase text-white">No posts yet.</p>
        </section>
      ) : (
        posts.map((post, index) => (
          <section
            key={post.id}
            ref={(el) => {
              if (el) {
                itemRefs.current.set(post.id, el);
                if (index === posts.length - 1) lastItemRef.current = el;
              } else {
                itemRefs.current.delete(post.id);
              }
            }}
            data-index={index}
            className="snap-item w-full h-full relative flex items-center justify-center bg-pitch-black overflow-hidden"
          >
            {/* Blurred backdrop */}
            <div className="absolute inset-0">
              <img
                alt="Backdrop"
                className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-50"
                src={post.imgSrc}
              />
              <div className="absolute inset-0 bg-pitch-black/70"></div>
            </div>

            {/* Main photo */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                alt={post.title}
                className="w-full h-full object-contain"
                src={post.imgSrc}
                onClick={() => handleImageClick(post)}
                onDoubleClick={() => handleImageDoubleClick(post)}
              />

              {heartPostId === post.id && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <span
                    className="material-symbols-outlined text-white text-8xl drop-shadow-[0_0_12px_rgba(200,16,46,0.8)] animate-in zoom-in-50 fade-in duration-300"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    favorite
                  </span>
                </div>
              )}
            </div>

            {/* Bottom info + actions */}
            <div className="absolute inset-x-0 bottom-16 md:bottom-0 p-5 md:p-8 bg-gradient-to-t from-pitch-black via-pitch-black/70 to-transparent">
              <div className="flex items-end justify-between gap-6">
                <div className="max-w-[70%]">
                  <p className="font-label-md text-liverpool-red font-bold uppercase tracking-wide">{post.author}</p>
                  <h3 className="font-headline-sm text-white uppercase tracking-tight mt-1">{post.title}</h3>
                  <p className="font-body-sm text-zinc-200 mt-2 line-clamp-2">{post.description}</p>
                </div>
                <div className="flex flex-col items-center gap-4 text-white">
                  <button className="flex flex-col items-center" onClick={() => toggleLike(post.id)}>
                    <span className="material-symbols-outlined" style={post.isLiked ? { fontVariationSettings: "'FILL' 1" } : {}}>
                      favorite
                    </span>
                    <span className="font-label-sm font-bold">{formatNumber(post.likes)}</span>
                  </button>
                  <button className="flex flex-col items-center" onClick={() => handleOpenModal(post)}>
                    <span className="material-symbols-outlined">chat_bubble</span>
                    <span className="font-label-sm font-bold">{formatNumber(post.comments)}</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        ))
      )}

      {!isLoading && isFetching && (
        <section className="snap-item w-full h-[40svh] relative flex items-center justify-center bg-pitch-black text-white">
          <p className="font-black uppercase tracking-wide">Loading more...</p>
        </section>
      )}

      {/* Progress Dots */}
      {posts.length > 1 && (
        <div className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
          {posts.map((post, index) => (
            <span
              key={post.id}
              className={`h-2 w-2 border-2 border-white transition-all ${index === activeIndex ? 'bg-white scale-110' : 'bg-white/20'}`}
            />
          ))}
        </div>
      )}

      {/* Swipe Hint */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-opacity duration-500 ${showHint ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="bg-white/90 text-pitch-black border-2 border-pitch-black px-3 py-1 font-black uppercase tracking-wider flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">keyboard_arrow_up</span>
          Swipe up
        </div>
      </div>

      <PhotoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        post={modalPost}
      />

      <LoginPrompt
        open={showLoginPrompt}
        title="Login dulu?"
        message="Biar bisa buka foto ukuran penuh di Discovery."
        onClose={() => setShowLoginPrompt(false)}
        onLogin={() => router.push('/login')}
      />
    </>
  );
}