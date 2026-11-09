import { HugeiconsIcon } from "@hugeicons/react";
import { Location01Icon, BathIcon, Car01Icon, UserMultiple02Icon, Home01Icon, Bed } from "@hugeicons/core-free-icons";
import { AddHouseFormData } from "@/core/types/addHouse";
import { formatPrice } from "@/utils/formatters";

interface Step5Props {
  houseData: Partial<AddHouseFormData>;
  selectedImages: File[];
  mainImageIndex: number;
}

export const Step5Review = ({ houseData, selectedImages, mainImageIndex }: Step5Props) => (
  <div className="space-y-6">
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800">
           <div className="rounded-2xl overflow-hidden h-64">
        {selectedImages.length > 0 ? (
          <img src={URL.createObjectURL(selectedImages[mainImageIndex] || selectedImages[0])} alt="Main" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-400">بدون تصویر</div>
        )}
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{houseData.title}</h2>
        <p className="text-sm text-zinc-500 flex items-center gap-1.5">
          <HugeiconsIcon icon={Location01Icon} size={16} />
          {houseData.address}
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{houseData.caption}</p>
        <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {formatPrice(Number(houseData.price || 0).toLocaleString())} تومان
        </div>
      </div>


    </div>

    <div className="space-y-4">
      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">برچسب‌ها :</h3>
      <div className="flex flex-wrap gap-2">
        {(houseData.tags || []).map((tag, i) => (
          <span key={i} className="px-4 py-1.5 rounded-lg bg-orange-500 text-white text-sm">{tag}</span>
        ))}
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">سایر مشخصات :</h3>
      <div className="flex flex-wrap gap-3">
        <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm"><HugeiconsIcon icon={Bed} size={16} /> {houseData.rooms} خوابه</span>
        <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm"><HugeiconsIcon icon={BathIcon} size={16} /> {houseData.bathrooms} حمام</span>
        <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm"><HugeiconsIcon icon={Car01Icon} size={16} /> {houseData.parking} پارکینگ</span>
        <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm"><HugeiconsIcon icon={UserMultiple02Icon} size={16} /> {houseData.capacity} نفر ظرفیت</span>
        <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm"><HugeiconsIcon icon={Home01Icon} size={16} /> {houseData.yard_type}</span>
      </div>
    </div>
  </div>
);