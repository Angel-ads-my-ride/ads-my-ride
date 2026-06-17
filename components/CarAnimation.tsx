"use client";

import { useEffect, useState } from "react";

const COLORS = ["#f97316", "#3b82f6", "#22c55e", "#a855f7", "#ef4444", "#eab308"];

export default function CarAnimation() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % COLORS.length), 1800);
    return () => clearInterval(t);
  }, []);

  const color = COLORS[idx];

  return (
    <>
      <style>{`
        @keyframes amr-spin { to { transform: rotate(360deg); } }
        .amr-wh { transform-box: fill-box; transform-origin: center; animation: amr-spin 0.7s linear infinite; }
      `}</style>

      <div className="w-56 mx-auto select-none">
        <svg viewBox="0 0 240 112" xmlns="http://www.w3.org/2000/svg">

          {/* Body */}
          <rect x="15" y="53" width="210" height="38" rx="8" fill="#e5e7eb" />

          {/* Cabin */}
          <path d="M 50 53 L 68 18 L 178 18 L 196 53 Z" fill="#e5e7eb" />

          {/* Window */}
          <path d="M 63 49 L 76 20 L 168 20 L 181 49 Z" fill="#bae6fd" />

          {/* B-pillar */}
          <rect x="121" y="21" width="4" height="28" fill="#e5e7eb" />

          {/* Colored door panel */}
          <rect
            x="70" y="58" width="104" height="25" rx="4"
            fill={color}
            style={{ transition: "fill 0.55s ease" }}
          />

          {/* Rear bumper + tail light */}
          <rect x="4"   y="62" width="18" height="22" rx="4" fill="#d1d5db" />
          <rect x="5"   y="54" width="12" height="10" rx="2" fill="#fca5a5" />

          {/* Front bumper + headlight */}
          <rect x="218" y="62" width="18" height="22" rx="4" fill="#d1d5db" />
          <rect x="218" y="54" width="14" height="10" rx="2" fill="#fef08a" />

          {/* Door handle */}
          <rect x="178" y="68" width="16" height="4" rx="2" fill="#9ca3af" />

          {/* Rear wheel */}
          <g className="amr-wh">
            <circle cx="64"  cy="96" r="18" fill="#374151" />
            <circle cx="64"  cy="96" r="11" fill="#6b7280" />
            <circle cx="64"  cy="96" r="4"  fill="#374151" />
            <line x1="64"  y1="79" x2="64"  y2="113" stroke="#4b5563" strokeWidth="2.5" />
            <line x1="47"  y1="96" x2="81"  y2="96"  stroke="#4b5563" strokeWidth="2.5" />
          </g>

          {/* Front wheel */}
          <g className="amr-wh">
            <circle cx="176" cy="96" r="18" fill="#374151" />
            <circle cx="176" cy="96" r="11" fill="#6b7280" />
            <circle cx="176" cy="96" r="4"  fill="#374151" />
            <line x1="176" y1="79" x2="176" y2="113" stroke="#4b5563" strokeWidth="2.5" />
            <line x1="159" y1="96" x2="193" y2="96"  stroke="#4b5563" strokeWidth="2.5" />
          </g>

        </svg>
      </div>
    </>
  );
}
