import { Slider } from "@/components/ui/slider";
import formatPrice from "@/lib/formatters/price";
import { FC } from "react";

interface IProps {
  value: number[];
  setValue: (value: number[]) => void;
  min: number;
  max: number;
  step: number;
}

const RangeInput: FC<IProps> = ({ value, setValue, min, max, step }) => {
  return (
    <div className="mx-auto grid w-full gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <label
            htmlFor="slider-demo-temperature"
            className="text-[#878787] text-[14px] leading-5"
          >
            قیمت از
          </label>
          <p className="font-medium text-default-black text-[14px] leading-5">
            {formatPrice(value[0], false)}{" "}
            <span className={`text-[12px] leading-4 font-medium`}>تومان</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <label
            htmlFor="slider-demo-temperature"
            className="text-[#878787] text-[14px] leading-5"
          >
            قیمت تا
          </label>
          <p className="font-medium text-default-black text-[14px] leading-5">
            {formatPrice(value[1], false)}{" "}
            <span className={`text-[12px] leading-4 font-medium`}>تومان</span>
          </p>
        </div>
      </div>
      <Slider
        id="slider-demo-temperature"
        value={value}
        onValueChange={(value) => setValue(value as number[])}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
};

export default RangeInput;
