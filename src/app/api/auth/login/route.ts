import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { hashPassword, verifyPassword } from '@/lib/password';
import { createSessionToken, SESSION_COOKIE } from '@/lib/session';

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
    const username = String(body?.username || '').trim();
    const password = String(body?.password || '');

    if (!username || !password) {
      return NextResponse.json({ success: false, message: 'Username dan password wajib diisi.' }, { status: 400 });
    }

    const { data: user, error } = await supabase
      .from('user')
      .select('UserID, Username, Email, NamaLengkap, FotoProfil, Password')
      .eq('Username', username)
      .single();

    if (error || !user) {
      return NextResponse.json({ success: false, message: 'Username atau password salah.' }, { status: 401 });
    }

    const verify = verifyPassword(password, user.Password || '');
    if (!verify.ok) {
      return NextResponse.json({ success: false, message: 'Username atau password salah.' }, { status: 401 });
    }

    if (verify.needsRehash) {
      const nextHash = hashPassword(password);
      await supabase
        .from('user')
        .update({ Password: nextHash })
        .eq('UserID', user.UserID);
    }

    const safeUser = {
      UserID: user.UserID,
      Username: user.Username,
      Email: user.Email,
      NamaLengkap: user.NamaLengkap,
      FotoProfil: user.FotoProfil || null
    };

    const issuedAt = Date.now();
    const expiresAt = issuedAt + 1000 * 60 * 60 * 24 * 7;
    const token = createSessionToken({
      userId: user.UserID,
      username: user.Username,
      issuedAt,
      expiresAt
    });

    const response = NextResponse.json({ success: true, user: safeUser }, { status: 200 });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || 'Server error.' }, { status: 500 });
  }
}
