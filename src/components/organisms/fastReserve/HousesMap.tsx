"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import Image from "next/image";
import { useGeoHouses } from "@/hooks/queries/fastReserve/useGeoHouses";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Location01Icon } from "@hugeicons/core-free-icons";
import Button from "@/components/atoms/button/Button";
import ImageFallback from "@/components/molecules/ImageFallBack/ImageFallBack";

const DEFAULT_CENTER: [number, number] = [32.4, 53.7];
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

export default function HousesMap() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
    return () => setReady(false);
  }, []);
  const { data: houses = [], isFetching } = useGeoHouses();

  const icons = useMemo(
    () => new Map(houses.map((h) => [h.id, makeIcon(h.photos[0])])),
    [houses],
  );

  return (
    <div className="relative isolate z-0 h-full w-full overflow-hidden rounded-3xl">
      {ready && (
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          className="h-full w-full font-sans!"
          zoomControl={false}
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {houses.map((h) => (
            <Marker
              key={h.id}
              position={[h.location.lat, h.location.lng]}
              icon={icons.get(h.id)!}
            >
              <Popup
                className="[&_.leaflet-popup-content-wrapper]:bg-transparent! [&_.leaflet-popup-content-wrapper]:shadow-none! [&_.leaflet-popup-content-wrapper]:p-0! [&_.leaflet-popup-content]:m-0! [&_.leaflet-popup-tip]:bg-secondary-500!"
                closeButton={false}
                maxWidth={396}
                offset={[0, 7]}
                autoPanPadding={[20, 80]}
              >
                <div className="2xl:w-99 w-88 rounded-[16px] 2xl:px-7 2xl:py-8 px-5 py-6 bg-secondary-500 text-white flex flex-col 2xl:gap-5 gap-3">
                  <div className="flex items-start gap-3">
                    <ImageFallback
                      src={h.photos[0]}
                      alt={h.title}
                      className="size-12 shrink-0 rounded-full object-cover"
                    />
                    <div className="flex flex-col text-right gap-1">
                      <h4 className="line-clamp-1 2xl:text-[18px] text-base font-semibold text-default-white">
                        {h.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon
                          icon={Location01Icon}
                          className="text-default-white size-6"
                        />
                        <p className="line-clamp-1 2xl:text-base text-[14px] font-medium m-0! text-default-white">
                          {h.address}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link href={`/fastReserve/${h.id}`}>
                    <Button
                      endIcon={
                        <HugeiconsIcon
                          icon={ArrowLeft01Icon}
                          className="text-default-white size-6"
                        />
                      }
                    >
                      <p className="text-[14px]">جزئیات بیشتر و رزرو</p>
                    </Button>
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      {isFetching && (
        <span className="absolute bottom-3 left-3 z-1000 rounded-full bg-white/90 px-3 py-1 text-xs shadow">
          در حال بارگذاری...
        </span>
      )}
    </div>
  );
}
