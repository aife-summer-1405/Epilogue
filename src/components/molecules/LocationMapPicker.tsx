"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customMarkerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface LocationMapPickerProps {
  lat: number;
  lng: number;
  searchQuery?: string;
  onChange?: (lat: number, lng: number) => void;
  onSearchStatusChange?: (status: "idle" | "searching" | "found" | "not_found") => void;
  interactive?: boolean;
  heightClassName?: string;
}

function MapClickHandler({
  onSelect,
}: {
  onSelect?: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (onSelect) {
        onSelect(
          Number(e.latlng.lat.toFixed(6)),
          Number(e.latlng.lng.toFixed(6))
        );
      }
    },
  });
  return null;
}

function MapViewUpdater({
  lat,
  lng,
  zoom = 12,
}: {
  lat: number;
  lng: number;
  zoom?: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      map.flyTo([lat, lng], zoom, { duration: 0.7 });
    }
  }, [lat, lng, zoom, map]);

  return null;
}

export function LocationMapPicker({
  lat,
  lng,
  searchQuery = "",
  onChange,
  onSearchStatusChange,
  interactive = true,
  heightClassName = "h-56 sm:h-64",
}: LocationMapPickerProps) {
  const [mapZoom, setMapZoom] = useState<number>(11);

  const safeLat = Number.isFinite(lat) && lat !== 0 ? lat : 35.6892;
  const safeLng = Number.isFinite(lng) && lng !== 0 ? lng : 51.389;

  useEffect(() => {
    if (!interactive) return;

    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      onSearchStatusChange?.("idle");
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        onSearchStatusChange?.("searching");
        const queryWithCountry = trimmed.includes("ایران")
          ? trimmed
          : `${trimmed}, ایران`;

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
            queryWithCountry
          )}`,
          {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!res.ok) {
          onSearchStatusChange?.("not_found");
          return;
        }

        const results: Array<{ lat: string; lon: string }> = await res.json();
        if (results.length > 0) {
          const foundLat = Number(Number(results[0].lat).toFixed(6));
          const foundLng = Number(Number(results[0].lon).toFixed(6));
          setMapZoom(12);
          onChange?.(foundLat, foundLng);
          onSearchStatusChange?.("found");
        } else {
          onSearchStatusChange?.("not_found");
        }
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          onSearchStatusChange?.("not_found");
        }
      }
    }, 600);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, interactive]);

  return (
    <div
      className={`w-full overflow-hidden rounded-xl border border-neutral-300 dark:border-neutral-200 ${heightClassName}`}
    >
      <MapContainer
        center={[safeLat, safeLng]}
        zoom={mapZoom}
        scrollWheelZoom={interactive}
        className="z-0 h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[safeLat, safeLng]} icon={customMarkerIcon} />
        <MapViewUpdater lat={safeLat} lng={safeLng} zoom={mapZoom} />
        {interactive && <MapClickHandler onSelect={onChange} />}
      </MapContainer>
    </div>
  );
}