import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { FC } from "react";

interface IProps {
  onClick: () => void;
}

const BackButton: FC<IProps> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-1 self-start text-neutral-900 text-base cursor-pointer"
  >
    <HugeiconsIcon icon={ArrowRight01Icon} className="size-5" />
    بازگشت
  </button>
);

export default BackButton;
