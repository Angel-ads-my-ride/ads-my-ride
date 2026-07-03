"use client";

import { useLocale } from "@/lib/i18n/LocaleContext";
import { LOCALES } from "@/lib/i18n/translations";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="relative group">
      <button
        type="button"
        className="flex items-center gap-2 pl-3 border-l border-gray-200 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
      >
        {locale.toUpperCase()}
      </button>

      <div className="absolute right-0 top-full pt-2 hidden group-hover:block z-50">
        <div className="bg-white border border-gray-100 rounded-xl shadow-lg py-2 px-1 min-w-[88px]">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setLocale(l.code)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                l.code === locale
                  ? "font-bold text-gray-900"
                  : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
