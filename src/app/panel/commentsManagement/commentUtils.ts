import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { ICommentHouse, ICommentUser } from "./ICommentManagement";

export const formatCommentDate = (iso: string) =>
  new DateObject({
    date: new Date(iso),
    calendar: persian,
    locale: persian_fa,
  }).format("D MMMM YYYY - HH:mm");

export const getUserFullName = (user: ICommentUser) =>
  `${user.firstName} ${user.lastName}`.trim();

export const getUserInitials = (user: ICommentUser) =>
  `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.trim();

export const getRatingNumber = (rating: string) =>
  Math.min(5, Math.max(0, Number(rating) || 0));

export const getHouseLabel = (house: ICommentHouse) =>
  house.title.trim() || `اقامتگاه ${house.id}`;

export const isOwnComment = (
  commentUser: ICommentUser,
  currentUser: ICommentUser,
) => getUserFullName(commentUser) === getUserFullName(currentUser);

export const startOfDayMs = (date: Date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy.getTime();
};

export const endOfDayMs = (date: Date) => {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy.getTime();
};
