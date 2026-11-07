import TextInput from "@/components/molecules/inputs/textInput/TextInput";
import Button from "@/components/atoms/button/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon } from "@hugeicons/core-free-icons";
import { Control, UseFormSetValue, UseFormGetValues, useWatch } from "react-hook-form";
import { AddHouseFormData } from "@/core/types/addHouse";
import { useState } from "react";

interface Step3Props {
  control: Control<AddHouseFormData>;
  setValue: UseFormSetValue<AddHouseFormData>;
  getValues: UseFormGetValues<AddHouseFormData>;
}

export const Step3Amenities = ({ control, setValue, getValues }: Step3Props) => {
  const [tagInput, setTagInput] = useState("");
  
  // استفاده از useWatch برای رندر مجدد کامپوننت با تغییرات تگ‌ها
  const tags = useWatch({ control, name: "tags" }) || [];

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const currentTags = getValues("tags") || [];
    if (!currentTags.includes(tagInput.trim())) {
      setValue("tags", [...currentTags, tagInput.trim()], { shouldDirty: true, shouldValidate: true });
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = getValues("tags") || [];
    const updatedTags = currentTags.filter((t) => t !== tagToRemove);
    setValue("tags", updatedTags, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput name="rooms" title="تعداد اتاق" control={control} placeholder="اتاق" />
        <TextInput name="bathrooms" title="تعداد حمام" control={control} placeholder="حمام" />
        <TextInput name="parking" title="تعداد پارکینگ" control={control} placeholder="پارکینگ" />
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">نوع حیاط</label>
          <select 
            {...control.register("yard_type")}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100"
          >
            <option value="بالکن دار">بالکن دار</option>
            <option value="حیاط اختصاصی">حیاط اختصاصی</option>
            <option value="بدون حیاط">بدون حیاط</option>
          </select>
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">برچسب‌ها</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
            placeholder="افزودن برچسب جدید..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100"
          />
          <Button type="button" onClick={handleAddTag} variant="primary" className="px-6">افزودن</Button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag, idx) => (
            <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 text-white text-sm">
              {tag}
              <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:opacity-80">
                <HugeiconsIcon icon={Delete01Icon} size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};