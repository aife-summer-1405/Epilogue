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

interface IProps {
  items: IFilterInputs[];
  placeHolder?: string;
  isTitle?: string;
  onValueChange?: (event: IFilterInputs | null) => void;
  onInputValueChange?: (event: string) => void;
  className?: string;
  size?: Size;
  isNumeric?: boolean;
  defaultValue?: IFilterInputs;
  value?: IFilterInputs | null;
  inputClassName?: string;
}

const FilterInput: FC<IProps> = ({
  items,
  isTitle,
  placeHolder = "انتخاب کنید",
  onValueChange,
  onInputValueChange,
  className,
  size = "mini",
  isNumeric = false,
  defaultValue,
  value,
  inputClassName,
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
        value={value}
        onValueChange={onValueChange}
        defaultValue={defaultValue}
      >
        <ComboboxInput
          className={cn("border-none! ring-0!")}
          inputClassName={inputClassName}
          placeholder={placeHolder}
          showClear
          onBeforeInput={(e) => {
            if (isNumeric) {
              const data = (e as unknown as InputEvent).data;
              if (data && !/^[0-9]+$/.test(data)) {
                e.preventDefault();
              }
            }
          }}
        />
        <ComboboxContent>
          <ComboboxEmpty>چیزی یافت نشد !</ComboboxEmpty>
          <ComboboxList>
            {(item, index) => (
              <ComboboxItem key={index} value={item}>
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
