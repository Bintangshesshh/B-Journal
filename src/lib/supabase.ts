import { createClient } from '@supabase/supabase-js';

// URL dan Key ini didapat dari dashboard Supabase proyekmu (Settings -> API)
// Idealnya ditaruh di file .env.local, tapi kita taruh sini dulu sebagai contoh
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aiyztktodsljrqecnewx.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpeXp0a3RvZHNsanJxZWNuZXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTM3MzcsImV4cCI6MjA5Mjg4OTczN30.nlhLFb3F54WKFNsHYxhOT4GNEDzIaViWsgYQZHuRPd8';

// Ini adalah "jembatan" yang menghubungkan kodemu dengan database Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
