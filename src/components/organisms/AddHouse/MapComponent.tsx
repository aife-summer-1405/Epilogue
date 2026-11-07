// src/components/organisms/AddHouse/MapComponent.tsx
"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// @ts-expect-error fix leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface MapComponentProps {
  location: { lat: number; lng: number };
  onChangeLocation: (lat: number, lng: number) => void;
}

const MapController = ({ location }: { location: { lat: number; lng: number } }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([location.lat, location.lng], map.getZoom());
  }, [location, map]);
  return null;
};

const LocationMarker = ({ onChangeLocation }: { onChangeLocation: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onChangeLocation(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export default function MapComponent({ location, onChangeLocation }: MapComponentProps) {
  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 z-0">
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[location.lat, location.lng]} />
        <MapController location={location} />
        <LocationMarker onChangeLocation={onChangeLocation} />
      </MapContainer>
    </div>
  );
}