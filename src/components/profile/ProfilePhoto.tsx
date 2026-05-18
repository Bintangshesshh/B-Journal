"use client";

import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ImageCropDialog from '@/components/ui/ImageCropDialog';

type ProfileUser = {
  userId: number;
  username: string;
  email: string | null;
};

export default function ProfilePhoto() {
  const [notification, setNotification] = useState<{ show: boolean, message: string }>({ show: false, message: '' });
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [pendingFileType, setPendingFileType] = useState('image/jpeg');
  const [pendingFileName, setPendingFileName] = useState('profile');
  const [isCropOpen, setIsCropOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showNotification = (message: string) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  useEffect(() => {
    const loadProfile = async () => {
      const storedUser = localStorage.getItem('bJournalUser');
      if (!storedUser) {
        setIsLoading(false);
        return;
      }

      let userId: number | null = null;
      let fallbackUsername = 'user';
      try {
        const parsedUser = JSON.parse(storedUser);
        userId = parsedUser.UserID;
        fallbackUsername = parsedUser.Username || fallbackUsername;
      } catch {
        setIsLoading(false);
        return;
      }

      if (!userId) {
        setIsLoading(false);
        return;
      }

      const { data: userData } = await supabase
        .from('user')
        .select('UserID, Username, Email, FotoProfil')
        .eq('UserID', userId)
        .single();

      setProfile({
        userId,
        username: userData?.Username || fallbackUsername,
        email: userData?.Email || null
      });
      setAvatarUrl(userData?.FotoProfil || null);
      setIsLoading(false);
    };

    loadProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('bJournalUser');
    showNotification('Logout berhasil. Mengalihkan ke login...');
    setTimeout(() => window.location.assign('/login'), 800);
  };

  const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const storedUser = localStorage.getItem('bJournalUser');
    if (!storedUser) {
      showNotification('Silakan login dulu.');
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    setCropSrc(nextUrl);
    setPendingFileType(file.type || 'image/jpeg');
    setPendingFileName(file.name || 'profile');
    setIsCropOpen(true);
  };

  const handleCropCancel = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    setIsCropOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCropConfirm = async (blob: Blob) => {
    const storedUser = localStorage.getItem('bJournalUser');
    if (!storedUser) {
      showNotification('Silakan login dulu.');
      handleCropCancel();
      return;
    }

    let userId: number | null = null;
    try {
      userId = Number(JSON.parse(storedUser).UserID);
    } catch {
      showNotification('Sesi login tidak valid.');
      handleCropCancel();
      return;
    }

    if (!userId || Number.isNaN(userId)) {
      showNotification('Sesi login tidak valid.');
      handleCropCancel();
      return;
    }

    setIsUploading(true);
    try {
      const extFromName = pendingFileName.split('.').pop();
      const extFromType = pendingFileType.split('/').pop();
      const fileExt = extFromName || extFromType || 'jpg';
      const fileName = `profile-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      const uploadFile = new File([blob], fileName, { type: pendingFileType });

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, uploadFile, { upsert: true });

      if (uploadError) throw new Error(uploadError.message);

      const { data: publicUrlData } = supabase.storage.from('photos').getPublicUrl(filePath);
      const photoUrl = publicUrlData.publicUrl;

      const { error: dbError } = await supabase
        .from('user')
        .update({ FotoProfil: photoUrl })
        .eq('UserID', userId);

      if (dbError) throw new Error(dbError.message);

      setAvatarUrl(photoUrl);
      showNotification('Foto profil berhasil diupdate!');
    } catch (err: any) {
      showNotification(`Gagal upload foto profil: ${err.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      handleCropCancel();
    }
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

      <ImageCropDialog
        open={isCropOpen}
        imageSrc={cropSrc}
        title="Crop Profile Photo"
        aspectMode="square"
        fileType={pendingFileType}
        confirmLabel="Use Photo"
        onConfirm={handleCropConfirm}
        onCancel={handleCropCancel}
      />

      {/* Profile Image Container */}
      <div className="relative group mb-8">
        {/* Red Shadow Box */}
        <div className="absolute -right-4 top-4 w-full h-full bg-liverpool-red border-4 border-pitch-black"></div>
        
        {/* Photo Box */}
        <div className="relative border-4 border-pitch-black bg-white overflow-hidden shadow-[8px_8px_0_0_rgba(0,0,0,0.15)]">
          {isLoading ? (
            <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center bg-stadium-grey animate-pulse">
              <span className="font-black uppercase text-tertiary">Loading...</span>
            </div>
          ) : avatarUrl ? (
            <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-stadium-grey p-4 flex items-center justify-center">
              <img 
                alt="Main Profile Photo" 
                className="w-full h-full object-contain" 
                src={avatarUrl}
              />
            </div>
          ) : (
            <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center bg-stadium-grey">
              <span className="material-symbols-outlined text-6xl text-pitch-black">person</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePhotoChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute bottom-0 right-0 bg-white border-t-4 border-l-4 border-pitch-black px-4 py-2 font-black text-xs uppercase hover:bg-pitch-black hover:text-white transition-colors tracking-tighter disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isUploading ? 'UPLOADING...' : 'UPLOAD.PHOTO'}
          </button>
        </div>
      </div>

      {/* Details Container */}
      <div className="text-center w-full border-t-4 border-pitch-black pt-6 relative">
        <div className="absolute bg-zinc-500 opacity-80 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)] w-16 h-4 -top-2 right-10 rotate-[-8deg]"></div>
        
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 text-pitch-black uppercase italic">
          {profile ? `@${profile.username}` : 'User.Profile'}
        </h2>
        
        <div className="inline-block px-4 py-1 bg-stadium-grey border-2 border-pitch-black">
          <span className="text-liverpool-red text-lg md:text-xl font-black tracking-[0.2em]">
            {profile ? `ACCESS_GRANTED.${profile.userId}` : 'ACCESS_GRANTED'}
          </span>
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