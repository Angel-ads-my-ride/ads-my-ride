"use client";

import { useState } from "react";
import { FRANCE_DEPARTMENTS, FRANCE_MAP_WIDTH, FRANCE_MAP_HEIGHT } from "@/lib/france-departments-map";

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

  const hoveredName = hovered ? FRANCE_DEPARTMENTS.find((d) => d.code === hovered)?.name : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-400 text-xs">
          {selected.length === 0
            ? "Aucun département sélectionné — tous les départements sont ciblés."
            : `${selected.length} département${selected.length !== 1 ? "s" : ""} sélectionné${selected.length !== 1 ? "s" : ""}.`}
        </p>
        {selected.length > 0 && (
          <button type="button" onClick={() => onChange([])} className="text-xs text-zinc-600 hover:text-zinc-800 font-medium">
            Réinitialiser
          </button>
        )}
      </div>

      <div className="relative bg-gray-50 border border-gray-200 rounded-xl p-3">
        <svg
          viewBox={`0 0 ${FRANCE_MAP_WIDTH} ${FRANCE_MAP_HEIGHT}`}
          className="w-full h-auto max-h-[520px] mx-auto"
          role="group"
          aria-label="Carte des départements de France"
        >
          {FRANCE_DEPARTMENTS.map((dep) => {
            const isSelected = selected.includes(dep.code);
            return (
              <path
                key={dep.code}
                d={dep.d}
                onClick={() => toggle(dep.code)}
                onMouseEnter={() => setHovered(dep.code)}
                onMouseLeave={() => setHovered((h) => (h === dep.code ? null : h))}
                className="cursor-pointer transition-colors"
                fill={isSelected ? "#3f3f46" : "#e4e4e7"}
                stroke="#fff"
                strokeWidth={1}
              >
                <title>{dep.name} ({dep.code})</title>
              </path>
            );
          })}
        </svg>

        <div className="h-5 text-center text-xs text-gray-500 mt-1">
          {hoveredName ?? " "}
        </div>
      </div>
    </div>
  );
}
