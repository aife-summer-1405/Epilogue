"use client";

import "leaflet/dist/leaflet.css";
import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { useGeoHouses } from "@/hooks/queries/fastReserve/useGeoHouses";
import Image from "next/image";

interface IGeoHouse {
  id: string;
  title: string;
  address: string;
  photos: string[];
  rate: string;
  price: string;
  discounted_price: string | null;
  tags: string[];
  capacity: number;
  location: { lat: number; lng: number };
  categories: { name: string };
  bathrooms: number;
  parking: number;
  rooms: number;
  transaction_type: string;
  caption: string | null;
}

const DEFAULT_CENTER: [number, number] = [32.4, 53.7]; // مرکز ایران
const DEFAULT_ZOOM = 5;

const makeIcon = (src: string) =>
  L.divIcon({
    className: "",
    html: `
      <div style="display:flex;flex-direction:column;align-items:center">
        <img src="${src}" style="width:48px;height:48px;border-radius:9999px;
          border:3px solid #0f766e;background:#fff;object-fit:cover;
          box-shadow:0 4px 10px rgba(0,0,0,.3)" />
        <div style="width:12px;height:12px;background:#0f766e;
          transform:rotate(45deg);margin-top:-6px"></div>
      </div>`,
    iconSize: [48, 60],
    iconAnchor: [24, 60],
  });

function MapClick({ onBackgroundClick }: { onBackgroundClick: () => void }) {
  useMapEvents({ click: onBackgroundClick });
  return null;
}

export default function HousesMap() {
  const [selected, setSelected] = useState<IGeoHouse | null>(null);
  const { data: houses = [], isFetching } = useGeoHouses();

  const icons = useMemo(
    () => new Map(houses.map((h) => [h.id, makeIcon(h.photos[0])])),
    [houses],
  );

  return (
    <div className="relative isolate z-0 h-full w-full overflow-hidden rounded-3xl">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <MapClick onBackgroundClick={() => setSelected(null)} />

        {houses.map((h) => (
          <Marker
            key={h.id}
            position={[h.location.lat, h.location.lng]}
            icon={icons.get(h.id)!}
            eventHandlers={{
              click: (e) => {
                L.DomEvent.stopPropagation(e);
                setSelected(h);
              },
            }}
          />
        ))}
      </MapContainer>

      {selected && (
        <div
          dir="rtl"
          className="absolute inset-x-4 top-4 z-1000 rounded-2xl bg-teal-700 p-3 text-white shadow-xl"
        >
          <div className="flex items-start gap-3">
            <Image
              src={selected.photos[0]}
              alt=""
              className="size-12 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <h4 className="line-clamp-1 text-sm font-bold">
                {selected.title}
              </h4>
              <p className="line-clamp-1 text-xs opacity-90">
                {selected.address}
              </p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-lg leading-none opacity-80 hover:opacity-100"
              aria-label="بستن"
            >
              ×
            </button>
          </div>
          <Link
            href={`/houseReserve/${selected.id}`}
            className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-teal-900 px-4 py-2 text-xs font-medium hover:bg-teal-950"
          >
            جزئیات بیشتر و رزرو
          </Link>
        </div>
      )}

      {isFetching && (
        <span className="absolute bottom-3 left-3 z-1000 rounded-full bg-white/90 px-3 py-1 text-xs shadow">
          در حال بارگذاری...
        </span>
      )}
    </div>
  );
}
