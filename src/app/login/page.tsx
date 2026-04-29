"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { DuctTape } from "@/components/ui/DuctTape";
import { BrutalistInput } from "@/components/ui/BrutalistInput";
import { LeftPhotoPanel } from "@/components/ui/LeftPhotoPanel";

// Bagian kanan yang isinya form login
const RightFormPanel = () => {
  const router = useRouter();
  
  // State untuk menyimpan inputan user
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fungsi yang dipanggil saat tombol submit ditekan
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah browser refresh halaman
    setLoading(true);
    setErrorMsg("");

    // Login dengan Query Table Manual (Bukan Auth JS Bawaan)
    const { data: users, error } = await supabase
      .from("user")
      .select("*")
      .eq("Username", username)
      .eq("Password", password);

    if (error) {
      // Kesalahan fetch/koneksi putus
      setErrorMsg(error.message);
      setLoading(false);
    } else if (users && users.length > 0) {
      // Kalau berhasil nemu Akunnya, simpan ke cookie/session lokal
      const userData = users[0];
      // Menyimpan detail basic ke localStorage saja agar lebih cepat test UKK
      if (typeof window !== "undefined") {
        localStorage.setItem("bJournalUser", JSON.stringify(userData));
      }
      router.push("/");
    } else {
      // Username atau Password salah
      setErrorMsg("Username or Password incorrect! ACCESS DENIED.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-5/12 flex flex-col justify-center items-center p-6 md:p-12 relative bg-transparent z-20 md:-ml-8 mt-[-2rem] md:mt-0">
      <div className="w-full max-w-md bg-paper-texture border-4 border-pitch-black p-8 shadow-[12px_12px_0px_0px_rgba(200,16,46,1)] relative distressed">
        {/* Selotip hiasan pojok luar form */}
        <DuctTape className="-top-4 -left-6 w-20 h-10 transform -rotate-12 !z-30" />
        <DuctTape className="-bottom-5 -right-6 w-24 h-10 transform rotate-6 !z-30" />

        {/* Brand & Judulnya */}
        <div className="mb-8 border-b-4 border-pitch-black pb-4 relative">
          <h1 className="text-3xl font-black uppercase tracking-widest text-pitch-black mb-2">
            B-JOURNAL
          </h1>
          <p className="text-xl font-bold uppercase bg-pitch-black text-paper inline-block px-2 py-1 relative z-10">
            IDENTITY REQUIRED.
          </p>
        </div>

        {/* Tampilkan pesan error jika ada */}
        {errorMsg && (
          <div className="mb-4 p-3 border-4 border-liverpool-red bg-red-100 text-liverpool-red font-bold uppercase text-sm">
            ERROR: {errorMsg}
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-6">
          <BrutalistInput
            id="username"
            label="Username // USER_ID"
            type="text"
            placeholder="ENTER.USERNAME@HERE"
            tapeTop="-top-2 -left-3 w-10 h-5 transform -rotate-6"
            tapeBottom="-bottom-2 -right-3 w-12 h-5 transform rotate-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="relative">
            <BrutalistInput
              id="password"
              label="Password // ACCESS_CODE"
              type="password"
              placeholder="••••••••"
              tapeTop="-top-3 -right-2 w-14 h-5 transform rotate-12"
              tapeBottom="-bottom-2 -left-4 w-10 h-5 transform -rotate-6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="mt-2 text-right">
              <a className="text-sm font-bold text-pitch-black hover:text-liverpool-red hover:underline transition-colors uppercase" href="#">
                [ FORGOT? ]
              </a>
            </div>
          </div>

          <div className="pt-6 relative">
            <DuctTape className="-top-2 left-1/2 -ml-6 w-16 h-6 transform -rotate-3" />
            <button
              disabled={loading}
              className={`relative z-10 w-full flex justify-center py-3 px-4 border-4 border-pitch-black rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-2xl font-black text-paper ${loading ? 'bg-gray-600' : 'bg-liverpool-red hover:bg-pitch-black hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px]'} focus:outline-none transition-all uppercase tracking-widest distressed`}
              type="submit"
            >
              {loading ? "CHECKING..." : "AUTHENTICATE"}
            </button>
          </div>
        </form>

        {/* Footer link */}
        <div className="mt-8 pt-4 border-t-4 border-pitch-black text-center relative">
          <p className="text-lg font-bold text-pitch-black uppercase distressed">
          NO ACCOUNT?
          <Link href="/register" className="text-liverpool-red hover:bg-pitch-black hover:text-paper px-2 py-1 ml-1 transition-colors border-2 border-transparent hover:border-pitch-black">
            INITIATE CREATION
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
};

// Halaman utama

export default function LoginPage() {
  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden bg-paper-texture">
      <LeftPhotoPanel 
        imageUrl="https://commons.wikimedia.org/wiki/Special:FilePath/Anfield_Stadium.jpg?width=1920"
        titleTop="RAW"
        titleBottom="PHOTOGRAPHY."
        subtitle="NO FILTER."
      />
      <RightFormPanel />
    </div>
  );
}
