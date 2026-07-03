"use client";

import Link from "next/link";
import { LocaleProvider, useLocale } from "@/lib/i18n/LocaleContext";
import { LegalSection } from "@/lib/i18n/translations";
import LanguageSwitcher from "@/components/LanguageSwitcher";

function Section({ section }: { section: LegalSection }) {
  return (
    <div className="mb-8">
      <h3 className="font-bold text-gray-900 mb-2">{section.title}</h3>
      {section.intro && <p className="text-gray-600 text-sm leading-relaxed mb-3">{section.intro}</p>}
      {section.list && (
        <ul className="list-disc list-inside space-y-1.5 text-gray-600 text-sm leading-relaxed mb-3">
          {section.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {section.outro && <p className="text-gray-600 text-sm leading-relaxed">{section.outro}</p>}
    </div>
  );
}

function MentionsLegalesContent() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/Logo.png" alt="Ads My Ride" className="w-9 h-9 object-contain" />
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{t.legal.title}</h1>
        <p className="text-gray-400 text-sm mb-10">{t.legal.lastUpdated}</p>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-sm">
          <p className="text-xs font-semibold text-zinc-700 tracking-wider mb-2">{t.legal.part1}</p>
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t.legal.cguTitle}</h2>
          {t.legal.cguSections.map((section) => (
            <Section key={section.title} section={section} />
          ))}

          <div className="border-t border-gray-100 my-10" />

          <p className="text-xs font-semibold text-zinc-700 tracking-wider mb-2">{t.legal.part2}</p>
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t.legal.privacyTitle}</h2>
          {t.legal.privacySections.map((section) => (
            <Section key={section.title} section={section} />
          ))}
        </div>

        <p className="text-center text-gray-400 text-xs mt-8">
          © {new Date().getFullYear()} Ads My Ride. {t.footer.rights}
        </p>

        <Link href="/" className="block text-center mt-6 text-zinc-700 hover:text-zinc-800 text-sm font-semibold">
          ← {t.nav.accueil}
        </Link>
      </main>
    </div>
  );
}

export default function MentionsLegalesPage() {
  return (
    <LocaleProvider>
      <MentionsLegalesContent />
    </LocaleProvider>
  );
}
