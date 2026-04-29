"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ProfileForm() {
  const [notification, setNotification] = useState<{ show: boolean, message: string }>({ show: false, message: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form Fields matching our Supabase `user` table
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [alamat, setAlamat] = useState("");

  const showNotification = (message: string) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem('bJournalUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const { data, error } = await supabase
          .from('user')
          .select('*')
          .eq('UserID', parsedUser.UserID)
          .single();

        if (data) {
          setFullName(data.NamaLengkap || "");
          setUsername(data.Username || "");
          setEmail(data.Email || "");
          setAlamat(data.Alamat || "");
        }
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    const storedUser = localStorage.getItem('bJournalUser');
    if (!storedUser) return;
    
    setIsSaving(true);
    const parsedUser = JSON.parse(storedUser);

    const { error } = await supabase
      .from('user')
      .update({
        NamaLengkap: fullName,
        Username: username,
        Email: email,
        Alamat: alamat
      })
      .eq('UserID', parsedUser.UserID);

    setIsSaving(false);

    if (error) {
      showNotification("ERROR MENGUDATE PROFIL!");
    } else {
      // Update local storage to match new data
      parsedUser.Username = username;
      parsedUser.Email = email;
      parsedUser.NamaLengkap = fullName;
      parsedUser.Alamat = alamat;
      localStorage.setItem('bJournalUser', JSON.stringify(parsedUser));
      showNotification("PROFIL BERHASIL DISIMPAN!");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center font-black uppercase text-xl animate-pulse text-pitch-black">MEMUAT DATA...</div>;
  }

  return (
    <>
      {notification.show && (
        <div className="fixed top-8 right-8 z-[100] bg-liverpool-red text-white p-4 font-bold border-4 border-pitch-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest animate-bounce">
          <span className="material-symbols-outlined align-middle mr-2">check_circle</span>
          {notification.message}
        </div>
      )}

      <div className="w-full space-y-8 bg-white p-6 md:p-8 border-4 border-pitch-black shadow-[12px_12px_0_0_#C8102E] relative overflow-hidden bg-grit">
        
        {/* Decorative background grid */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '10px 10px' }}></div>
        
        {/* Header Ribbon */}
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="h-6 w-1 bg-liverpool-red"></div>
          <div className="bg-pitch-black text-white px-4 py-1 font-black text-xs md:text-sm tracking-widest uppercase">
            Identity_Verification
          </div>
        </div>

        {/* Inputs */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="col-span-2 sm:col-span-2 space-y-1">
            <label className="block text-[10px] font-black uppercase tracking-wider text-tertiary">Full_Name // Creator_ID</label>
            <input 
              className="w-full bg-stadium-grey border-4 border-pitch-black p-3 font-black text-sm focus:ring-0 focus:outline-none focus:bg-white transition-colors uppercase" 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1 relative z-10">
          <label className="block text-[10px] font-black uppercase tracking-wider text-tertiary">Username // Unique_Handle</label>
          <div className="flex items-center bg-stadium-grey border-4 border-pitch-black focus-within:bg-white transition-colors">
            <span className="px-3 text-liverpool-red font-black border-r-4 border-pitch-black">@</span>
            <input 
              className="w-full bg-transparent border-none p-3 font-black text-sm focus:ring-0 focus:outline-none uppercase" 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1 relative z-10">
          <label className="block text-[10px] font-black uppercase tracking-wider text-tertiary">Email // Contact_Link</label>
          <div className="flex items-center bg-stadium-grey border-4 border-pitch-black focus-within:bg-white transition-colors">
            <input 
              className="w-full bg-transparent border-none p-3 font-black text-sm focus:ring-0 focus:outline-none uppercase lowercase-placeholder" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1 relative z-10">
          <label className="block text-[10px] font-black uppercase tracking-wider text-tertiary">Address // Location_Data</label>
          <textarea 
            className="w-full bg-stadium-grey border-4 border-pitch-black p-4 font-black text-sm focus:ring-0 focus:outline-none focus:bg-white resize-none min-h-[120px] uppercase transition-colors" 
            rows={4}
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            placeholder="STREET.OR.CITY"
          ></textarea>
          
          {/* Stamp Graphic */}
          <div className="absolute -bottom-4 right-2 border-2 border-liverpool-red text-liverpool-red px-2 py-0.5 font-black text-[9px] md:text-xs rotate-[-5deg] bg-white uppercase opacity-90 backdrop-blur-sm pointer-events-none">
            Archived.Data
          </div>
        </div>

        <div className="pt-4 relative z-10">
          <button 
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-pitch-black text-white border-4 border-pitch-black p-4 md:p-5 text-lg md:text-xl font-black tracking-tight flex items-center justify-between hover:bg-liverpool-red transition-all group shadow-[6px_6px_0_0_rgba(0,0,0,0.15)] active:translate-y-1 active:shadow-none hover:shadow-[4px_4px_0_0_rgba(0,0,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "SAVING..." : "SAVE.PROFILE_CHANGES"}
            <span className="material-symbols-outlined font-black group-hover:translate-x-2 transition-transform">arrow_forward_ios</span>
          </button>
        </div>
      </div>
    </>
  );
}