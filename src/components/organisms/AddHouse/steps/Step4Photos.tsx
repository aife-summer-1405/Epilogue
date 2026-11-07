import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";

interface Step4Props {
  selectedImages: File[];
  mainImageIndex: number;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onSetMainImage: (index: number) => void;
}

export const Step4Photos = ({ selectedImages, mainImageIndex, onImageChange, onRemoveImage, onSetMainImage }: Step4Props) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {selectedImages.map((file, idx) => {
        const previewUrl = URL.createObjectURL(file);
        const isMain = mainImageIndex === idx;
        return (
          <div key={idx} className={`relative rounded-2xl overflow-hidden border-2 ${isMain ? "border-teal-600" : "border-zinc-200"} h-56`}>
            <img src={previewUrl} alt="House" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onRemoveImage(idx)}
              className="absolute top-3 left-3 p-2 bg-white/80 rounded-full text-red-600 hover:bg-white"
            >
              <HugeiconsIcon icon={Delete01Icon} size={18} />
            </button>
            {isMain ? (
              <span className="absolute bottom-0 inset-x-0 bg-teal-600 text-white text-center py-1 text-sm font-medium">تصویر اصلی</span>
            ) : (
              <button
                type="button"
                onClick={() => onSetMainImage(idx)}
                className="absolute bottom-2 right-2 px-3 py-1 bg-black/60 text-white text-xs rounded-lg"
              >
                انتخاب به عنوان تصویر اصلی
              </button>
            )}
          </div>
        );
      })}

      <label className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl h-56 flex flex-col items-center justify-center cursor-pointer hover:border-[#0f3d61] transition">
        <HugeiconsIcon icon={PlusSignIcon} size={32} className="text-zinc-400 mb-2" />
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">افزودن عکس</span>
        <input type="file" multiple accept="image/*" onChange={onImageChange} className="hidden" />
      </label>
    </div>
  </div>
);