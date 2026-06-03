import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, userId } = body;

    if (!title || !description) {
      return NextResponse.json({ success: false, message: 'Data wajib diisi!' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('album') 
      .insert([
        { 
          NamaAlbum: title, 
          Deskripsi: description,
          TanggalDibuat: new Date().toISOString().split('T')[0],
          UserID: userId ? Number(userId) : 1
        }
      ])
      .select('AlbumID')
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Album sukses disimpan!', data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('album')
      .select(`
        AlbumID,
        NamaAlbum,
        Deskripsi,
        TanggalDibuat,
        UserID,
        user ( NamaUser ),
        foto ( LokasiFile )
      `)
      .order('AlbumID', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { albumId, title, description, currentUserId } = body;

    if (!albumId || !title || !description || !currentUserId) {
      return NextResponse.json({ success: false, message: 'Data validasi tidak lengkap!' }, { status: 400 });
    }

    const { data: currentAlbum, error: checkError } = await supabase
      .from('album')
      .select('UserID')
      .eq('AlbumID', albumId)
      .single();

    if (checkError || !currentAlbum) {
      return NextResponse.json({ success: false, message: 'Album tidak ditemukan!' }, { status: 404 });
    }

    if (currentAlbum.UserID !== Number(currentUserId)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Akses ditolak! Lu bukan owner asli album ini, Bin!' 
      }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('album')
      .update({ NamaAlbum: title, Deskripsi: description })
      .eq('AlbumID', albumId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Album berhasil di-update!', data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const albumId = searchParams.get('albumId');
    const currentUserId = searchParams.get('currentUserId');

    if (!albumId || !currentUserId) {
      return NextResponse.json({ success: false, message: 'ID Album atau User tidak valid!' }, { status: 400 });
    }

    const { data: currentAlbum, error: checkError } = await supabase
      .from('album')
      .select('UserID')
      .eq('AlbumID', albumId)
      .single();

    if (checkError || !currentAlbum) {
      return NextResponse.json({ success: false, message: 'Album tidak ditemukan!' }, { status: 404 });
    }

    if (currentAlbum.UserID !== Number(currentUserId)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Gak bisa main hapus aja, lu bukan pemilik album ini!' 
      }, { status: 403 });
    }

    await supabase.from('foto').delete().eq('AlbumID', albumId);
    const { error } = await supabase.from('album').delete().eq('AlbumID', albumId);
    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Album & isinya berhasil dimusnahkan!' }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
