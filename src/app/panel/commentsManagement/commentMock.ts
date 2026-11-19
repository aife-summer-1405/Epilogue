import {
  ICommentHouse,
  ICommentsQuery,
  ICommentsResponse,
  ICommentUser,
  ISellerComment,
  ISellerCommentDetail,
} from "./ICommentManagement";
import {
  endOfDayMs,
  getHouseLabel,
  getRatingNumber,
  getUserFullName,
  isOwnComment,
  startOfDayMs,
} from "./commentUtils";

export const currentUser: ICommentUser = {
  firstName: "مدیریت",
  lastName: "اقامتگاه",
  profilePicture: null,
};

const users: ICommentUser[] = [
  { firstName: "تینا", lastName: "محمودی", profilePicture: null },
  { firstName: "سارا", lastName: "محمدی", profilePicture: null },
  { firstName: "مهدی", lastName: "رضایی", profilePicture: "/images/hotel.jpg" },
  { firstName: "نگار", lastName: "احمدی", profilePicture: null },
];

const houses: ICommentHouse[] = [
  { id: "31", title: "ویلا ساحلی چمخاله", address: "گیلان، لنگرود، چمخاله" },
  { id: "32", title: "آپارتمان لوکس زعفرانیه", address: "تهران، زعفرانیه" },
  { id: "33", title: "", address: "" },
];

const sampleTitles = [
  "اقامت عالی",
  "تمیز و مرتب",
  "موقعیت مکانی خوب",
  "ارزش خرید بالا",
  "نیاز به بهبود",
];

const sampleCaptions = [
  "اقامتگاه بسیار تمیز بود و میزبان برخورد خیلی خوبی داشت، حتما دوباره رزرو می کنم.",
  "موقعیت مکانی عالی بود و دسترسی به مراکز خرید و رستوران ها راحت بود.",
  "امکانات کامل بود ولی صدای محیط بیرون کمی در شب اذیت می کرد.",
  "قیمت نسبت به امکانات منطقی بود و ورود و خروج بدون مشکل انجام شد.",
  "در کل خوب بود اما سرویس بهداشتی نیاز به رسیدگی بیشتری دارد.",
];

const generatedComments: ISellerComment[] = Array.from(
  { length: 11 },
  (_, i) => ({
    id: String(40 + i),
    house_id: houses[i % houses.length].id,
    title: sampleTitles[i % sampleTitles.length],
    caption: sampleCaptions[i % sampleCaptions.length],
    rating: String(((i * 2) % 5) + 1),
    created_at: new Date(
      Date.UTC(2026, 9, 20 + i, 8 + (i % 6), 26, 27),
    ).toISOString(),
    parent_comment_id: null,
    user: users[(i + 1) % users.length],
    house: houses[i % houses.length],
  }),
);

const sampleComment: ISellerComment = {
  id: "51",
  house_id: "33",
  title: "سلام برای تست هستیم",
  caption: "سلام برای تست هستیم\nداریم تست میکنیم ببینیم چخبره",
  rating: "3",
  created_at: "2026-11-13T19:52:45.235Z",
  parent_comment_id: null,
  user: { firstName: "تینا", lastName: "محمودی", profilePicture: null },
  house: { id: "33", title: "", address: "" },
};

const makeReply = (
  id: string,
  parent: ISellerComment,
  caption: string,
  created_at: string,
): ISellerComment => ({
  id,
  house_id: parent.house_id,
  title: "پاسخ فروشنده",
  caption,
  rating: "0",
  created_at,
  parent_comment_id: parent.id,
  user: currentUser,
  house: parent.house,
});

export const initialComments: ISellerComment[] = [
  ...generatedComments,
  sampleComment,
  makeReply(
    "60",
    generatedComments[3],
    "از بازخورد شما سپاسگزاریم و در تلاش برای بهبود هستیم.",
    "2026-10-24T12:45:00.000Z",
  ),
  makeReply(
    "61",
    generatedComments[6],
    "ممنون از نظر شما، خوشحالیم که اقامت خوبی داشتید.",
    "2026-10-27T09:10:00.000Z",
  ),
];

export const buildCommentsResponse = (
  all: ISellerComment[],
  query: ICommentsQuery,
): ICommentsResponse => {
  const q = query.search.trim();
  const fromMs = query.fromDate ? startOfDayMs(query.fromDate) : null;
  const toMs = query.toDate ? endOfDayMs(query.toDate) : null;

  const filtered = all
    .filter((c) => {
      const own = isOwnComment(c.user, currentUser);

      if (
        q &&
        !c.title.includes(q) &&
        !c.caption.includes(q) &&
        !getUserFullName(c.user).includes(q) &&
        !getHouseLabel(c.house).includes(q)
      ) {
        return false;
      }
      if (
        query.rating !== "all" &&
        (c.parent_comment_id ||
          getRatingNumber(c.rating) !== Number(query.rating))
      ) {
        return false;
      }
      if (query.type === "customers" && own) return false;
      if (query.type === "mine" && !own) return false;

      const created = new Date(c.created_at).getTime();
      if (fromMs !== null && created < fromMs) return false;
      if (toMs !== null && created > toMs) return false;

      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

  const totalPages = Math.max(1, Math.ceil(filtered.length / query.perPage));
  const currentPage = Math.min(Math.max(1, query.page), totalPages);

  return {
    comments: filtered.slice(
      (currentPage - 1) * query.perPage,
      currentPage * query.perPage,
    ),
    totalCount: filtered.length,
    currentPage,
    totalPages,
  };
};

export const buildCommentDetail = (
  all: ISellerComment[] = [],
  id: string,
): ISellerCommentDetail | null => {
  const comment = all.find((c) => c.id === id);

  if (!comment) return null;

  return {
    ...comment,
    parent_comment: comment.parent_comment_id
      ? (all.find((c) => c.id === comment.parent_comment_id) ?? null)
      : null,
  };
};
