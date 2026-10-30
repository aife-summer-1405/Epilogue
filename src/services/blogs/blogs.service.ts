export interface GetBlogsParams {
  page?: number;
  limit?: number;
  sort?: "created_at" | "updated_at" | "title" | "views";
  order?: "ASC" | "DESC";
  title?: string;
  author_id?: number;
  category_id?: number;
}

export interface BlogItem {
  id: number | string;
  title: string;
  caption?: string;
  content?: string;
  description?: string;
  summary?: string;
  image?: string;
  thumbnail?: string;
  cover?: string;
  photos?: string[];
  created_at?: string;
  updated_at?: string;
  reading_time?: number | string;
  estimated_reading_time?: string;
  views?: number;
  author_id?: string | number;
  category_id?: string | number;
  category?:
    | {
        id: number | string;
        name?: string;
        title?: string;
      }
    | string;
}

export interface GetBlogsResponse {
  data: BlogItem[];
  totalCount: number;
  totalPages: number;
}

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || "http://87.107.2.216:3002/";

export const getBlogs = async (
  params: GetBlogsParams,
): Promise<GetBlogsResponse> => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (key === "title") return;

    if (value !== undefined && value !== null && value !== "") {
      if (key === "sort" && (value === "updated_at" || value === "views")) {
        searchParams.append("sort", "created_at");
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const response = await fetch(
    `${getBaseUrl()}/blogs?${searchParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("خطا در دریافت لیست مقالات");
  }

  const result = await response.json();

  if (Array.isArray(result)) {
    return {
      data: result,
      totalCount: result.length,
      totalPages: 1,
    };
  }

  const items: BlogItem[] = result.data || result.blogs || result.items || [];
  const totalCount = Number(result.totalCount ?? result.total ?? items.length);
  const limit = params.limit || 12;
  const totalPages = Number(
    result.totalPages ?? (Math.ceil(totalCount / limit) || 1),
  );

  return {
    data: items,
    totalCount,
    totalPages,
  };
};

export const getBlogById = async (id: string | number): Promise<BlogItem> => {
  const response = await fetch(`${getBaseUrl()}/blogs/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("خطا در دریافت اطلاعات مقاله");
  }

  const result = await response.json();
  return result.data ? result.data : result;
};
