import api from "@/lib/http/interceptors";

export interface SocialBookmarkPayload {
  houseId: number | string;
  note: string;
}

export interface UpdateBookmarkPayload {
  id: number | string;
  houseId: number | string;
  note: string;
}

export const bookmarkService = {
  getByHouseId: async (houseId: string | number) => {
    const { data } = await api.get(`/social-bookmarks/house/${houseId}`);
    return data;
  },

  addBookmark: async (payload: SocialBookmarkPayload) => {
    const { data } = await api.post("/social-bookmarks/bookmark", payload);
    return data;
  },

  updateBookmark: async ({ id, ...payload }: UpdateBookmarkPayload) => {
    const { data } = await api.put(`/social-bookmarks/${id}`, payload);
    return data;
  },

  removeBookmark: async (id: string | number): Promise<void> => {
    await api.delete(`/social-bookmarks/${id}`);
  },
};