"use client";

import dynamic from "next/dynamic";

const HousesMap = dynamic(() => import("./HousesMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-3xl bg-neutral-300" />
  ),
});

export default function HousesMapLoader() {
  return <HousesMap />;
}
