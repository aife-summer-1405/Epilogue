
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";
import { HouseComment } from "@/core/types/RentHouse/Comments/HouseRentComments.types";

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
  const date = new Date(comment.created_at);

  const formattedDate = Number.isNaN(date.getTime())
    ? ""
    : new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);

  return (
    <article
      dir="rtl"
      className={`rounded-xl border-r-2 border-blue-700 p-3 sm:p-4 ${
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
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-neutral-600">
              {fullName.charAt(0) || "ک"}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-neutral-900">
            {fullName || "کاربر"}
          </h3>

          <p className="mt-1 text-xs text-neutral-400">
            {formattedDate}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1 text-xs text-amber-500">
          <HugeiconsIcon icon={StarIcon} size={15} />
          <span>{Number.isFinite(rating) ? rating : 0}</span>
        </div>
      </div>

      <div className="mt-3">
        {comment.title && (
          <h4 className="mb-1 text-xs font-semibold text-neutral-700">
            {comment.title}
          </h4>
        )}

        <p className="break-words text-xs leading-6 text-neutral-500">
          {comment.caption}
        </p>
      </div>
    </article>
  );
}
