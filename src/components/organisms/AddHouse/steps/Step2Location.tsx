import dynamic from "next/dynamic";
import TextInput from "@/components/molecules/inputs/textInput/TextInput";
import { Control, UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { AddHouseFormData } from "@/core/types/addHouse";
import Button from "@/components/atoms/button/Button";
import { useState } from "react";

const MapComponent = dynamic(() => import("../MapComponent"), { ssr: false });

interface Step2Props {
  control: Control<AddHouseFormData>;
  getValues: UseFormGetValues<AddHouseFormData>;
  setValue: UseFormSetValue<AddHouseFormData>;
  location: { lat: number; lng: number };
  onChangeLocation: (lat: number, lng: number) => void;
}

export const Step2Location = ({ control, getValues, setValue, location, onChangeLocation }: Step2Props) => {
  const [isSearching, setIsSearching] = useState(false);

  // تابع جستجوی آدرس روی نقشه با استفاده از OpenStreetMap Nominatim
  const handleSearchAddress = async () => {
    const address = getValues("address");
    if (!address || !address.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        onChangeLocation(lat, lng);
        setValue("location", { lat, lng }, { shouldDirty: true });
      } else {
        alert("آدرسی یافت نشد.");
      }
    } catch (error) {
      console.error("Error searching address:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <TextInput name="address" title="نشانی ملک" control={control} placeholder="نشانی ملک را وارد کنید" />
        </div>
        <Button 
          type="button" 
          variant="primary" 
          onClick={handleSearchAddress}
          isLoading={isSearching}
          className="mb-1 px-6 h-[46px] rounded-xl bg-[#0f3d61] text-white"
        >
          جستجو روی نقشه
        </Button>
      </div>

      <MapComponent location={location} onChangeLocation={onChangeLocation} />
    </div>
  );
};