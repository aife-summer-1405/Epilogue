import {
  IAdminCommentHouse,
  IAdminCommentUser,
} from "@/core/types/admin/adminComments.types";

export const getAdminUserFullName = (user?: IAdminCommentUser | null): string => {
  const full = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
  return full || "کاربر مهمان";
};

export const getAdminUserInitials = (user?: IAdminCommentUser | null): string => {
  const first = user?.firstName?.trim()?.[0] ?? "";
  const last = user?.lastName?.trim()?.[0] ?? "";
  return (first + last).toUpperCase() || "ک";
};

export const getAdminHouseLabel = (house?: IAdminCommentHouse | null): string => {
  if (house?.title?.trim()) return house.title.trim();
  if (house?.id) return `اقامتگاه #${house.id}`;
  return "نامشخص";
};

export const getNumericRating = (rating?: string | number | null): number => {
  const parsed = Number(rating);
  if (isNaN(parsed) || parsed < 0) return 0;
  return Math.min(5, parsed);
};

export const formatAdminCommentDate = (isoDate?: string): string => {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return isoDate;

  const datePart = new Intl.DateTimeFormat("fa-IR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  const timePart = new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return `${datePart} - ${timePart}`;
};