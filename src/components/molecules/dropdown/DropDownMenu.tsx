import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FC, ReactNode } from "react";

interface DropDownMenuProps {
  triggerRender: ReactNode;
  triggerClassName?: string;
  dropDownLabel?: string;
  dropDownItems?: string[];
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
          {dropDownItems?.map((item) => (
            <DropdownMenuItem className={itemsClassName} key={item}>
              {item}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownMenu;
