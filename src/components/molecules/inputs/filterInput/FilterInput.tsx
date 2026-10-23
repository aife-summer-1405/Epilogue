import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { FC } from "react";
import { IFilterInputs } from "./IFilterInput";
import { cn } from "@/lib/utils";
import { styles } from "./FilterInput.styles";

type Size = "mini" | "default";

interface IValues {
  label: string;
  value: string;
}

interface IProps {
  items: IFilterInputs[];
  placeHolder?: string;
  isTitle?: string;
  onValueChange?: (event: IValues | null) => void;
  onInputValueChange?: () => string;
  className?: string;
  size?: Size;
}

const FilterInput: FC<IProps> = ({
  items,
  isTitle,
  placeHolder = "انتخاب کنید",
  onValueChange,
  onInputValueChange,
  className,
  size = "default",
}) => {
  return (
    <div className={cn("flex flex-col gap-3", styles[size], className)}>
      {isTitle ? (
        <p className={`leading-5.5 text-base text-default-black font-semibold`}>
          {isTitle}
        </p>
      ) : null}
      <Combobox
        items={items}
        onInputValueChange={onInputValueChange}
        onValueChange={onValueChange}
      >
        <ComboboxInput
          className={`border-none! ring-0!`}
          placeholder={placeHolder}
          showClear
        />
        <ComboboxContent>
          <ComboboxEmpty>چیزی یافت نشد !</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
};

export default FilterInput;
