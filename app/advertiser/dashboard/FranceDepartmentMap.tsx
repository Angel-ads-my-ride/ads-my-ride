"use client";

import { useState } from "react";
import {
  FRANCE_DEPARTMENTS,
  FRANCE_MAP_WIDTH,
  FRANCE_MAP_HEIGHT,
  FRANCE_MAP_IDF_VIEWBOX,
  FRANCE_IDF_CODES,
} from "@/lib/france-departments-map";

export default function FranceDepartmentMap({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (codes: string[]) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  function toggle(code: string) {
    onChange(selected.includes(code) ? selected.filter((c) => c !== code) : [...selected, code]);
  }

  function selectAll() {
    onChange(FRANCE_DEPARTMENTS.map((d) => d.code));
  }

  const hoveredName = hovered ? FRANCE_DEPARTMENTS.find((d) => d.code === hovered)?.name : null;

  function fillFor(code: string) {
    if (selected.includes(code)) return "#3f3f46";
    if (hovered === code) return "#a1a1aa";
    return "#e4e4e7";
  }

  function renderPaths() {
    return FRANCE_DEPARTMENTS.map((dep) => (
      <path
        key={dep.code}
        d={dep.d}
        onClick={() => toggle(dep.code)}
        onMouseEnter={() => setHovered(dep.code)}
        onMouseLeave={() => setHovered((h) => (h === dep.code ? null : h))}
        className="cursor-pointer transition-colors"
        fill={fillFor(dep.code)}
        stroke="#fff"
        strokeWidth={1}
      >
        <title>{dep.name} ({dep.code})</title>
      </path>
    ));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-400 text-xs">
          {selected.length === 0
            ? "Aucun département sélectionné — tous les départements sont ciblés."
            : `${selected.length} département${selected.length !== 1 ? "s" : ""} sélectionné${selected.length !== 1 ? "s" : ""}.`}
        </p>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button type="button" onClick={selectAll} className="text-xs text-zinc-600 hover:text-zinc-800 font-medium">
            Tout sélectionner
          </button>
          {selected.length > 0 && (
            <button type="button" onClick={() => onChange([])} className="text-xs text-zinc-600 hover:text-zinc-800 font-medium">
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
        <div className="relative bg-gray-50 border border-gray-200 rounded-xl p-3">
          <svg
            viewBox={`0 0 ${FRANCE_MAP_WIDTH} ${FRANCE_MAP_HEIGHT}`}
            className="w-full h-auto max-h-[520px] mx-auto"
            role="group"
            aria-label="Carte des départements de France"
          >
            {renderPaths()}
          </svg>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 sm:w-48">
          <p className="text-gray-500 text-xs font-medium mb-2 text-center">Île-de-France (zoom)</p>
          <svg
            viewBox={FRANCE_MAP_IDF_VIEWBOX}
            className="w-full h-auto"
            role="group"
            aria-label="Carte zoomée de l'Île-de-France"
          >
            {FRANCE_DEPARTMENTS.filter((d) => FRANCE_IDF_CODES.includes(d.code)).map((dep) => (
              <path
                key={dep.code}
                d={dep.d}
                onClick={() => toggle(dep.code)}
                onMouseEnter={() => setHovered(dep.code)}
                onMouseLeave={() => setHovered((h) => (h === dep.code ? null : h))}
                className="cursor-pointer transition-colors"
                fill={fillFor(dep.code)}
                stroke="#fff"
                strokeWidth={0.5}
              >
                <title>{dep.name} ({dep.code})</title>
              </path>
            ))}
          </svg>
        </div>
      </div>

      <div className="h-5 text-center text-xs text-gray-500 mt-1">
        {hoveredName ?? " "}
      </div>

      <p className="text-gray-400 text-xs mt-2">
        La rémunération par conducteur peut être ajustée selon le département (les zones plus denses ou plus chères en carburant ne sont pas payées pareil qu&apos;une zone rurale).
      </p>
    </div>
  );
}
