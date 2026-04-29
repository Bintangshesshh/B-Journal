import React from "react";
import { DuctTape } from "./DuctTape";

export const BrutalistInput = ({
  id,
  label,
  type,
  placeholder,
  tapeTop,
  tapeBottom,
  value,
  onChange,
}: {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  tapeTop: string;
  tapeBottom: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="relative">
    <label className="block text-lg font-bold text-pitch-black mb-2 uppercase tracking-wide" htmlFor={id}>
      {label}
    </label>
    <div className="relative">
      <DuctTape className={tapeTop} />
      <DuctTape className={tapeBottom} />
      <input
        autoComplete={type === "password" ? "current-password" : "off"}
        className="block w-full bg-paper border-4 border-pitch-black rounded-none py-3 px-4 text-pitch-black font-bold text-lg focus:ring-0 focus:outline-none focus:border-liverpool-red focus:bg-gray-100 transition-colors placeholder:text-gray-500 placeholder:font-normal distressed relative z-10"
        id={id}
        name={id}
        placeholder={placeholder}
        required
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);
