import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type Post = {
  id: number;
  title: string;
  desc: string;
  author: string;
  imgSrc: string;
};

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
}

export default function PhotoModal({ isOpen, onClose, post }: PhotoModalProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [authorAvatarUrl, setAuthorAvatarUrl] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
  
  // Real Database Comments
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load logged in user
    const userStr = localStorage.getItem("bJournalUser");
    if (userStr) setCurrentUser(JSON.parse(userStr));
  }, []);

  const showNotification = (message: string) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  useEffect(() => {
    if (post && isOpen) {
      fetchComments();
      fetchLikes();
      fetchAuthorAvatar();
    }
  }, [post, isOpen]);

  const fetchAuthorAvatar = async () => {
    if (!post?.author) {
      setAuthorAvatarUrl(null);
      return;
    }

    const username = post.author.startsWith('@') ? post.author.slice(1) : post.author;
    if (!username) {
      setAuthorAvatarUrl(null);
      return;
    }

    const { data } = await supabase
      .from('user')
      .select('FotoProfil')
      .eq('Username', username)
      .single();

    setAuthorAvatarUrl(data?.FotoProfil || null);
  };

  const fetchComments = async () => {
    if (!post) return;
    const { data } = await supabase
      .from('komentarfoto')
      .select('*, user(Username, FotoProfil)')
      .eq('FotoID', post.id)
      .order('TanggalKomentar', { ascending: true });
    
    if (data) setComments(data);
  };

  const fetchLikes = async () => {
    if (!post) return;
    
    // Get total likes
    const { count } = await supabase
      .from('likefoto')
      .select('*', { count: 'exact', head: true })
      .eq('FotoID', post.id);
      
    setTotalLikes(count || 0);

    // Check if current user already liked this
    const currentUserId = currentUser ? Number(currentUser.UserID) : null;
    if (currentUserId !== null && !Number.isNaN(currentUserId)) {
      const { data } = await supabase
        .from('likefoto')
        .select('*')
        .eq('FotoID', post.id)
        .eq('UserID', currentUserId)
        .single();

      setIsLiked(!!data);
    }
  };

  const handleLikeToggle = async () => {
    const currentUserId = currentUser ? Number(currentUser.UserID) : null;
    if (!currentUser || currentUserId === null || Number.isNaN(currentUserId) || !post) {
      showNotification("Silakan login dulu.");
      return;
    }

    if (isLiked) {
      // Unlike
      await supabase
        .from('likefoto')
        .delete()
        .eq('FotoID', post.id)
        .eq('UserID', currentUserId);
      setIsLiked(false);
      setTotalLikes(prev => Math.max(0, prev - 1));
    } else {
      // Like
      await supabase
        .from('likefoto')
        .insert([{
          FotoID: post.id,
          UserID: currentUserId,
          TanggalLike: new Date().toISOString().split('T')[0]
        }]);
      setIsLiked(true);
      setTotalLikes(prev => prev + 1);
      
      // Heart animation effect
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      handleLikeToggle();
    } else {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser || !post) {
      if (!currentUser) showNotification("Silakan login dulu.");
      return;
    }
    
    setIsSubmitting(true);
    const { data, error } = await supabase
      .from('komentarfoto')
      .insert([{
        FotoID: post.id,
        UserID: currentUser.UserID,
        IsiKomentar: newComment,
        TanggalKomentar: new Date().toISOString().split('T')[0]
      }])
      .select('*, user(Username, FotoProfil)')
      .single();

    if (!error && data) {
      setComments(prev => [...prev, data]);
      setNewComment('');
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    // Disable scroll on body when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {notification.show && (
        <div className="fixed top-8 right-8 z-[120] bg-liverpool-red text-white p-4 font-bold border-4 border-pitch-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest animate-bounce">
          <span className="material-symbols-outlined align-middle mr-2">info</span>
          {notification.message}
        </div>
      )}
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-pitch-black/80 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-6xl h-[92svh] md:h-[80vh] flex flex-col md:flex-row bg-surface-container-lowest border-8 border-pitch-black shadow-[16px_16px_0_0_#C8102E] overflow-y-auto md:overflow-hidden z-10 pointer-events-auto animate-in zoom-in-95 duration-200">
        
        {/* Close Button (Mobile) */}
        <button 
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 z-50 w-10 h-10 bg-liverpool-red text-white flex justify-center items-center border-[3px] border-pitch-black shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <span className="material-symbols-outlined font-bold">close</span>
        </button>

        {/* Left Side: Photo */}
        <div className="relative w-full md:w-[60%] shrink-0 h-[32vh] md:h-full bg-stadium-grey flex items-center justify-center border-b-8 md:border-b-0 md:border-r-8 border-pitch-black overflow-hidden group">
          {/* Changed 'object-cover' to 'object-contain' so tall photos aren't cropped */}
          <img 
            src={post.imgSrc} 
            alt={post.title} 
            className="w-full h-full object-contain grayscale halftone-effect cursor-pointer"
            onDoubleClick={handleDoubleTap}
          />
          
          {/* Double Tap Heart Animation */}
          {showHeart && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
              <span 
                className="material-symbols-outlined text-white text-9xl drop-shadow-[0_0_15px_rgba(200,16,46,0.8)] animate-in zoom-in-50 fade-in duration-300"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Details & Comments */}
        <div className="w-full md:w-[40%] flex flex-col md:h-full bg-white relative">
          
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b-4 border-pitch-black bg-stadium-grey">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-pitch-black overflow-hidden bg-stadium-grey">
                {authorAvatarUrl ? (
                  <img src={authorAvatarUrl} alt={post.author} className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div>
                <h3 className="font-label-lg font-black uppercase text-pitch-black leading-none">{post.author}</h3>
                <p className="font-label-sm text-liverpool-red font-bold">{post.title}</p>
              </div>
            </div>
            
            {/* Close Button (Desktop) */}
            <button 
              onClick={onClose}
              className="hidden md:flex w-10 h-10 bg-white hover:bg-liverpool-red text-pitch-black hover:text-white justify-center items-center border-[3px] border-pitch-black shadow-[3px_3px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-colors"
            >
              <span className="material-symbols-outlined font-bold">close</span>
            </button>
          </div>

          {/* Description & Comments List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {/* Author Description */}
            <div className="flex gap-3 mb-6 pb-6 border-b-2 border-dashed border-pitch-black/30">
              <div className="w-8 h-8 rounded-full border-2 border-pitch-black shrink-0 hidden sm:block overflow-hidden bg-stadium-grey">
                {authorAvatarUrl ? (
                  <img src={authorAvatarUrl} alt={post.author} className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div>
                <p className="font-body-sm text-pitch-black">
                  <span className="font-bold uppercase tracking-tight mr-2">{post.author}</span> 
                  {post.desc}
                </p>
                <p className="font-label-sm text-tertiary mt-1 uppercase">2 HOURS AGO</p>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center font-label-sm text-tertiary uppercase mt-8 italic">NO TRANSMISSIONS YET. BE THE FIRST.</div>
              ) : (
                comments.map(comment => (
                  <div key={comment.KomentarID} className="flex gap-3 items-start group">
                    <div className="w-8 h-8 rounded-full border-2 border-pitch-black shrink-0 bg-stadium-grey overflow-hidden flex items-center justify-center">
                      {comment.user?.FotoProfil ? (
                        <img src={comment.user.FotoProfil} alt={comment.user?.Username || 'user'} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-bold">
                          {comment.user?.Username ? comment.user.Username.charAt(0).toUpperCase() : 'U'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-body-sm text-pitch-black">
                        <span className="font-bold uppercase tracking-tight mr-2">
                          @{comment.user?.Username || 'unknown'}
                        </span> 
                        {comment.IsiKomentar}
                      </p>
                      <div className="flex gap-3 mt-1">
                        <span className="font-label-sm text-tertiary uppercase text-[10px]">{comment.TanggalKomentar}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Actions Footer */}
          <div className="p-4 border-t-4 border-pitch-black bg-stadium-grey">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-1 group">
                  <button 
                    onClick={handleLikeToggle} 
                    className="hover:scale-110 active:scale-95 transition-transform"
                  >
                    <span 
                      className={`material-symbols-outlined text-3xl ${isLiked ? 'text-liverpool-red' : 'text-pitch-black group-hover:text-liverpool-red'}`}
                      style={isLiked ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      favorite
                    </span>
                  </button>
                  <span className="font-bold font-label-lg">{totalLikes}</span>
                </div>
              </div>
            </div>
            <p className="font-label-md font-bold uppercase tracking-tighter text-pitch-black mb-1">
              {totalLikes} LIKES
            </p>
            
            {/* Add Comment */}
            <form onSubmit={handlePostComment} className="mt-3 flex gap-2 relative">
              <input 
                type="text" 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={currentUser ? "Add a comment..." : "Login to comment..."}
                disabled={!currentUser || isSubmitting}
                className="flex-1 bg-white border-[3px] border-pitch-black p-2 font-body-sm normal-case tracking-normal placeholder:text-tertiary focus:outline-none focus:border-liverpool-red disabled:bg-zinc-200 disabled:cursor-not-allowed"
              />
              <button 
                type="submit"
                disabled={!currentUser || !newComment.trim() || isSubmitting}
                className="bg-pitch-black text-white px-4 font-bold uppercase tracking-widest border-[3px] border-pitch-black hover:bg-liverpool-red disabled:opacity-50 disabled:hover:bg-pitch-black"
              >
                {isSubmitting ? '...' : 'POST'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
