
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";
import { HouseComment } from "@/core/types/RentHouse/Comments/HouseRentComments.types";
import { formatPersianDate } from "@/utils/formatters";

interface Props {
  comment: HouseComment;
  index: number;
}

export default function HouseRentCommentCard({
  comment,
  index,
}: Props) {
  const fullName =
    `${comment.user?.firstName ?? ""} ${comment.user?.lastName ?? ""}`.trim();

  const rating = Number(comment.rating);
const formattedDate = formatPersianDate(comment.created_at);

  return (
    <article
      dir="rtl"
      className={`rounded-xl  dark:bg-[#353535] border-r-4 border-[#1E40AF] p-3 sm:p-4 ${
        index % 3 === 0 ? "bg-[#F0F0F3]" : "bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-200">
          {comment.user?.profilePicture ? (
            <Image
              src={comment.user.profilePicture}
              alt={fullName || "کاربر"}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-neutral-600">
              {fullName.charAt(0) || "ک"}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[20px] font-bold ">
            {fullName || "کاربر"}
          </h3>

          <p className="mt-1 text-xs ">
            {formattedDate}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1 text-[15px] text-amber-500">
          <span className="mt-1">{Number.isFinite(rating) ? rating : 0}</span>
          <HugeiconsIcon icon={StarIcon} fill="#f7df0e" size={18} />

        </div>
      </div>
      <div className="w-full border border-[#DDDDDD] my-3.75"></div>

      <div className="mt-3">
        {comment.title && (
          <h4 className="mb-1 text-[14px] font-semibold dark:text-[#909090] text-[#8B8D98]">
            {comment.title}
          </h4>
        )}

        <p className="break-words text-[14px] leading-6 dark:text-[#909090] text-[#8B8D98]">
          {comment.caption}
        </p>
      </div>
    </article>
  );
}
