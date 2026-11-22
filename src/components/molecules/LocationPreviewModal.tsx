"use client";

import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, MapsLocation01Icon } from "@hugeicons/core-free-icons";
import type { LocationItem } from "@/core/types/location.types";

const LocationMapPicker = dynamic(
  () =>
    import("./LocationMapPicker").then((mod) => mod.LocationMapPicker),
  { ssr: false }
);

interface LocationPreviewModalProps {
  location: LocationItem | null;
  onClose: () => void;
}

export function LocationPreviewModal({
  location,
  onClose,
}: LocationPreviewModalProps) {
  return (
    <AnimatePresence>
      {location && (
        <div
          dir="rtl"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-5 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={MapsLocation01Icon}
                  size={20}
                  className="text-primary-500"
                />
                <h3 className="text-base font-extrabold text-default-text">
                  موقعیت جغرافیایی: {location.areaName}
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-neutral-800 dark:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-50 cursor-pointer"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </button>
            </div>

            <LocationMapPicker
              lat={Number(location.lat)}
              lng={Number(location.lng)}
              interactive={false}
              heightClassName="h-72"
            />

            <div className="mt-3 flex items-center justify-between rounded-xl bg-neutral-100 dark:bg-neutral-50 px-4 py-2.5 text-xs text-default-text">
              <span>
                Lat: <strong dir="ltr">{Number(location.lat).toFixed(4)}</strong>
              </span>
              <span>
                Lng: <strong dir="ltr">{Number(location.lng).toFixed(4)}</strong>
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}