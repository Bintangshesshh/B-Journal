"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SettingsForm() {
  const [notification, setNotification] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
  const [appMode, setAppMode] = useState('light');
  const [privacyMode, setPrivacyMode] = useState('public'); // 'private' | 'public'
  const [currentEmail, setCurrentEmail] = useState<string>('');
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '' });
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
    const savedPrivacy = localStorage.getItem('bJournalPrivacy');
    if (savedAppMode) setAppMode(savedAppMode);
    if (savedPrivacy) setPrivacyMode(savedPrivacy);

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
    localStorage.setItem('bJournalPrivacy', privacyMode);
    showNotification("SYSTEM SETTINGS COMMITTED SUCCESSFULLY");
  };

  const handlePasswordUpdate = () => {
    if (!passwordForm.current || !passwordForm.next) {
      showNotification("PLEASE COMPLETE BOTH PASSWORD FIELDS");
      return;
    }
    setPasswordForm({ current: '', next: '' });
    showNotification("PASSWORD UPDATE REQUEST SUBMITTED");
  };

  const handleWipe = () => {
    showNotification("ACCOUNT DELETION REQUIRES ADMIN APPROVAL");
  };

  return (
    <>
      {notification.show && (
        <div className="fixed top-8 right-8 z-[100] bg-liverpool-red text-white p-4 font-bold border-4 border-pitch-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest animate-bounce">
          <span className="material-symbols-outlined align-middle mr-2">info</span>
          {notification.message}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* ACCOUNT */}
        <section className="relative bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#000000]">
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

            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-liverpool-red"></span> Change Password
              </h3>
              <input 
                className="w-full bg-white border-4 border-black p-3 font-black uppercase placeholder:opacity-40 focus:ring-liverpool-red focus:border-liverpool-red focus:outline-none transition-colors" 
                placeholder="CURRENT PASSWORD" 
                type="password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
              />
              <input 
                className="w-full bg-white border-4 border-black p-3 font-black uppercase placeholder:opacity-40 focus:ring-liverpool-red focus:border-liverpool-red focus:outline-none transition-colors" 
                placeholder="NEW PASSWORD" 
                type="password"
                value={passwordForm.next}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, next: e.target.value }))}
              />
              <button
                type="button"
                onClick={handlePasswordUpdate}
                className="w-full bg-pitch-black text-white border-4 border-pitch-black p-3 font-black uppercase tracking-tight hover:bg-liverpool-red transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-1 active:shadow-none"
              >
                Update Password
              </button>
            </div>
          </div>
        </section>

        {/* PREFERENCES */}
        <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#C8102E]">
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

            <div>
              <h3 className="text-sm font-black uppercase mb-3">Privacy</h3>
              <div className="space-y-3">
                <div 
                  className={`flex items-center justify-between p-3 border-2 cursor-pointer transition-colors ${privacyMode === 'private' ? 'border-liverpool-red bg-red-700/10' : 'border-black/20'}`}
                  onClick={() => setPrivacyMode('private')}
                >
                  <div>
                    <p className="font-black uppercase">Private Vault</p>
                    <p className="text-xs opacity-50 uppercase font-bold tracking-widest">Hidden</p>
                  </div>
                  <button className={`w-12 h-6 border-2 relative transition-colors ${privacyMode === 'private' ? 'bg-liverpool-red border-black' : 'bg-stone-200 border-black'}`}>
                    <span className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 transition-all ${privacyMode === 'private' ? 'right-1 bg-white' : 'left-1 bg-stone-500'}`}></span>
                  </button>
                </div>
                
                <div 
                  className={`flex items-center justify-between p-3 border-2 cursor-pointer transition-colors ${privacyMode === 'public' ? 'border-liverpool-red bg-red-700/10' : 'border-black/20'}`}
                  onClick={() => setPrivacyMode('public')}
                >
                  <div>
                    <p className="font-black uppercase">Public Feed</p>
                    <p className="text-xs opacity-50 uppercase font-bold tracking-widest">Visible</p>
                  </div>
                  <button className={`w-12 h-6 border-2 relative transition-colors ${privacyMode === 'public' ? 'bg-liverpool-red border-black' : 'bg-stone-200 border-black'}`}>
                    <span className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 transition-all ${privacyMode === 'public' ? 'right-1 bg-white' : 'left-1 bg-stone-500'}`}></span>
                  </button>
                </div>
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

        {/* DANGER */}
        <section className="relative bg-white border-4 border-liverpool-red p-6 shadow-[8px_8px_0px_#C8102E]">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-3xl text-liverpool-red">warning</span>
            <h2 className="text-2xl font-black uppercase text-liverpool-red tracking-tighter">Danger</h2>
          </div>
          <p className="text-xs uppercase font-bold opacity-70 mb-4">
            Deleting your account is irreversible.
          </p>
          <button 
            type="button"
            onClick={handleWipe}
            className="w-full px-6 py-3 border-4 border-liverpool-red text-liverpool-red font-black uppercase hover:bg-liverpool-red hover:text-white transition-all shadow-[6px_6px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none tracking-wider"
          >
            Delete Account
          </button>
        </section>
      </div>
    </>
  );
}