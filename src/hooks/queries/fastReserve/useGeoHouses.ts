"use client";

import { useQuery } from "@tanstack/react-query";
import { getGeoHouses } from "@/app/actions/fastReserve/geo.actions";

export const GEO_CENTER = { lat: 35.7022, lng: 51.4 };
export const GEO_RADIUS = 1000000;

export function useGeoHouses() {
  return useQuery({
    queryKey: ["geo-houses", GEO_CENTER.lat, GEO_CENTER.lng, GEO_RADIUS],
    queryFn: () =>
      getGeoHouses({
        lat: GEO_CENTER.lat,
        lng: GEO_CENTER.lng,
        radius: GEO_RADIUS,
      }),
    staleTime: 5 * 60 * 1000,
  });
}
