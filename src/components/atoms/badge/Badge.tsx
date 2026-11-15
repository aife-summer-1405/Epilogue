import { cn } from "@/lib/utils";
import { FC } from "react";

interface IProps {
  text: string;
  type: "confirmed" | "pending" | "canceled";
}

const badgeTypeClasses = {
  confirmed: "bg-[#CCF2ED] text-[#008C78]",
  pending: "bg-[#FFF6E0] text-[#F8B524]",
  canceled: "bg-[#FFECEC] text-[#FF5555]",
};

const Badge: FC<IProps> = ({ text, type }) => {
  return (
    <div
      className={cn(
        "text-base font-normal px-2 py-1 rounded-[8px] w-fit",
        badgeTypeClasses[type],
      )}
    >
      {text}
    </div>
  );
};

export default Badge;
