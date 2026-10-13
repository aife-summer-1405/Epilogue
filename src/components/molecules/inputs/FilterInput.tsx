import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { FC } from "react";

type Framework = {
  label: string;
  value: string;
};

interface IProps {
  items: Framework[];
  placeHolder: string;
  isTitle?: string;
  onValueChange?: (event: string | null) => void;
  onInputValueChange?: () => string;
}

const FilterInput: FC<IProps> = ({
  items,
  isTitle,
  placeHolder,
  onValueChange,
  onInputValueChange,
}) => {
  return (
    <div className={`flex flex-col gap-3`}>
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
