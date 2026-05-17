"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AlbumCard from './AlbumCard';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

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

export default function AlbumGrid() {
  const router = useRouter();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk Modal Form (Create & Update)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSelectedId, setEditSelectedId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [allPhotos, setAllPhotos] = useState<Array<{ id: number; title: string; imgSrc: string; albumId: number | null }>>([]);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<number[]>([]);
  const [initialAlbumPhotoIds, setInitialAlbumPhotoIds] = useState<number[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [photoQuery, setPhotoQuery] = useState('');
  const [coverPhotoId, setCoverPhotoId] = useState<number | null>(null);

  const coverKey = (albumId: number) => `bJournalAlbumCover_${albumId}`;
  const getStoragePath = (publicUrl: string) => {
    const marker = '/photos/';
    const index = publicUrl.indexOf(marker);
    return index >= 0 ? publicUrl.slice(index + marker.length) : '';
  };

  // State untuk Notifikasi
  const [notification, setNotification] = useState<{show: boolean, message: string}>({ show: false, message: '' });
  const [confirmAction, setConfirmAction] = useState<null | {
    type: 'delete-album' | 'delete-photo';
    albumId?: number;
    title?: string;
    photoId?: number;
    photoUrl?: string;
  }>(null);

  const DEFAULT_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuCpcFlZgPPYv4RXQx9RvyxQovAv_H8nTrJMWFk8amvtB0u9Hgr18YcSxmhoR4tNhqxrILKTnItKO1fG2LNpAlTb2Ga0UpputArMu-uGytY6eUZDPrHLGOrg1LuQ4eV_OShMK2dvaNdOi_jgr41PBZ1bPjBTkGwdTTERs8tSyK54gSAcQVf9JGpycdjw_vYLRmoqaLcscrG9jTHMD8zpSL4Tqof83HKJyVHiwMniwb_bcSEOk5MR9S4ZAc5SUCtK9RuUohcV1rgSOls";

  const fetchAlbums = async () => {
    try {
      const storedUser = localStorage.getItem('bJournalUser');
      if (!storedUser) return;
      const user = JSON.parse(storedUser);

      const { data, error } = await supabase
        .from('album')
        .select('*, foto(LokasiFile)')
        .eq('UserID', user.UserID);

      if (error) {
        throw error;
      }

      if (data) {
        const formattedAlbums = data.map((item: any) => ({
          id: item.AlbumID,
          title: item.NamaAlbum,
          description: item.Deskripsi || '',
          photoCount: item.foto?.length || 0,
          updateTime: item.TanggalDibuat,
          imgSrc: item.foto && item.foto.length > 0 ? item.foto[0].LokasiFile : DEFAULT_IMAGE
        }));

        const withCover = formattedAlbums.map((album) => {
          const albumPhotos = data.find((item: any) => item.AlbumID === album.id)?.foto || [];
          const albumUrls = albumPhotos.map((photo: any) => photo.LokasiFile);
          const storedCover = localStorage.getItem(coverKey(album.id));
          const coverUrl = storedCover && albumUrls.includes(storedCover) ? storedCover : null;
          return {
            ...album,
            imgSrc: coverUrl || album.imgSrc
          };
        });

        setAlbums(withCover);
      }
    } catch (err: any) {
      console.error('Error fetching albums:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const showNotification = (message: string) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  const handleOpenAdd = () => {
    setEditSelectedId(null);
    setFormData({ title: '', description: '' });
    setAllPhotos([]);
    setSelectedPhotoIds([]);
    setInitialAlbumPhotoIds([]);
    setCoverPhotoId(null);
    setPhotoQuery('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (album: Album) => {
    setEditSelectedId(album.id);
    setFormData({ title: album.title, description: album.description });
    setPhotoQuery('');
    setIsModalOpen(true);
    loadAlbumPhotos(album.id);
  };

  const loadAlbumPhotos = async (albumId: number) => {
    setIsLoadingPhotos(true);
    const storedUser = localStorage.getItem('bJournalUser');
    if (!storedUser) {
      setIsLoadingPhotos(false);
      return;
    }

    const user = JSON.parse(storedUser);
    const { data, error } = await supabase
      .from('foto')
      .select('FotoID, JudulFoto, LokasiFile, AlbumID')
      .eq('UserID', user.UserID)
      .eq('AlbumID', albumId)
      .order('TanggalUnggah', { ascending: false });

    if (error || !data) {
      setIsLoadingPhotos(false);
      return;
    }

    const normalized = data.map((photo: any) => ({
      id: photo.FotoID,
      title: photo.JudulFoto || 'Untitled',
      imgSrc: photo.LokasiFile,
      albumId: photo.AlbumID
    }));

    const albumPhotoIds = normalized.filter((photo) => photo.albumId === albumId).map((photo) => photo.id);
    const storedCoverUrl = localStorage.getItem(coverKey(albumId));
    const storedCoverId = storedCoverUrl ? normalized.find((photo) => photo.imgSrc === storedCoverUrl)?.id || null : null;
    setAllPhotos(normalized);
    setSelectedPhotoIds(albumPhotoIds);
    setInitialAlbumPhotoIds(albumPhotoIds);
    setCoverPhotoId(storedCoverId || albumPhotoIds[0] || null);
    setIsLoadingPhotos(false);
  };

  const handleSelectAll = () => {
    setSelectedPhotoIds(allPhotos.map((photo) => photo.id));
    if (!coverPhotoId && allPhotos.length > 0) setCoverPhotoId(allPhotos[0].id);
  };

  const handleClearAll = () => {
    setSelectedPhotoIds([]);
    setCoverPhotoId(null);
  };

  const deletePhoto = async (photoId: number, photoUrl: string) => {
    const storagePath = getStoragePath(photoUrl);
    if (!storagePath) {
      showNotification('Gagal membaca lokasi file.');
      return;
    }

    const { error: storageError } = await supabase.storage.from('photos').remove([storagePath]);
    if (storageError) {
      showNotification('Gagal menghapus file foto.');
      return;
    }

    const { error: dbError } = await supabase.from('foto').delete().eq('FotoID', photoId);
    if (dbError) {
      showNotification('Gagal menghapus data foto.');
      return;
    }

    const nextAllPhotos = allPhotos.filter((photo) => photo.id !== photoId);
    const nextSelected = selectedPhotoIds.filter((id) => id !== photoId);
    const nextInitial = initialAlbumPhotoIds.filter((id) => id !== photoId);
    let nextCover = coverPhotoId;

    if (nextCover === photoId) {
      nextCover = nextSelected[0] || null;
    }

    setAllPhotos(nextAllPhotos);
    setSelectedPhotoIds(nextSelected);
    setInitialAlbumPhotoIds(nextInitial);
    setCoverPhotoId(nextCover);

    if (editSelectedId) {
      if (nextCover) {
        const coverPhoto = nextAllPhotos.find((photo) => photo.id === nextCover);
        if (coverPhoto) localStorage.setItem(coverKey(editSelectedId), coverPhoto.imgSrc);
      } else {
        localStorage.removeItem(coverKey(editSelectedId));
      }
    }

    await fetchAlbums();
    showNotification('Foto berhasil dihapus.');
  };

  const requestDeletePhoto = (photoId: number, photoUrl: string) => {
    setConfirmAction({ type: 'delete-photo', photoId, photoUrl });
  };

  const togglePhotoSelection = (photoId: number) => {
    setSelectedPhotoIds((prev) => {
      if (prev.includes(photoId)) {
        const next = prev.filter((id) => id !== photoId);
        if (coverPhotoId === photoId) setCoverPhotoId(next[0] || null);
        return next;
      }
      const next = [...prev, photoId];
      if (!coverPhotoId) setCoverPhotoId(photoId);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const storedUser = localStorage.getItem('bJournalUser');
    if (!storedUser) return;
    const user = JSON.parse(storedUser);

    if (editSelectedId) {
      // Update Data in Supabase
      const { error } = await supabase
        .from('album')
        .update({ NamaAlbum: formData.title, Deskripsi: formData.description })
        .eq('AlbumID', editSelectedId);

      if (error) {
        showNotification(`Gagal update album!`);
        return;
      }

      const toAdd = selectedPhotoIds.filter((id) => !initialAlbumPhotoIds.includes(id));
      const toRemove = initialAlbumPhotoIds.filter((id) => !selectedPhotoIds.includes(id));

      let nextCoverId = coverPhotoId;
      if (nextCoverId && !selectedPhotoIds.includes(nextCoverId)) {
        nextCoverId = selectedPhotoIds[0] || null;
      }

      if (toAdd.length > 0) {
        await supabase
          .from('foto')
          .update({ AlbumID: editSelectedId })
          .in('FotoID', toAdd);
      }

      if (toRemove.length > 0) {
        await supabase
          .from('foto')
          .update({ AlbumID: null })
          .in('FotoID', toRemove);
      }

      if (nextCoverId) {
        const coverPhoto = allPhotos.find((photo) => photo.id === nextCoverId);
        if (coverPhoto) localStorage.setItem(coverKey(editSelectedId), coverPhoto.imgSrc);
      } else {
        localStorage.removeItem(coverKey(editSelectedId));
      }

      await fetchAlbums();
      showNotification(`Album "${formData.title}" berhasil diupdate!`);
    } else {
      // Save New Data to Supabase
      const { data, error } = await supabase
        .from('album')
        .insert([{ 
          NamaAlbum: formData.title, 
          Deskripsi: formData.description,
          TanggalDibuat: new Date().toISOString().split('T')[0],
          UserID: user.UserID
        }])
        .select()
        .single();

      if (!error && data) {
        const newAlbum: Album = {
          id: data.AlbumID,
          title: data.NamaAlbum,
          description: data.Deskripsi || '',
          photoCount: 0,
          updateTime: data.TanggalDibuat,
          imgSrc: DEFAULT_IMAGE,
        };
        setAlbums([newAlbum, ...albums]);
        setIsModalOpen(false);
        router.push(`/upload?albumId=${data.AlbumID}`);
        return;
      } else {
        showNotification(`Gagal membuat album!`);
      }
    }
    setIsModalOpen(false);
  };

  const deleteAlbum = async (id: number, title: string) => {
    const { data: photos } = await supabase.from('foto').select('LokasiFile').eq('AlbumID', id);

    if (photos && photos.length > 0) {
      const filePaths = photos.map((p: any) => {
        const url = p.LokasiFile;
        const parts = url.split('/public/photos/');
        return parts.length > 1 ? parts[1] : null;
      }).filter(Boolean);

      if (filePaths.length > 0) {
        await supabase.storage.from('photos').remove(filePaths);
      }

      await supabase.from('foto').delete().eq('AlbumID', id);
    }

    const { error } = await supabase.from('album').delete().eq('AlbumID', id);
    if (!error) {
      setAlbums(albums.filter(album => album.id !== id));
      showNotification(`Album "${title}" beserta isinya berhasil dihapus!`);
    } else {
      showNotification(`Gagal menghapus album!`);
      console.error(error);
    }
  };

  const requestDeleteAlbum = (albumId: number, title: string) => {
    setConfirmAction({ type: 'delete-album', albumId, title });
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    const action = confirmAction;
    setConfirmAction(null);

    if (action.type === 'delete-photo' && action.photoId && action.photoUrl) {
      await deletePhoto(action.photoId, action.photoUrl);
      return;
    }

    if (action.type === 'delete-album' && action.albumId && action.title) {
      await deleteAlbum(action.albumId, action.title);
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

        <ConfirmDialog
          open={!!confirmAction}
          title={confirmAction?.type === 'delete-album' ? 'Hapus album?' : 'Hapus foto?'}
          message={
            confirmAction?.type === 'delete-album'
              ? `Album "${confirmAction?.title || ''}" dan semua fotonya akan dihapus permanen.`
              : 'Foto ini akan dihapus permanen dari album dan storage.'
          }
          confirmLabel="Ya, hapus"
          cancelLabel="Batal"
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirmAction(null)}
        />

        {/* Add New Card (Micu Modal Add) */}
        <button onClick={handleOpenAdd} className="distressed-card group cursor-pointer bg-[#e8e4db] aspect-[4/3] flex flex-col items-center justify-center transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_rgba(0,0,0,0.9)] w-full">
          <div className="w-16 h-16 bg-liverpool-red rounded-full border-2 border-pitch-black flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-white text-4xl">add</span>
          </div>
          <span className="font-headline-md font-black tracking-tighter uppercase text-pitch-black text-xl">Add New</span>
        </button>

        {isLoading ? (
          <div className="col-span-full py-20 text-center font-black text-2xl uppercase tracking-tighter text-pitch-black animate-pulse">
            LOADING ALBUMS...
          </div>
        ) : (
          albums.map((album) => (
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
              onDelete={() => requestDeleteAlbum(album.id, album.title)}
            />
          ))
        )}
      </div>

      {/* Modal Popup Create/Update */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border-4 border-pitch-black p-6 md:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[12px_12px_0px_0px_rgba(200,16,46,1)] relative">
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

            {editSelectedId && (
              <div className="mt-6 border-t-4 border-pitch-black pt-5">
                <div className="flex flex-col gap-3 mb-4">
                  <h3 className="text-lg font-black uppercase text-pitch-black">Manage Photos</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      value={photoQuery}
                      onChange={(e) => setPhotoQuery(e.target.value)}
                      placeholder="Search photo title..."
                      className="flex-1 border-2 border-pitch-black p-2 font-body-md normal-case text-pitch-black"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="px-3 py-2 border-2 border-pitch-black bg-white text-pitch-black hover:bg-stadium-grey transition-colors"
                      >
                        Select all
                      </button>
                      <button
                        type="button"
                        onClick={handleClearAll}
                        className="px-3 py-2 border-2 border-pitch-black bg-white text-pitch-black hover:bg-stadium-grey transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
                {isLoadingPhotos ? (
                  <div className="py-6 text-center font-black uppercase text-pitch-black animate-pulse">
                    Loading photos...
                  </div>
                ) : allPhotos.length === 0 ? (
                  <div className="py-6 text-center font-black uppercase text-tertiary border-2 border-dashed border-pitch-black">
                    No photos yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                    {allPhotos
                      .filter((photo) => photo.title.toLowerCase().includes(photoQuery.toLowerCase()))
                      .map((photo) => {
                      const isSelected = selectedPhotoIds.includes(photo.id);
                      const isCover = coverPhotoId === photo.id;
                      return (
                        <div
                          key={photo.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => togglePhotoSelection(photo.id)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              togglePhotoSelection(photo.id);
                            }
                          }}
                          className={`border-2 p-2 text-left transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-pitch-black ${isSelected ? 'border-liverpool-red bg-zinc-100' : 'border-pitch-black bg-white'}`}
                        >
                          <div className="aspect-square w-full overflow-hidden border-2 border-pitch-black mb-2">
                            <img src={photo.imgSrc} alt={photo.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="text-[10px] font-black uppercase text-pitch-black line-clamp-2">{photo.title}</div>
                          <div className="flex items-center justify-between text-[9px] uppercase font-bold mt-1 text-secondary gap-2">
                            <span>{isSelected ? 'In album' : 'Not in album'}</span>
                            <div className="flex items-center gap-1 flex-wrap justify-end">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isSelected) setSelectedPhotoIds((prev) => [...prev, photo.id]);
                                  setCoverPhotoId(photo.id);
                                }}
                                className={`px-2 py-0.5 border border-pitch-black ${isCover ? 'bg-liverpool-red text-white' : 'bg-white text-pitch-black'}`}
                              >
                                Cover
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  requestDeletePhoto(photo.id, photo.imgSrc);
                                }}
                                className="px-2 py-0.5 border border-pitch-black bg-white text-pitch-black hover:bg-liverpool-red hover:text-white"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}