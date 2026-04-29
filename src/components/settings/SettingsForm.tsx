"use client";

import React, { useState } from 'react';

export default function SettingsForm() {
  const [notification, setNotification] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
  const [appMode, setAppMode] = useState('light');
  const [privacyMode, setPrivacyMode] = useState('public'); // 'private' | 'public'

  const showNotification = (message: string) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  const handleCommit = () => {
    showNotification("SYSTEM SETTINGS COMMITTED SUCCESSFULLY");
  };

  const handleWipe = () => {
    showNotification("WIPE REQUEST DENIED: DEMO MODE ACTIVE");
  };

  return (
    <>
      {notification.show && (
        <div className="fixed top-8 right-8 z-[100] bg-liverpool-red text-white p-4 font-bold border-4 border-pitch-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest animate-bounce">
          <span className="material-symbols-outlined align-middle mr-2">info</span>
          {notification.message}
        </div>
      )}

      {/* ACCOUNT_SECURITY Section */}
      <section className="relative bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_#000000] md:shadow-[12px_12px_0px_#000000] mb-12">
        <div className="absolute bg-zinc-500 opacity-80 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)] w-32 h-8 -top-4 -left-4 -rotate-2 z-10"></div>
        <div className="absolute bg-zinc-500 opacity-80 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)] w-16 h-8 -bottom-4 right-10 rotate-1 z-10"></div>
        
        <div className="flex items-center gap-4 mb-8">
          <span className="material-symbols-outlined text-3xl md:text-4xl">security</span>
          <h2 className="text-2xl md:text-3xl font-black uppercase border-b-4 border-liverpool-red pb-1 tracking-tighter">ACCOUNT_SECURITY</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Email Info */}
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black mb-2 opacity-60">CURRENT_EMAIL</label>
              <div className="bg-stone-200 border-2 border-black p-4 font-mono text-black relative overflow-hidden">
                <div className="absolute inset-0 halftone opacity-10"></div>
                archive_vance@bjournal.io
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm opacity-40">lock</span>
              </div>
            </div>
            
            <div className="p-4 border-2 border-dashed border-black/30 bg-stone-50 text-xs md:text-sm italic font-bold">
              PROTECTED.DATA: ALL ACCESS LOGS ARE STAMPED WITH METADATA SIGNATURES. DO NOT SHARE CODES.
            </div>
          </div>
          
          {/* Password Change */}
          <div className="space-y-6">
            <h3 className="text-md md:text-xl font-black uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-liverpool-red"></span> CHANGE_PASSWORD
            </h3>
            <div className="space-y-4">
              <div>
                <input className="w-full bg-white border-4 border-black p-4 font-black uppercase placeholder:opacity-40 focus:ring-liverpool-red focus:border-liverpool-red focus:outline-none transition-colors" placeholder="OLD_ACCESS_CODE" type="password" />
              </div>
              <div>
                <input className="w-full bg-white border-4 border-black p-4 font-black uppercase placeholder:opacity-40 focus:ring-liverpool-red focus:border-liverpool-red shadow-[4px_4px_0px_#C8102E] focus:outline-none transition-colors" placeholder="NEW_ACCESS_CODE" type="password" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USER_PREFERENCES Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* APP_MODE Control */}
        <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_#C8102E] md:shadow-[12px_12px_0px_#C8102E] relative h-full">
          <div className="absolute bg-zinc-500 opacity-80 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)] w-20 h-6 -top-2 left-1/2 -translate-x-1/2 rotate-1 z-10"></div>
          <h2 className="text-2xl md:text-3xl font-black uppercase mb-8 tracking-tighter">APP_MODE</h2>
          
          <div className="flex flex-col gap-4">
            <label className="relative flex items-center cursor-pointer group">
              <input 
                className="hidden peer" 
                name="app_mode" 
                type="radio" 
                checked={appMode === 'light'} 
                onChange={() => setAppMode('light')} 
              />
              <div className="w-full p-4 border-4 border-black font-black uppercase text-center bg-stone-100 peer-checked:bg-black peer-checked:text-white transition-all transform md:hover:skew-x-1 shadow-[4px_4px_0px_rgba(0,0,0,0.1)] peer-checked:shadow-[6px_6px_0px_#C8102E]">
                BRUTALIST_LIGHT
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
              <div className="w-full p-4 border-4 border-black font-black uppercase text-center bg-stone-100 peer-checked:bg-black peer-checked:text-white transition-all transform md:hover:-skew-x-1 shadow-[4px_4px_0px_rgba(0,0,0,0.1)] peer-checked:shadow-[6px_6px_0px_#C8102E]">
                BRUTALIST_DARK
              </div>
            </label>
          </div>
        </div>

        {/* PRIVACY_MODE Control */}
        <div className="bg-black text-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_#000000] md:shadow-[12px_12px_0px_#000000] relative h-full">
          <div className="absolute bg-zinc-500 opacity-80 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)] w-12 h-6 top-10 -right-2 rotate-90 z-10"></div>
          <h2 className="text-2xl md:text-3xl font-black uppercase mb-8 tracking-tighter">PRIVACY_MODE</h2>
          
          <div className="space-y-6">
            <div 
              className={`flex items-center justify-between p-4 border-2 cursor-pointer transition-colors ${privacyMode === 'private' ? 'border-liverpool-red bg-red-700/10' : 'border-white/20'}`}
              onClick={() => setPrivacyMode('private')}
            >
              <div>
                <p className="font-black uppercase">PRIVATE_VAULT</p>
                <p className="text-xs opacity-50 uppercase font-bold tracking-widest">ENCRYPTED.HIDDEN</p>
              </div>
              <button className={`w-12 h-6 border-2 relative transition-colors ${privacyMode === 'private' ? 'bg-liverpool-red border-white' : 'bg-stone-800 border-white/50'}`}>
                <span className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 transition-all ${privacyMode === 'private' ? 'right-1 bg-white' : 'left-1 bg-stone-500'}`}></span>
              </button>
            </div>
            
            <div 
              className={`flex items-center justify-between p-4 border-2 cursor-pointer transition-colors ${privacyMode === 'public' ? 'border-liverpool-red bg-red-700/10' : 'border-white/20'}`}
              onClick={() => setPrivacyMode('public')}
            >
              <div>
                <p className="font-black uppercase">PUBLIC_FEED</p>
                <p className="text-xs opacity-50 uppercase font-bold tracking-widest">BROADCAST.SYNC</p>
              </div>
              <button className={`w-12 h-6 border-2 relative transition-colors ${privacyMode === 'public' ? 'bg-liverpool-red border-white' : 'bg-stone-800 border-white/50'}`}>
                <span className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 transition-all ${privacyMode === 'public' ? 'right-1 bg-white' : 'left-1 bg-stone-500'}`}></span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DANGER_ZONE Section */}
      <section className="relative bg-white border-4 border-liverpool-red p-6 md:p-8 shadow-[8px_8px_0px_#C8102E] md:shadow-[12px_12px_0px_#C8102E]">
        <div className="absolute bg-zinc-500 opacity-50 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)] w-32 h-6 top-0 right-1/4 -translate-y-1/2 rotate-6 z-10 hidden md:block"></div>
        
        <div className="flex items-center gap-4 mb-6">
          <span className="material-symbols-outlined text-3xl md:text-4xl text-liverpool-red">warning</span>
          <h2 className="text-2xl md:text-3xl font-black uppercase text-liverpool-red border-b-4 border-black pb-1 tracking-tighter">DANGER_ZONE</h2>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-dashed border-liverpool-red p-6">
          <div className="text-center md:text-left">
            <p className="font-black uppercase text-xl mb-1">DELETE_ACCOUNT</p>
            <p className="text-xs uppercase opacity-80 max-w-sm font-bold leading-relaxed">
              PERMANENT DESTRUCTION OF ALL JOURNALS, METADATA, AND ARCHIVED MEDIA. THIS ACTION IS IRREVERSIBLE.
            </p>
          </div>
          <button 
            type="button"
            onClick={handleWipe}
            className="w-full md:w-auto px-8 md:px-10 py-4 border-4 border-liverpool-red text-liverpool-red font-black uppercase hover:bg-liverpool-red hover:text-white transition-all shadow-[6px_6px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none whitespace-nowrap tracking-wider"
          >
            EXECUTE.WIPE
          </button>
        </div>
      </section>

      {/* Action Button */}
      <div className="flex justify-center pt-16">
        <button 
          onClick={handleCommit}
          className="w-full lg:w-3/4 py-6 md:py-8 bg-liverpool-red text-white border-4 border-black text-xl md:text-2xl font-black uppercase shadow-[8px_8px_0px_#000000] md:shadow-[12px_12px_0px_#000000] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all active:scale-95 group flex items-center justify-center gap-4"
        >
          <span className="ink-bleed-text">COMMIT_CHANGES</span>
          <span className="material-symbols-outlined align-middle group-hover:rotate-45 transition-transform text-white text-3xl">send</span>
        </button>
      </div>

      {/* Footer Meta */}
      <footer className="mt-16 md:mt-24 text-center text-xs font-black opacity-30 uppercase tracking-[0.3em] md:tracking-[0.5em] pb-12 break-words text-pitch-black">
        B-JOURNAL // SESSION.REF: 992-X-KLA // NO.RETENTION.POLICY
      </footer>
    </>
  );
}