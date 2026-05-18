"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SettingsForm() {
  const [notification, setNotification] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
  const [appMode, setAppMode] = useState('light');
  const [currentEmail, setCurrentEmail] = useState<string>('');
  const [hasLoaded, setHasLoaded] = useState(false);

  const showNotification = (message: string) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  useEffect(() => {
    const loadProfile = async () => {
      const storedUser = localStorage.getItem('bJournalUser');
      if (!storedUser) return;

      let userId: number | null = null;
      try {
        userId = JSON.parse(storedUser).UserID;
      } catch {
        return;
      }

      if (!userId) return;

      const { data } = await supabase
        .from('user')
        .select('Email')
        .eq('UserID', userId)
        .single();

      setCurrentEmail(data?.Email || '');
    };

    const savedAppMode = localStorage.getItem('bJournalAppMode');
    if (savedAppMode) setAppMode(savedAppMode);

    loadProfile();
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    document.documentElement.classList.toggle('dark', appMode === 'dark');
    localStorage.setItem('bJournalAppMode', appMode);
  }, [appMode, hasLoaded]);

  const handleCommit = () => {
    localStorage.setItem('bJournalAppMode', appMode);
    showNotification("SYSTEM SETTINGS COMMITTED SUCCESSFULLY");
  };

  return (
    <>
      {notification.show && (
        <div className="fixed top-8 right-8 z-[100] bg-liverpool-red text-white p-4 font-bold border-4 border-pitch-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest animate-bounce">
          <span className="material-symbols-outlined align-middle mr-2">info</span>
          {notification.message}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ACCOUNT */}
        <section className="relative bg-white border-4 border-black p-5 shadow-[8px_8px_0px_#000000]">
          <div className="absolute bg-zinc-500 opacity-80 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)] w-20 h-6 -top-3 -left-3 -rotate-2 z-10"></div>

          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-3xl">security</span>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Account</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black mb-2 opacity-60">Email</label>
              <div className="bg-stone-200 border-2 border-black p-3 font-mono text-black relative overflow-hidden">
                <div className="absolute inset-0 halftone opacity-10"></div>
                {currentEmail || 'NO_EMAIL_ON_FILE'}
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm opacity-40">lock</span>
              </div>
            </div>

            <div className="h-2"></div>
          </div>
        </section>

        {/* PREFERENCES */}
        <section className="bg-white border-4 border-black p-5 shadow-[8px_8px_0px_#C8102E]">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-3xl">tune</span>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Preferences</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-black uppercase mb-3">App Mode</h3>
              <div className="flex flex-col gap-3">
                <label className="relative flex items-center cursor-pointer group">
                  <input 
                    className="hidden peer" 
                    name="app_mode" 
                    type="radio" 
                    checked={appMode === 'light'} 
                    onChange={() => setAppMode('light')} 
                  />
                  <div className="w-full p-3 border-4 border-black font-black uppercase text-center bg-stone-100 peer-checked:bg-black peer-checked:text-white transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                    Brutalist Light
                  </div>
                </label>
                <label className="relative flex items-center cursor-pointer group">
                  <input 
                    className="hidden peer" 
                    name="app_mode" 
                    type="radio" 
                    checked={appMode === 'dark'} 
                    onChange={() => setAppMode('dark')} 
                  />
                  <div className="w-full p-3 border-4 border-black font-black uppercase text-center bg-stone-100 peer-checked:bg-black peer-checked:text-white transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                    Brutalist Dark
                  </div>
                </label>
              </div>
            </div>

            <button 
              onClick={handleCommit}
              className="w-full py-4 bg-liverpool-red text-white border-4 border-black text-lg font-black uppercase shadow-[8px_8px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:scale-95 group flex items-center justify-center gap-3"
            >
              Save Changes
              <span className="material-symbols-outlined align-middle group-hover:rotate-45 transition-transform text-white text-2xl">send</span>
            </button>
          </div>
        </section>
      </div>
    </>
  );
}