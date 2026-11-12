import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";
import { FC, ReactNode } from "react";

interface IItems {
  label: string;
  icon?: IconSvgElement;
  onClick?: () => void;
}

interface DropDownMenuProps {
  triggerRender: ReactNode;
  triggerClassName?: string;
  dropDownLabel?: string;
  dropDownItems?: IItems[];
  itemsClassName?: string;
}

const DropDownMenu: FC<DropDownMenuProps> = ({
  triggerRender,
  triggerClassName,
  dropDownLabel,
  dropDownItems,
  itemsClassName,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={triggerClassName}>
        {triggerRender}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {dropDownLabel && (
            <DropdownMenuLabel>{dropDownLabel}</DropdownMenuLabel>
          )}
          {dropDownItems?.map((item, index) => (
            <DropdownMenuItem
              onClick={item.onClick}
              className={itemsClassName}
              key={index}
            >
              {item.icon && (
                <HugeiconsIcon
                  icon={item.icon}
                  className="size-5 text-default-text"
                />
              )}
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownMenu;
