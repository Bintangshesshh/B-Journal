"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { DuctTape } from "@/components/ui/DuctTape";
import { BrutalistInput } from "@/components/ui/BrutalistInput";
import { LeftPhotoPanel } from "@/components/ui/LeftPhotoPanel";

const RightFormPanel = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      const payload = await response.json();
      if (!response.ok) {
        setErrorMsg(payload?.message || "Register gagal.");
        return;
      }

      setShowSuccessPopup(true);
    } catch {
      setErrorMsg("Register gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-5/12 flex items-center justify-center p-6 md:p-12 relative bg-transparent z-20">
      
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-pitch-black/80 backdrop-blur-sm p-4">
          <div className="bg-paper-texture border-[8px] border-pitch-black shadow-[16px_16px_0px_0px_#E30A17] p-8 max-w-sm w-full relative transform -rotate-1 distressed">
            <DuctTape className="-top-4 -left-4 w-24 h-8 transform -rotate-12" />
            <h2 className="text-4xl font-black uppercase text-liverpool-red mb-2 tracking-tighter">SUCCESS.</h2>
            <p className="text-sm font-bold text-pitch-black mb-8 uppercase tracking-widest border-l-4 border-pitch-black pl-3">
              NEW_ENTRY // CONFIRMED.
              <br />
              SYSTEM.READY FOR ACCESS.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-pitch-black text-pure-white border-4 border-pitch-black py-4 font-black uppercase tracking-widest text-xl hover:bg-liverpool-red shadow-[8px_8px_0px_0px_#000000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all distressed"
            >
              PROCEED TO LOGIN
            </button>
          </div>
        </div>
      )}

      <div className="md:hidden absolute top-0 left-0 w-full p-6 text-center border-b-8 border-pitch-black bg-paper-texture z-30 distressed">
        <h1 className="text-4xl font-black uppercase tracking-tighter">B-JOURNAL</h1>
      </div>

      <div className="w-full max-w-md bg-paper-texture border-[8px] border-pitch-black shadow-[12px_12px_0px_0px_#000000] p-5 md:p-6 relative distressed mt-16 md:mt-0">
        <DuctTape className="-top-3 -right-5 w-20 h-6 transform rotate-12 !z-30" />
        <DuctTape className="-bottom-3 -right-5 w-20 h-6 transform -rotate-12 !z-30" />

        <div className="mb-5 border-b-4 border-pitch-black pb-3">
          <h2 className="text-2xl md:text-3xl font-black uppercase text-pitch-black tracking-tighter">REGISTER.SYS</h2>
          <p className="text-xs md:text-sm font-bold text-gray-600 mt-2 uppercase tracking-widest">
            IDENTITY_REQ // NEW_ENTRY
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 border-4 border-liverpool-red bg-red-100 text-liverpool-red font-bold uppercase text-sm">
            ERROR: {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3 md:space-y-4 flex flex-col">
          {([
            {
              id: "fullname",
              name: "fullName",
              label: "FULL NAME // CREATOR_ID",
              type: "text",
              placeholder: "Enter your name",
              tapeTop: "-top-2 -left-3 w-10 h-5 transform -rotate-6",
              tapeBottom: "-bottom-2 -right-3 w-12 h-5 transform rotate-3"
            },
            {
              id: "username",
              name: "username",
              label: "USERNAME // UNIQUE_HANDLE",
              type: "text",
              placeholder: "Enter a username",
              tapeTop: "-top-3 -right-2 w-14 h-5 transform rotate-12",
              tapeBottom: "-bottom-2 -left-2 w-12 h-5 transform -rotate-6"
            },
            {
              id: "email",
              name: "email",
              label: "EMAIL ADDRESS // CONTACT_LINK",
              type: "email",
              placeholder: "Enter your email",
              tapeTop: "-top-2 -left-4 w-10 h-5 transform -rotate-6",
              tapeBottom: "-bottom-2 -right-2 w-12 h-5 transform rotate-6"
            },
            {
              id: "password",
              name: "password",
              label: "PASSWORD // ACCESS_CODE",
              type: "password",
              placeholder: "Create a password",
              tapeTop: "-top-2 -left-3 w-10 h-5 transform -rotate-6",
              tapeBottom: "-bottom-2 -right-3 w-12 h-5 transform rotate-3"
            }
          ] as const).map((field) => (
            <BrutalistInput
              key={field.id}
              id={field.id}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              tapeTop={field.tapeTop}
              tapeBottom={field.tapeBottom}
              value={formData[field.name]}
              onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))}
            />
          ))}

          <div className="pt-3">
            <button
              disabled={loading}
              className={`w-full text-pure-white border-[4px] border-pitch-black py-3 px-6 text-lg md:text-xl font-black uppercase tracking-widest shadow-[8px_8px_0px_0px_#000000] transition-all duration-100 ease-in-out flex items-center justify-center gap-2 distressed ${loading ? 'bg-gray-600' : 'bg-liverpool-red hover:bg-pitch-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none'}`}
              type="submit"
            >
              {loading ? "PROCESSING..." : "REGISTER"}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center border-t-4 border-pitch-black pt-4">
          <Link href="/login" className="text-sm font-bold text-liverpool-red uppercase tracking-widest hover:bg-pitch-black hover:text-pure-white px-2 py-1 transition-colors distressed">
            ALREADY ENROLLED? // LOGIN.SYS
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen md:h-screen overflow-y-auto md:overflow-hidden bg-paper-texture">
      <LeftPhotoPanel 
        imageUrl="https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1920&auto=format&fit=crop"
        titleTop="INITIATE"
        titleBottom="CREATION."
        subtitle="JOIN THE CREW."
      />
      <RightFormPanel />
    </div>
  );
}
