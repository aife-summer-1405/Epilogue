"use client";

import { useEffect } from "react";
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
  onChange?: (lat: number, lng: number) => void;
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

function MapViewUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      map.flyTo([lat, lng], map.getZoom(), { duration: 0.6 });
    }
  }, [lat, lng, map]);
  return null;
}

export function LocationMapPicker({
  lat,
  lng,
  onChange,
  interactive = true,
  heightClassName = "h-56 sm:h-64",
}: LocationMapPickerProps) {
  const safeLat = Number.isFinite(lat) && lat !== 0 ? lat : 35.6892;
  const safeLng = Number.isFinite(lng) && lng !== 0 ? lng : 51.389;

  return (
    <div
      className={`w-full overflow-hidden rounded-xl border border-neutral-300 dark:border-neutral-200 ${heightClassName}`}
    >
      <MapContainer
        center={[safeLat, safeLng]}
        zoom={11}
        scrollWheelZoom={interactive}
        className="z-0 h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[safeLat, safeLng]} icon={customMarkerIcon} />
        <MapViewUpdater lat={safeLat} lng={safeLng} />
        {interactive && <MapClickHandler onSelect={onChange} />}
      </MapContainer>
    </div>
  );
}