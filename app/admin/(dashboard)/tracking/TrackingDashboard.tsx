"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FeatureGroup, Map as LeafletMap } from "leaflet";
import { Bluetooth, Car, Clock3, LocateFixed, MapPin, Radio, Route } from "lucide-react";
import type { AdminTrackingSession } from "@/lib/admin-tracking";

type Props = { initialSessions: AdminTrackingSession[] };

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "medium",
});

function formatDistance(meters: number) {
  return meters >= 1_000 ? `${(meters / 1_000).toFixed(1)} km` : `${Math.round(meters)} m`;
}

function relativeFreshness(value: string | null, now: number) {
  if (!value) return "Aucune position";
  const seconds = Math.max(0, Math.round((now - new Date(value).getTime()) / 1_000));
  if (seconds < 10) return "À l’instant";
  if (seconds < 60) return `Il y a ${seconds} s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `Il y a ${minutes} min`;
  return dateFormatter.format(new Date(value));
}

export default function TrackingDashboard({ initialSessions }: Props) {
  const [sessions, setSessions] = useState(initialSessions);
  const [selectedId, setSelectedId] = useState(
    initialSessions.find((session) => session.status === "ACTIVE")?.id ?? initialSessions[0]?.id ?? "",
  );
  const [lastRefreshAt, setLastRefreshAt] = useState(new Date());
  const [refreshError, setRefreshError] = useState(false);
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const routeLayerRef = useRef<FeatureGroup | null>(null);

  const selected = useMemo(
    () => sessions.find((session) => session.id === selectedId) ?? sessions[0] ?? null,
    [selectedId, sessions],
  );
  const activeCount = sessions.filter((session) => session.status === "ACTIVE").length;
  const recentTrackerCount = sessions.filter((session) => {
    const lastSeen = session.beacon.lastSeenAt;
    return lastSeen && lastRefreshAt.getTime() - new Date(lastSeen).getTime() < 5 * 60 * 1_000;
  }).length;

  useEffect(() => {
    const timer = window.setInterval(async () => {
      try {
        const response = await fetch("/api/admin/tracking", { cache: "no-store" });
        if (!response.ok) throw new Error("refresh failed");
        const payload = (await response.json()) as { sessions: AdminTrackingSession[] };
        setSessions(payload.sessions);
        setSelectedId((current) =>
          payload.sessions.some((session) => session.id === current)
            ? current
            : payload.sessions.find((session) => session.status === "ACTIVE")?.id ?? payload.sessions[0]?.id ?? "",
        );
        setLastRefreshAt(new Date());
        setRefreshError(false);
      } catch {
        setRefreshError(true);
      }
    }, 10_000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function updateMap() {
      const L = await import("leaflet");
      if (cancelled || !mapElementRef.current) return;

      if (!mapRef.current) {
        mapRef.current = L.map(mapElementRef.current, { zoomControl: true, attributionControl: true }).setView(
          [46.603354, 1.888334],
          6,
        );
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(mapRef.current);
      }

      routeLayerRef.current?.remove();
      if (!selected?.points.length || !mapRef.current) return;

      const coordinates = selected.points.map((point) => [point.latitude, point.longitude] as [number, number]);
      const group = L.featureGroup();
      L.polyline(coordinates, { color: "#F59E0B", weight: 6, opacity: 0.9 }).addTo(group);
      L.circleMarker(coordinates[0], {
        radius: 7,
        color: "#fff",
        weight: 3,
        fillColor: "#111827",
        fillOpacity: 1,
      }).bindTooltip("Départ").addTo(group);
      L.circleMarker(coordinates.at(-1)!, {
        radius: 10,
        color: "#fff",
        weight: 4,
        fillColor: selected.status === "ACTIVE" ? "#16A34A" : "#F59E0B",
        fillOpacity: 1,
      }).bindTooltip(selected.status === "ACTIVE" ? "Position actuelle" : "Dernière position").addTo(group);
      group.addTo(mapRef.current);
      routeLayerRef.current = group;
      mapRef.current.fitBounds(group.getBounds(), { padding: [38, 38], maxZoom: 16 });
    }

    updateMap();
    return () => {
      cancelled = true;
    };
  }, [selected]);

  useEffect(() => () => {
    mapRef.current?.remove();
    mapRef.current = null;
  }, []);

  const latestPoint = selected?.points.at(-1) ?? null;

  return (
    <div className="p-5 md:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-7">
        <div>
          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold tracking-[0.18em] uppercase mb-2">
            <Radio className="w-4 h-4" /> Centre de suivi
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Suivi GPS des véhicules</h1>
          <p className="text-sm text-gray-500 mt-1">Positions reçues uniquement pendant les campagnes et trajets activés.</p>
        </div>
        <div className={`text-xs font-medium ${refreshError ? "text-red-600" : "text-gray-400"}`}>
          {refreshError ? "Actualisation interrompue" : `Actualisé à ${lastRefreshAt.toLocaleTimeString("fr-FR")}`}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {[
          { label: "Trajets en direct", value: activeCount, icon: LocateFixed, tone: "text-green-700 bg-green-50" },
          { label: "Trackers vus < 5 min", value: recentTrackerCount, icon: Bluetooth, tone: "text-blue-700 bg-blue-50" },
          { label: "Trajets cartographiés", value: sessions.length, icon: Route, tone: "text-amber-700 bg-amber-50" },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tone}`}><Icon className="w-5 h-5" /></div>
            <div><p className="text-2xl font-bold text-gray-900">{value}</p><p className="text-xs text-gray-500">{label}</p></div>
          </div>
        ))}
      </div>

      {sessions.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
          <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h2 className="font-semibold text-gray-800">Aucun trajet GPS reçu</h2>
          <p className="text-sm text-gray-500 mt-1">La carte s’alimentera dès qu’un conducteur démarrera un trajet avec sa balise.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[340px_minmax(0,1fr)] gap-5">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden xl:max-h-[650px] xl:overflow-y-auto">
            <div className="p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <p className="font-semibold text-gray-900">Véhicules et trajets</p>
              <p className="text-xs text-gray-400 mt-0.5">Rafraîchissement automatique toutes les 10 s</p>
            </div>
            <div className="divide-y divide-gray-100">
              {sessions.map((session) => {
                const isSelected = session.id === selected?.id;
                const lastPoint = session.points.at(-1);
                return (
                  <button
                    type="button"
                    key={session.id}
                    onClick={() => setSelectedId(session.id)}
                    className={`w-full text-left p-4 transition-colors ${isSelected ? "bg-amber-50" : "hover:bg-gray-50"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{session.driver.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {[session.driver.carBrand, session.driver.carModel].filter(Boolean).join(" ") || "Véhicule non renseigné"}
                        </p>
                      </div>
                      <span className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-full ${session.status === "ACTIVE" ? "text-green-700 bg-green-100" : "text-gray-600 bg-gray-100"}`}>
                        {session.status === "ACTIVE" ? "EN DIRECT" : "TERMINÉ"}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-700 mt-3 truncate">{session.campaignTitle ?? "Trajet sans campagne"}</p>
                    <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2">
                      <span>{formatDistance(session.distanceMeters)}</span>
                      <span>{relativeFreshness(lastPoint?.recordedAt ?? session.lastPointAt, lastRefreshAt.getTime())}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div ref={mapElementRef} className="h-[420px] md:h-[520px] w-full bg-gray-100" aria-label="Carte du trajet sélectionné" />
            </div>

            {selected && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <Car className="w-5 h-5 text-amber-600" />
                      <h2 className="font-semibold text-gray-900">{selected.driver.name}</h2>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{selected.driver.email}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="font-semibold text-gray-900">{selected.campaignTitle ?? "Trajet sans campagne"}</p>
                    <p className="text-xs text-gray-500 mt-1">Démarré le {dateFormatter.format(new Date(selected.startedAt))}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="rounded-xl bg-gray-50 p-3"><Route className="w-4 h-4 text-amber-600 mb-2" /><p className="font-semibold text-gray-900">{formatDistance(selected.distanceMeters)}</p><p className="text-[11px] text-gray-500">Distance validée</p></div>
                  <div className="rounded-xl bg-gray-50 p-3"><MapPin className="w-4 h-4 text-amber-600 mb-2" /><p className="font-semibold text-gray-900">{selected.points.length}</p><p className="text-[11px] text-gray-500">Points affichés</p></div>
                  <div className="rounded-xl bg-gray-50 p-3"><Bluetooth className="w-4 h-4 text-blue-600 mb-2" /><p className="font-semibold text-gray-900">{selected.beacon.lastRssi ?? "—"} dBm</p><p className="text-[11px] text-gray-500">Signal du tracker</p></div>
                  <div className="rounded-xl bg-gray-50 p-3"><Clock3 className="w-4 h-4 text-green-600 mb-2" /><p className="font-semibold text-gray-900">{relativeFreshness(latestPoint?.recordedAt ?? selected.lastPointAt, lastRefreshAt.getTime())}</p><p className="text-[11px] text-gray-500">Dernière position</p></div>
                </div>

                {latestPoint && (
                  <p className="text-[11px] text-gray-400 mt-4">
                    Coordonnées : {latestPoint.latitude.toFixed(5)}, {latestPoint.longitude.toFixed(5)} · précision {latestPoint.accuracy ? `${Math.round(latestPoint.accuracy)} m` : "inconnue"} · tracker {selected.beacon.name}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
