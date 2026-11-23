"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface HouseLocationPickerProps {
  lat: number;
  lng: number;
  onChange: (coords: { lat: number; lng: number }) => void;
}

const DEFAULT_CENTER: [number, number] = [35.6892, 51.389];

function MapClickHandler({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onSelect(
        Number(e.latlng.lat.toFixed(6)),
        Number(e.latlng.lng.toFixed(6))
      );
    },
  });
  return null;
}

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      map.setView([lat, lng], map.getZoom(), { animate: true });
    }
  }, [lat, lng, map]);

  return null;
}

export default function HouseLocationPicker({
  lat,
  lng,
  onChange,
}: HouseLocationPickerProps) {
  const safeLat = Number.isFinite(lat) && lat !== 0 ? lat : DEFAULT_CENTER[0];
  const safeLng = Number.isFinite(lng) && lng !== 0 ? lng : DEFAULT_CENTER[1];

  const markerIcon = useMemo(
    () =>
      L.divIcon({
        className: "custom-house-pin",
        html: `<div style="width:22px;height:22px;border-radius:9999px;background:#0284c7;border:3px solid #ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.35);transform:translate(-11px,-11px);"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      }),
    []
  );

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-300 dark:border-neutral-200">
      <div className="h-56 w-full z-0">
        <MapContainer
          center={[safeLat, safeLng]}
          zoom={14}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap lat={safeLat} lng={safeLng} />
          <MapClickHandler
            onSelect={(newLat, newLng) => onChange({ lat: newLat, lng: newLng })}
          />
          <Marker
            position={[safeLat, safeLng]}
            icon={markerIcon}
            draggable={true}
            eventHandlers={{
              dragend(e) {
                const marker = e.target as L.Marker;
                const pos = marker.getLatLng();
                onChange({
                  lat: Number(pos.lat.toFixed(6)),
                  lng: Number(pos.lng.toFixed(6)),
                });
              },
            }}
          />
        </MapContainer>
      </div>
      <div className="flex items-center justify-between bg-neutral-100 dark:bg-[#353535] px-3 py-1.5 text-[11px] text-neutral-800 dark:text-neutral-600">
        <span>روی نقشه کلیک کنید یا نشانگر را بکشید</span>
        <span dir="ltr" className="font-mono font-semibold text-default-text">
          {safeLat.toFixed(4)}, {safeLng.toFixed(4)}
        </span>
      </div>
    </div>
  );
}