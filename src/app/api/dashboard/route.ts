import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// POST /api/dashboard - Simpan data album baru ke skema asli
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: 'Title dan Description wajib diisi, Bin!' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('album') 
      .insert([
        { 
          NamaAlbum: title, 
          Deskripsi: description,
          TanggalDibuat: new Date().toISOString().split('T')[0],
          UserID: 1
        }
      ])
      .select();

    if (error) {
      console.error('Supabase Error:', error.message);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Album sukses disimpan!', data },
      { status: 201 }
    );

  } catch (err: any) {
    console.error('Server Error:', err.message);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// GET /api/dashboard - Menampilkan data sesuai skema asli
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
    foto ( LokasiFile )
  `)
  .order('AlbumID', { ascending: false });

    if (error) throw error;
    
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}