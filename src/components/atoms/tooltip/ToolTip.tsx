import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type Side } from "@base-ui/react/internals/useAnchorPositioning";
import { FC, ReactNode } from "react";

interface IProps {
  tooltipText: ReactNode;
  children: ReactNode;
  side?: Side | undefined;
}

const ToolTip: FC<IProps> = ({ tooltipText, children, side }) => {
  return (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent side={side}>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ToolTip;
