import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { hashPassword } from '@/lib/password';

const fallbackUrl = 'https://aiyztktodsljrqecnewx.supabase.co';
const fallbackAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpeXp0a3RvZHNsanJxZWNuZXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTM3MzcsImV4cCI6MjA5Mjg4OTczN30.nlhLFb3F54WKFNsHYxhOT4GNEDzIaViWsgYQZHuRPd8';
const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const envKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const isProd = process.env.NODE_ENV === 'production';
const supabaseUrl = envUrl || (isProd ? '' : fallbackUrl);
const supabaseKey = envKey || (isProd ? '' : fallbackAnon);

export async function POST(request: Request) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ success: false, message: 'Server auth config belum lengkap.' }, { status: 500 });
    }

    if (isProd && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ success: false, message: 'Service role key wajib di production.' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
    const body = await request.json();
    const fullName = String(body?.fullName || '').trim();
    const username = String(body?.username || '').trim();
    const email = String(body?.email || '').trim();
    const password = String(body?.password || '');

    if (!username || !password) {
      return NextResponse.json({ success: false, message: 'Username dan password wajib diisi.' }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from('user')
      .select('UserID')
      .eq('Username', username)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: false, message: 'Username sudah dipakai.' }, { status: 409 });
    }

    const passwordHash = hashPassword(password);
    const { data, error } = await supabase
      .from('user')
      .insert([
        {
          Username: username,
          Password: passwordHash,
          Email: email || `${username}@bjournal.local`,
          NamaLengkap: fullName
        }
      ])
      .select('UserID, Username, Email, NamaLengkap, FotoProfil')
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, message: error?.message || 'Register gagal.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || 'Server error.' }, { status: 500 });
  }
}
