"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function UploadForm() {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [notification, setNotification] = useState<{show: boolean, message: string}>({ show: false, message: '' });
  
  // State Form
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState('');
  
  // State Album (Ambil dari DB + Bikin Baru)
  const [albums, setAlbums] = useState<any[]>([]);
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  
  // State Data User & Loading
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ambil data user yang login dari localStorage
    const userStr = localStorage.getItem("bJournalUser");
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      fetchAlbums(user.UserID);
    } else {
      showNotification("ACCESS DENIED: Harap login terlebih dahulu.");
      setTimeout(() => router.push("/login"), 1500);
    }
  }, [router]);

  const fetchAlbums = async (userId: string | number) => {
    const { data, error } = await supabase
      .from('album')
      .select('*')
      .eq('UserID', userId);
    
    if (!error && data) {
      setAlbums(data);
    }
  };

  // Basic Simulation Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
      showNotification(`File "${droppedFile.name}" siap diunggah!`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      showNotification(`File "${selectedFile.name}" siap diunggah!`);
    }
  };

  const handleSubmit = async () => {
    if (!currentUser) return showNotification("ERROR: Sesi login tidak valid!");
    if (!file) return showNotification("ERROR: Belum ada foto yang dipilih!");
    if (!title) return showNotification("ERROR: Title tidak boleh kosong!");

    setLoading(true);

    try {
      let finalAlbumId = selectedAlbum;

      // 1. Kalau user milih bikin album baru
      if (isCreatingAlbum && newAlbumName) {
        const { data: newAlbum, error: albumErr } = await supabase
          .from('album')
          .insert([{ 
            NamaAlbum: newAlbumName, 
            Deskripsi: 'Album otomatis dibuat dari upload page', 
            TanggalDibuat: new Date().toISOString().split('T')[0], 
            UserID: currentUser.UserID 
          }])
          .select()
          .single();
          
        if (albumErr) throw new Error("Gagal buat album: " + albumErr.message);
        finalAlbumId = newAlbum.AlbumID;
      }

      // 2. Upload File Foto ke Supabase Storage (Bucket "photos")
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2,9)}.${fileExt}`;
      const filePath = `${currentUser.UserID}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file);

      if (uploadError) throw new Error("Gagal upload foto ke storage: " + uploadError.message);

      // Ambil Public URL dari foto yang baru di-upload
      const { data: publicUrlData } = supabase.storage.from('photos').getPublicUrl(filePath);
      const photoUrl = publicUrlData.publicUrl;

      // 3. Masukin data ke tabel foto
      const { error: dbError } = await supabase.from('foto').insert([{
        JudulFoto: title,
        DeskripsiFoto: caption,
        TanggalUnggah: new Date().toISOString().split('T')[0],
        LokasiFile: photoUrl,
        AlbumID: finalAlbumId ? finalAlbumId : null,
        UserID: currentUser.UserID
      }]);

      if (dbError) throw new Error("Gagal simpan db: " + dbError.message);

      // Sukses
      showNotification("SUCCESS: Foto berhasil dipublish!");
      
      // Tunggu bentar trus pindah ke home / halaman utama
      setTimeout(() => {
        router.push("/");
      }, 2000);

    } catch (err: any) {
      showNotification(err.message || "Terjadi kesalahan!");
      setLoading(false);
    }
  };

  const showNotification = (message: string) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  return (
    <>
      {/* Toast Notification (Simulasi Berhasil) */}
      {notification.show && (
        <div className="fixed top-8 right-8 z-[100] bg-liverpool-red text-white p-4 font-bold border-4 border-pitch-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest animate-bounce">
          <span className="material-symbols-outlined align-middle mr-2">check_circle</span>
          {notification.message}
        </div>
      )}

      <div className="w-full max-w-2xl bg-white border-4 border-pitch-black shadow-[12px_12px_0px_0px_rgba(10,10,10,1)] p-8 md:p-10 relative z-10 my-8">
        
        {/* Duct Tape Accents */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-40 h-8 bg-zinc-300 opacity-90 rotate-2 border border-zinc-400 z-20"></div>
        <div className="absolute -bottom-4 right-8 w-24 h-8 bg-zinc-300 opacity-90 -rotate-3 border border-zinc-400 z-20"></div>
        
        <h2 className="font-headline-lg text-4xl font-black text-pitch-black uppercase mb-8 border-b-4 border-pitch-black pb-4 inline-block">Upload Photo</h2>
        
        {/* Drag & Drop Zone */}
        <div 
          className={`border-4 border-dashed border-pitch-black transition-colors group cursor-pointer h-64 flex flex-col items-center justify-center gap-4 mb-8 relative overflow-hidden ${dragActive ? 'bg-zinc-200 border-liverpool-red' : 'bg-stadium-grey hover:bg-zinc-200'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => {
            const input = document.getElementById('file-upload');
            if(input) input.click();
          }}
        >
          <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
          
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all halftone-effect" />
          ) : (
            <>
              <span className={`material-symbols-outlined text-6xl transition-all duration-300 ${dragActive ? 'text-liverpool-red scale-110' : 'text-pitch-black group-hover:text-liverpool-red group-hover:scale-110'}`}>add</span>
              
              <p className={`font-label-lg font-bold uppercase text-center max-w-xs leading-relaxed transition-colors ${dragActive ? 'text-liverpool-red' : 'text-pitch-black group-hover:text-liverpool-red'}`}>
                Drag and drop your photos here<br/>
                <span className="text-zinc-500 lowercase font-body-sm font-normal">or click to browse</span>
              </p>
            </>
          )}
          
          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-pitch-black z-10"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-pitch-black z-10"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-pitch-black z-10"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-pitch-black z-10"></div>
        </div>
        
        {/* Form Fields */}
        <div className="flex flex-col gap-6">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="font-label-lg font-bold uppercase text-pitch-black" htmlFor="title">Title <span className="text-liverpool-red">*</span></label>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-2 border-pitch-black bg-white p-4 font-body-md text-pitch-black placeholder-zinc-400 focus:outline-none focus:border-liverpool-red focus:shadow-[4px_4px_0px_0px_rgba(200,16,46,1)] transition-all rounded-none uppercase" 
              id="title" 
              placeholder="ENTER PHOTO TITLE" 
              type="text"
            />
          </div>
          
          {/* Album Selection */}
          <div className="flex flex-col gap-2">
            <label className="font-label-lg font-bold uppercase text-pitch-black" htmlFor="album">Select Album</label>
            <div className="relative">
              <select 
                value={isCreatingAlbum ? 'CREATE_NEW' : selectedAlbum}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'CREATE_NEW') {
                    setIsCreatingAlbum(true);
                    setSelectedAlbum('');
                  } else {
                    setIsCreatingAlbum(false);
                    setSelectedAlbum(val);
                  }
                }}
                className="w-full border-2 border-pitch-black bg-white p-4 font-body-md text-pitch-black appearance-none focus:outline-none focus:border-liverpool-red focus:shadow-[4px_4px_0px_0px_rgba(200,16,46,1)] transition-all uppercase rounded-none cursor-pointer" 
                id="album"
              >
                <option value="">-- CHOOSE AN ALBUM (OPTIONAL) --</option>
                {albums.map((al) => (
                  <option key={al.AlbumID} value={al.AlbumID}>{al.NamaAlbum}</option>
                ))}
                <option className="font-bold text-liverpool-red bg-zinc-200" value="CREATE_NEW">+ CREATE NEW ALBUM...</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-pitch-black">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>
            
            {/* Input khusus buat Nama Album Baru kalo user milih CREATE_NEW */}
            {isCreatingAlbum && (
              <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <input 
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  className="w-full border-2 border-liverpool-red border-dashed bg-zinc-100 p-4 font-body-md text-pitch-black placeholder-zinc-400 focus:outline-none focus:border-solid focus:shadow-[4px_4px_0px_0px_rgba(200,16,46,1)] transition-all rounded-none uppercase" 
                  placeholder="NEW ALBUM NAME..." 
                  type="text"
                />
              </div>
            )}
          </div>
          
          {/* Caption */}
          <div className="flex flex-col gap-2">
            <label className="font-label-lg font-bold uppercase text-pitch-black" htmlFor="caption">Caption / Story</label>
            <textarea 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full border-2 border-pitch-black bg-white p-4 font-body-md text-pitch-black placeholder-zinc-400 resize-none focus:outline-none focus:border-liverpool-red focus:shadow-[4px_4px_0px_0px_rgba(200,16,46,1)] transition-all rounded-none uppercase" 
              id="caption" 
              placeholder="TELL THE STORY BEHIND THIS SHOT..." 
              rows={4}
            ></textarea>
          </div>
          
          {/* Submit Button */}
          <button 
            type="button" 
            onClick={handleSubmit}
            disabled={loading}
            className={`mt-4 w-full text-white font-headline-sm font-black text-xl uppercase tracking-wider py-5 border-4 border-pitch-black transition-all ${
              loading 
                ? 'bg-zinc-600 grayscale cursor-not-allowed shadow-none translate-y-2 translate-x-2' 
                : 'bg-liverpool-red shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] active:translate-y-2 active:translate-x-2 active:shadow-none'
            }`}
          >
            {loading ? 'UPLOADING...' : 'Publish to Journal'}
          </button>
        </div>
      </div>
    </>
  );
}