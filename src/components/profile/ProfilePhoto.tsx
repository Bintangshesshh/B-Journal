"use client";

import React, { useState, useRef } from 'react';

export default function ProfilePhoto() {
  const [notification, setNotification] = useState<{ show: boolean, message: string }>({ show: false, message: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (message: string) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      showNotification("Foto profil diperbarui (Simulasi)");
    }
  };

  const handleLogout = () => {
    showNotification("Proses Logout...");
    // Simulate slight delay before redirect or actual logout handling
  };

  return (
    <>
      {/* Toast Notification */}
      {notification.show && (
        <div className="fixed top-8 right-8 z-[100] bg-liverpool-red text-white p-4 font-bold border-4 border-pitch-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest animate-bounce">
          <span className="material-symbols-outlined align-middle mr-2">check_circle</span>
          {notification.message}
        </div>
      )}

      {/* Profile Image Container */}
      <div className="relative group mb-8">
        {/* Duct Tape Accents */}
        <div className="absolute bg-zinc-500 opacity-80 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)] w-24 h-6 -top-4 -left-6 rotate-[15deg] z-20"></div>
        <div className="absolute bg-zinc-500 opacity-80 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)] w-16 h-4 bottom-4 -right-8 rotate-[-12deg] z-20 hidden md:block"></div>
        
        {/* Red Shadow Box */}
        <div className="absolute -right-4 top-4 w-full h-full bg-liverpool-red border-4 border-pitch-black"></div>
        
        {/* Photo Box */}
        <div className="relative border-4 border-pitch-black bg-white overflow-hidden shadow-[8px_8px_0_0_rgba(0,0,0,0.15)]">
          <img 
            alt="Main Profile Photo" 
            className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] aspect-square object-cover grayscale contrast-125 sepia-[0.2] -hue-rotate-15 saturate-150" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMgwFk0Iku_UM5oW_m3_OtUeQXBZqqiqxu7m9nqo5daX36A3QZYzpcJFbbCr5MORFUNKp22MWOzcSWufzuGGMAlgYvtAAzRgRkEDOf0WKn0GoElYleRiRgrFOzsQceEvzrIFBez6MkvbxsKPK9hQrEM-QQ5p69FQL6epKMfpiju7cvn8MCfggBu1Pqz3BdRYHLmRnIdgpXa-QadIpTC8wuGLz21i8uAnWmx9EANgGVrLqbyu7gXkA3lmwhh5LV-o4WFRrwBR07Ky0"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-white border-t-4 border-l-4 border-pitch-black px-4 py-2 font-black text-xs uppercase hover:bg-pitch-black hover:text-white transition-colors tracking-tighter"
          >
            CHANGE.PHOTO
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
          />
        </div>
      </div>

      {/* Details Container */}
      <div className="text-center w-full border-t-4 border-pitch-black pt-6 relative">
        <div className="absolute bg-zinc-500 opacity-80 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)] w-16 h-4 -top-2 right-10 rotate-[-8deg]"></div>
        
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 text-pitch-black uppercase italic">User.Profile</h2>
        
        <div className="inline-block px-4 py-1 bg-stadium-grey border-2 border-pitch-black">
          <span className="text-liverpool-red text-lg md:text-xl font-black tracking-[0.2em]">ACCESS_GRANTED.0492</span>
        </div>
        
        <div className="mt-8 relative group max-w-[200px] mx-auto">
          <div className="absolute bg-zinc-500 opacity-60 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)] w-12 h-3 -top-2 -right-4 rotate-[12deg]"></div>
          <button 
            onClick={handleLogout}
            className="w-full bg-liverpool-red text-white border-4 border-pitch-black py-3 px-6 font-black text-lg tracking-tighter uppercase flex items-center justify-center gap-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all active:bg-pitch-black"
          >
            <span className="material-symbols-outlined font-black">logout</span>
            LOGOUT
          </button>
        </div>
      </div>
    </>
  );
}