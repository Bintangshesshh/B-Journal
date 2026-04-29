"use client";

import React, { useState } from 'react';

const INITIAL_DISCOVERY_DATA = [
  {
    id: 1,
    author: "@neo_tokyo_drifter",
    authorImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbb0XrIbS3JGrrbQsq3t26eJDAAQMgD0M4wGrrRDrMyZL5WBprR-GCW4cBDJjyGgaIzBFYeAD2x0NUVOZyouIoKq-MLxHVg_I1Oi7NbKVqyuyCQO7IFSdB1-hMHQbjmhFIEBLdT_7wSfSgH0XPGS_MitZLf-VbOX2dmbKuQ7JRPiIAjQLSlqSflGJZF6u447cTyewm9C0UKHQuFkiFeDQm2sbO-ueToJwKc6cDNrrCOlmTuXP7qU0B2gVoh-GG1RtdgnD3qPfbHsc",
    description: "Midnight oil burns brighter. Neon reflections off the rain-slicked concrete. #urban #cyberpunk",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCd4FXZ1eXhViaaYrhg-57xP051KgOuD5DbzFKzDDlYEf-_xLavkvHRRJJY6-N4RE91B-AZNMlkeVBp2F8vP_UP_XntM6OpsMdwocAVncgOmfyiGHqIWqDK2N9HcE08ygMwgzMadZza3Rq9P63eODwcZ-yhYLdZPuVdIhV9xaBz8_VW3nTcOywJP4-FoIdZuIyVsOjhfsn-9y6PPJpINYC08qDIDSeNShC3UkRG6KDqvyS9_rrDBy_o9jNNgDy1MTnOJusqW3NfO2c",
    likes: 12400,
    comments: 342,
    isLiked: false,
    rotationClass: "-rotate-1"
  },
  {
    id: 2,
    author: "@concrete_dreams",
    authorImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDk8ECxuupTw_ZKOtlHbo9SutyFrKpBzt3VbFYUkQk5AvIHIc61ii1cGJwrbp7S0MDCWMXHzZT5Dhd7WnTgcGpeojyJRCiMs-Xnx434J9R9wu9dxdz0ewnOYTcwDmQkgHzpU2lBwrFiwzvWSFRoPZ2lG5TiJq5tbxzvcBPMzluN1QqOfHyWkEoDUkixbN7px25QA64Iccq4Qfw_ZJzm_q_9qrZleFV68gT0YBwPc9GzA-R1P7Mc2wKSZQc0snKD914V5A1N8RCvRaY",
    description: "Shapes over substance. Finding form in the brutalist wastelands. #architecture #brutalism",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbJWOpbExgLodZ89Wtcc3gXrwgs8MDhBi18Fnx27tS_V3AvO6Kkyzk7XMjCie2qp7NsCjOyGOkfWnC3DnxyESUQcjojDfGNAK2Xhd9qn__duVc16PATgcTLoJuRW1GrlDQyHk2sbUXAns2IWBNkVlvuZBhm0uK-HsHc5Nsuee5ZARqbVOXKebamLU1l82D_Gv3pYbgOX9-y0vh-a7XndwuT7g3PSp4I5Ri2j1qma-7XZDkEVE22vzvXJro7erxFMa_ZeiQeK6MA5g",
    likes: 8900,
    comments: 120,
    isLiked: false,
    rotationClass: "rotate-1"
  }
];

interface DiscoveryFeedProps {
  isZenMode?: boolean;
  toggleZenMode?: () => void;
}

export default function DiscoveryFeed({ isZenMode = false, toggleZenMode }: DiscoveryFeedProps) {
  const [posts, setPosts] = useState(INITIAL_DISCOVERY_DATA);
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  
  const [commentsData, setCommentsData] = useState<Record<number, Array<{id: number, user: string, text: string}>>>({
    1: [
      { id: 1, user: '@lens_flare', text: 'Bro this is insane composition 🔥' },
      { id: 2, user: '@cyber_junkie', text: 'Where was this taken?' }
    ],
    2: [
      { id: 3, user: '@shutter_bug', text: 'What film stock did you use?' }
    ]
  });

  const toggleLike = (id: number) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handlePostComment = (e: React.FormEvent, postId: number) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setCommentsData(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), { id: Date.now(), user: '@my_profile', text: newComment }]
    }));
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: post.comments + 1 };
      }
      return post;
    }));
    
    setNewComment('');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <>
      {posts.map((post) => (
        <section key={post.id} className="snap-item w-full h-[100dvh] relative flex items-center justify-center bg-pitch-black group overflow-hidden">
          {/* The Photograph Full Screen */}
          <div className="absolute inset-0 w-full h-full bg-zinc-900">
            {/* Halftone Overlay */}
            <div className="absolute inset-0 halftone-overlay z-10 opacity-70"></div>
            <img 
              alt="Photography" 
              className="w-full h-full object-cover object-center filter contrast-125 saturate-50" 
              src={post.imgSrc} 
            />
            {/* Gradient Bottom for text legibility */}
            <div className={`absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none transition-opacity duration-500 ${isZenMode ? 'opacity-0' : 'opacity-100'}`}></div>
          </div>

          {/* Zen Mode Toggle Button */}
          <button 
            onClick={toggleZenMode}
            className={`absolute top-6 right-4 md:right-8 z-50 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
              isZenMode 
                ? 'bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20' 
                : 'bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20'
            }`}
          >
            <span className="material-symbols-outlined leading-none">{isZenMode ? 'visibility_off' : 'visibility'}</span>
          </button>

          {/* Interaction Stack (Right Side) */}
          <div className={`absolute right-4 md:right-8 bottom-24 md:bottom-32 flex flex-col gap-6 z-20 transition-all duration-300 ${
            isZenMode ? 'opacity-0 translate-x-10 pointer-events-none' : 'opacity-100 translate-x-0'
          }`}>
            <button onClick={() => toggleLike(post.id)} className="flex flex-col items-center group/btn">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all">
                <span 
                  className={`material-symbols-outlined transition-colors ${post.isLiked ? "text-[#C8102E] drop-shadow-[0_0_8px_rgba(200,16,46,0.8)]" : "text-white"}`} 
                  style={post.isLiked ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  favorite
                </span>
              </div>
              <span className="text-white font-label-md text-label-md mt-1 drop-shadow-md">{formatNumber(post.likes)}</span>
            </button>
            <button onClick={() => setActiveCommentPostId(post.id)} className="flex flex-col items-center group/btn">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all">
                <span className="material-symbols-outlined text-white">chat_bubble</span>
              </div>
              <span className="text-white font-label-md text-label-md mt-1 drop-shadow-md">{formatNumber(post.comments)}</span>
            </button>
            <button className="flex flex-col items-center group/btn">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all">
                <span className="material-symbols-outlined text-white">share</span>
              </div>
            </button>
          </div>

          {/* Info Overlay (Bottom Left - Torn Paper style) */}
          <div className={`absolute left-4 md:left-8 bottom-20 md:bottom-28 z-20 max-w-[80vw] md:max-w-sm mb-16 md:mb-0 transition-all duration-500 delay-100 ${
            isZenMode ? 'opacity-0 translate-y-20 pointer-events-none' : 'opacity-100 translate-y-0'
          }`}>
            <div className={`bg-stadium-grey p-4 md:p-6 relative tape-corner-tl tape-corner-br transform ${post.rotationClass} shadow-xl border-2 border-pitch-black`}>
              <div className="flex items-center gap-3 mb-2 relative z-10">
                <div className="w-8 h-8 rounded-full bg-pitch-black overflow-hidden border border-tertiary">
                  <img alt="Photographer" className="w-full h-full object-cover grayscale" src={post.authorImage} />
                </div>
                <span className="font-headline-sm text-headline-sm text-pitch-black tracking-tight">{post.author}</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface leading-tight mt-2 font-bold uppercase relative z-10">
                {post.description}
              </p>
            </div>
          </div>
        </section>
      ))}

      {/* Backdrop for Comment Sidebar on smaller screens */}
      {activeCommentPostId && (
        <div 
          className="fixed inset-0 bg-pitch-black/60 backdrop-blur-sm z-[90] animate-in fade-in duration-300"
          onClick={() => setActiveCommentPostId(null)}
        />
      )}

      {/* Slide-out Comment Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[400px] z-[100] bg-stadium-grey border-l-8 border-pitch-black flex flex-col transition-transform duration-300 ${
          activeCommentPostId !== null ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {activeCommentPostId && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b-4 border-pitch-black bg-white">
              <h3 className="font-headline-sm font-black uppercase text-pitch-black m-0">Comments</h3>
              <button 
                onClick={() => setActiveCommentPostId(null)}
                className="w-10 h-10 bg-stadium-grey hover:bg-liverpool-red text-pitch-black hover:text-white flex justify-center items-center border-[3px] border-pitch-black shadow-[3px_3px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-colors"
              >
                <span className="material-symbols-outlined font-bold">close</span>
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-surface-container-lowest">
              {/* Original Post Description */}
              <div className="flex gap-3 mb-6 pb-6 border-b-2 border-dashed border-pitch-black/30">
                <div className="w-10 h-10 rounded-full border-2 border-pitch-black shrink-0 overflow-hidden">
                  <img 
                    src={posts.find(p => p.id === activeCommentPostId)?.authorImage} 
                    alt="Author" 
                    className="w-full h-full object-cover grayscale" 
                  />
                </div>
                <div>
                  <p className="font-body-sm text-pitch-black">
                    <span className="font-bold uppercase tracking-tight mr-2">{posts.find(p => p.id === activeCommentPostId)?.author}</span> 
                    {posts.find(p => p.id === activeCommentPostId)?.description}
                  </p>
                </div>
              </div>

              {/* User Comments */}
              <div className="space-y-5">
                {(commentsData[activeCommentPostId] || []).map(comment => (
                  <div key={comment.id} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full border-2 border-pitch-black shrink-0 bg-stadium-grey flex items-center justify-center">
                      <span className="text-[10px] font-bold text-pitch-black">{comment.user.charAt(1).toUpperCase()}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-body-sm text-pitch-black">
                        <span className="font-bold uppercase tracking-tight mr-2">{comment.user}</span> 
                        {comment.text}
                      </p>
                      <div className="flex gap-3 mt-1">
                        <button className="font-label-sm text-tertiary hover:text-liverpool-red uppercase font-bold text-[10px]">Reply</button>
                        <button className="font-label-sm text-tertiary hover:text-liverpool-red uppercase font-bold text-[10px]">Report</button>
                      </div>
                    </div>
                    <button className="text-secondary hover:text-liverpool-red">
                      <span className="material-symbols-outlined text-[16px]">favorite</span>
                    </button>
                  </div>
                ))}
                
                {(commentsData[activeCommentPostId] || []).length === 0 && (
                  <p className="text-center font-label-md text-tertiary uppercase py-8">No comments yet. Be the first!</p>
                )}
              </div>
            </div>

            {/* Add Comment Input */}
            <div className="p-4 border-t-4 border-pitch-black bg-white">
              <form onSubmit={(e) => handlePostComment(e, activeCommentPostId)} className="flex gap-2">
                <input 
                  type="text" 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="ADD A COMMENT..." 
                  className="flex-1 bg-stadium-grey border-[3px] border-pitch-black p-2 font-label-md uppercase tracking-tighter placeholder:text-tertiary focus:outline-none focus:border-liverpool-red"
                />
                <button 
                  type="submit"
                  disabled={!newComment.trim()}
                  className="bg-pitch-black text-white px-4 font-bold uppercase tracking-widest border-[3px] border-pitch-black hover:bg-liverpool-red disabled:opacity-50 disabled:hover:bg-pitch-black"
                >
                  Post
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
}