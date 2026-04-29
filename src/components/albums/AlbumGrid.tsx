"use client";

import React, { useState } from 'react';
import AlbumCard from './AlbumCard';

interface Album {
  id: number;
  title: string;
  description: string;
  photoCount: number;
  updateTime: string;
  imgSrc: string;
  tapeStyle?: React.CSSProperties;
  titleBgColor?: string;
  titleTextColor?: string;
}

const INITIAL_ALBUMS: Album[] = [
  {
    id: 1,
    title: "Urban '23",
    description: "Kumpulan foto arsitektur dan jalanan kota bernuansa brutalist.",
    photoCount: 142,
    updateTime: "2 days ago",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpcFlZgPPYv4RXQx9RvyxQovAv_H8nTrJMWFk8amvtB0u9Hgr18YcSxmhoR4tNhqxrILKTnItKO1fG2LNpAlTb2Ga0UpputArMu-uGytY6eUZDPrHLGOrg1LuQ4eV_OShMK2dvaNdOi_jgr41PBZ1bPjBTkGwdTTERs8tSyK54gSAcQVf9JGpycdjw_vYLRmoqaLcscrG9jTHMD8zpSL4Tqof83HKJyVHiwMniwb_bcSEOk5MR9S4ZAc5SUCtK9RuUohcV1rgSOls",
    tapeStyle: { top: "10px", right: "-10px", transform: "rotate(45deg)", backgroundColor: "#d1d5db" }
  },
  {
    id: 2,
    title: "Studio Portraits",
    description: "Koleksi foto potret di studio dengan pencahayaan kontras tinggi.",
    photoCount: 56,
    updateTime: "1 week ago",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuByCEirRcAI3BvUor3jlvCXlWhk1qSKIP8vXgpsOO8kO0o7c7UwL6ioV6BY9eg42HbAZAFsd9_b6lu2Ws4wA63Mh6YJB3nHTn5gwha16M-gU6HIqvfNcRbDyQF4brWH7VKJPA4pVkZ3w-ffw5DpUhZxFpfuEdD5OAq-KmszTpJjrYCqwG9h2ffshJffuHF4pLP6wQHETELGIHFvcWxqmumCpL-a9Z4lGt-EjU03qwOC3A4-oHkiBP9BR55ZAJqemvv81jvb5Ot6cqg",
    tapeStyle: { top: "20px", right: "-5px", transform: "rotate(30deg)", backgroundColor: "#ef4444" }
  },
  {
    id: 3,
    title: "Street Grits",
    description: "Jalanan malam yang gelap dan berhujan, penuh butiran film.",
    photoCount: 304,
    updateTime: "Today",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbX7MqHp99Sq7U08AGqmMxHycajv9HLEu3SmuuJzzXxr0ZYAH57zYx4SuvyqLwh7t3wIdIY0E736ItV3aQuk0jC_ApC5AFY-KUnCQTHS1VuquuqkncSigCgTGURD5xSk3AjyO0KJvY-bMhXb4pT-TE0NrlsMhht6_WlSP4su8TgEyTJq-MBXoIiu8TNiffnmT_scvnIf-uc_i_b3b0vPJqcW-jssGzYvVOSQ4-rjqLhfqBb6IHtFiigZH1uq05HfeMBkmSqqJGnPs",
    titleBgColor: "bg-liverpool-red",
    titleTextColor: "text-white"
  }
];

export default function AlbumGrid() {
  const [albums, setAlbums] = useState<Album[]>(INITIAL_ALBUMS);
  
  // State untuk Modal Form (Create & Update)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSelectedId, setEditSelectedId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '' });

  // State untuk Notifikasi (Sesuai DFD: "Notif berhasil")
  const [notification, setNotification] = useState<{show: boolean, message: string}>({ show: false, message: '' });

  // Memunculkan Notifikasi
  const showNotification = (message: string) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  // Handler Buka Modal Tambah Baru
  const handleOpenAdd = () => {
    setEditSelectedId(null);
    setFormData({ title: '', description: '' });
    setIsModalOpen(true);
  };

  // Handler Buka Modal Edit
  const handleOpenEdit = (album: Album) => {
    setEditSelectedId(album.id);
    setFormData({ title: album.title, description: album.description });
    setIsModalOpen(true);
  };

  // Handler Submit Form (Create / Update)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editSelectedId) {
      // Update Data
      setAlbums(albums.map(acc => 
        acc.id === editSelectedId 
          ? { ...acc, title: formData.title, description: formData.description, updateTime: "Just now" } 
          : acc
      ));
      showNotification(`Album "${formData.title}" berhasil diupdate!`);
    } else {
      // Simpan Data Baru
      const newAlbum: Album = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        photoCount: 0,
        updateTime: "Just now",
        imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbb0XrIbS3JGrrbQsq3t26eJDAAQMgD0M4wGrrRDrMyZL5WBprR-GCW4cBDJjyGgaIzBFYeAD2x0NUVOZyouIoKq-MLxHVg_I1Oi7NbKVqyuyCQO7IFSdB1-hMHQbjmhFIEBLdT_7wSfSgH0XPGS_MitZLf-VbOX2dmbKuQ7JRPiIAjQLSlqSflGJZF6u447cTyewm9C0UKHQuFkiFeDQm2sbO-ueToJwKc6cDNrrCOlmTuXP7qU0B2gVoh-GG1RtdgnD3qPfbHsc", // Placeholder image
      };
      setAlbums([newAlbum, ...albums]);
      showNotification(`Album "${formData.title}" berhasil dibuat!`);
    }
    setIsModalOpen(false);
  };

  // Handler Hapus Record
  const handleDelete = (id: number, title: string) => {
    if (window.confirm(`Yakin ingin menghapus album "${title}"?`)) {
      setAlbums(albums.filter(album => album.id !== id));
      showNotification(`Album "${title}" berhasil dihapus!`);
    }
  };

  return (
    <>
      {/* Container utama Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative">
        
        {/* Notifikasi Toast (Sesuai DFD) */}
        {notification.show && (
          <div className="fixed top-8 right-8 z-[100] bg-liverpool-red text-white p-4 font-bold border-4 border-pitch-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest animate-bounce">
            <span className="material-symbols-outlined align-middle mr-2">check_circle</span>
            {notification.message}
          </div>
        )}

        {/* Add New Card (Micu Modal Add) */}
        <button onClick={handleOpenAdd} className="distressed-card group cursor-pointer bg-[#e8e4db] aspect-[4/3] flex flex-col items-center justify-center transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_rgba(0,0,0,0.9)] w-full">
          <div className="w-16 h-16 bg-liverpool-red rounded-full border-2 border-pitch-black flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-white text-4xl">add</span>
          </div>
          <span className="font-headline-md font-black tracking-tighter uppercase text-pitch-black text-xl">Add New</span>
        </button>

        {/* Render Dummy Albums State */}
        {albums.map((album) => (
          <AlbumCard
            key={album.id}
            title={album.title}
            photoCount={album.photoCount}
            updateTime={album.updateTime}
            imgSrc={album.imgSrc}
            tapeStyle={album.tapeStyle}
            titleBgColor={album.titleBgColor}
            titleTextColor={album.titleTextColor}
            onEdit={() => handleOpenEdit(album)}
            onDelete={() => handleDelete(album.id, album.title)}
          />
        ))}
      </div>

      {/* Modal Popup Create/Update */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border-4 border-pitch-black p-6 w-full max-w-md shadow-[12px_12px_0px_0px_rgba(200,16,46,1)] rotate-1 relative">
            <div className="absolute -top-3 -left-3 w-20 h-6 bg-zinc-400 opacity-80 -rotate-12 border border-white"></div>
            
            <h2 className="text-2xl font-black uppercase text-pitch-black mb-6 tracking-tighter border-b-4 border-pitch-black pb-2">
              {editSelectedId ? 'Update Album' : 'Buat Album Baru'}
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-body-md font-bold uppercase">
              {/* Input Nama Album */}
              <div className="flex flex-col gap-1">
                <label className="text-pitch-black">Nama Album</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ketik nama album..."
                  autoFocus
                  required
                  className="bg-stadium-grey border-2 border-pitch-black p-2 focus:outline-none focus:border-liverpool-red font-body-md normal-case text-pitch-black"
                />
              </div>

              {/* Input Deskripsi Album */}
              <div className="flex flex-col gap-1">
                <label className="text-pitch-black">Deskripsi</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ceritakan sedikit tentang album ini..."
                  rows={3}
                  className="bg-stadium-grey border-2 border-pitch-black p-2 focus:outline-none focus:border-liverpool-red font-body-md normal-case text-pitch-black"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="bg-stadium-grey px-4 py-2 border-2 border-pitch-black hover:bg-zinc-300 transition-colors text-pitch-black"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="bg-liverpool-red px-6 py-2 border-2 border-pitch-black text-white hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  {editSelectedId ? 'Update Data' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}