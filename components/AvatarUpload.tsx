"use client";

import { useState } from "react";
import { User } from "lucide-react";

export default function AvatarUpload({ currentUrl, name }: { currentUrl: string | null; name: string }) {
  const [preview, setPreview] = useState<string | null>(currentUrl);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-50 border border-zinc-100 flex items-center justify-center flex-shrink-0">
        {preview ? (
          <img src={preview} alt={name} className="w-full h-full object-cover" />
        ) : (
          <User className="w-7 h-7 text-zinc-400" />
        )}
      </div>
      <div>
        <label className="inline-flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-3.5 py-2 rounded-lg transition-colors border border-gray-200">
          Changer la photo
          <input name="avatarFile" type="file" accept="image/*" onChange={handleChange} className="hidden" />
        </label>
        <p className="text-gray-400 text-xs mt-1.5">JPG, PNG — 5 Mo max</p>
      </div>
    </div>
  );
}
