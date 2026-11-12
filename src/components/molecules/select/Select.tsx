import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SelectRootChangeEventDetails } from "@base-ui/react";
import { FC } from "react";

interface IItems {
  label: string;
  value: string | null;
}

interface ISelectProps {
  items: IItems[];
  selectLabel?: string;
  onChange: (
    value: string | null,
    eventDetails: SelectRootChangeEventDetails,
  ) => void;
  triggerClassName?: string;
  defaultValue?: string;
  placeHolder?: string;
}

const defaultItems: IItems[] = [
  { label: "Select a fruit", value: null },
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Blueberry", value: "blueberry" },
  { label: "Grapes", value: "grapes" },
  { label: "Pineapple", value: "pineapple" },
];

const SelectComponent: FC<ISelectProps> = ({
  items = defaultItems,
  selectLabel,
  onChange,
  triggerClassName,
  defaultValue,
  placeHolder,
}) => {
  return (
    <Select
      defaultValue={defaultValue ? defaultValue : undefined}
      items={items}
      onValueChange={onChange}
    >
      <SelectTrigger className={cn("w-full", triggerClassName)}>
        <SelectValue placeholder={placeHolder} />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <SelectGroup>
          {selectLabel ? <SelectLabel>{selectLabel}</SelectLabel> : null}
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectComponent;
