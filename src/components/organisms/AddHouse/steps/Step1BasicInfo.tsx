import TextInput from "@/components/molecules/inputs/textInput/TextInput";
import TextareaInput from "@/components/molecules/inputs/TextareaInput";
import { Control } from "react-hook-form";
import { AddHouseFormData } from "@/core/types/addHouse";

export const Step1BasicInfo = ({ control }: { control: Control<AddHouseFormData> }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TextInput name="title" title="نام ملک" control={control} placeholder="آپارتمان لوکس" />
      <TextInput name="address" title="آدرس" control={control} placeholder="آدرس دقیق ملک..." />
      <TextInput name="capacity" title="ظرفیت (نفر)" type="number" control={control} placeholder="2" />
      <TextInput name="price" title="قیمت (تومان)" type="number" control={control} placeholder="20000000" />
      <TextInput name="rooms" title="تعداد اتاق" type="number" control={control} placeholder="2" />
      <TextInput name="bathrooms" title="تعداد حمام" type="number" control={control} placeholder="1" />
      <TextInput name="parking" title="تعداد پارکینگ" type="number" control={control} placeholder="1" />
    </div>
    <TextareaInput name="caption" title="توضیحات" control={control} placeholder="درباره ملک خود بیشتر توضیح دهید..." rows={5} />
  </div>
);