import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session';

const fallbackUrl = 'https://aiyztktodsljrqecnewx.supabase.co';
const fallbackAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpeXp0a3RvZHNsanJxZWNuZXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTM3MzcsImV4cCI6MjA5Mjg4OTczN30.nlhLFb3F54WKFNsHYxhOT4GNEDzIaViWsgYQZHuRPd8';
const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const envKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const isProd = process.env.NODE_ENV === 'production';
const supabaseUrl = envUrl || (isProd ? '' : fallbackUrl);
const supabaseKey = envKey || (isProd ? '' : fallbackAnon);

export async function GET() {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  if (isProd && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const payload = verifySessionToken(token);
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const { data: user, error } = await supabase
    .from('user')
    .select('UserID, Username, Email, NamaLengkap, FotoProfil')
    .eq('UserID', payload.userId)
    .single();

  if (error || !user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({ user }, { status: 200 });
}
