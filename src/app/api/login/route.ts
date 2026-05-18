import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { Username, Password } = body;

    const { data, error } = await supabase
      .from('user') 
      .select('*')
      .eq('Username', Username)
      .eq('Password', Password)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, message: 'User tidak ditemukan' }, { status: 401 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}