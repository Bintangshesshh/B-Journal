import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { AlbumID, ImageBase64 } = body;

    if (!AlbumID || !ImageBase64) {
      return NextResponse.json(
        { success: false, message: 'AlbumID dan ImageBase64 wajib diisi!' },
        { status: 400 }
      );
    }

    const cleanBase64 = ImageBase64.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(cleanBase64, 'base64');
    const fileName = `foto_${AlbumID}_${Date.now()}.jpg`;

    const { data: storageData, error: storageError } = await supabase.storage
      .from('photos') 
      .upload(fileName, imageBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (storageError) {
      return NextResponse.json({ success: false, message: `Storage Error: ${storageError.message}` }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from('photos')
      .getPublicUrl(fileName);

    const lokasiFileUrl = publicUrlData.publicUrl;

    const { data: fotoData, error: dbError } = await supabase
  .from('foto')
  .insert([
    {
      AlbumID: Number(AlbumID),
      LokasiFile: lokasiFileUrl,
      JudulFoto: 'Uploaded via Android',
      DeskripsiFoto: 'inilah b-journal',
      TanggalUnggah: new Date().toISOString().split('T')[0],
      UserID: UserID ? Number(UserID) : 1
    }
  ])
      .select()
      .single();

    if (dbError) {
      return NextResponse.json({ success: false, message: `Database Error: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Foto masuk ke album!', data: fotoData }, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fotoId = searchParams.get('fotoId');
    const urlFotoRaw = searchParams.get('urlFoto'); 

    let query = supabase.from('foto').delete();

    if (fotoId && fotoId !== '-1') {
      query = query.eq('FotoID', fotoId);
    } else if (urlFotoRaw) {
      const urlFoto = decodeURIComponent(urlFotoRaw);
      query = query.eq('LokasiFile', urlFoto);
    } else {
      return NextResponse.json({ success: false, message: 'ID atau URL Foto tidak ditemukan!' }, { status: 400 });
    }

    const { error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Foto berhasil dimusnahkan!' }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
