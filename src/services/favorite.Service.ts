import api from "@/lib/http/interceptors"; 
import { FavoritePayload, FavoriteResponse } from "@/core/types/RentHouse/favorite";

export const favoriteService = {
  addFavorite: async (payload: FavoritePayload): Promise<FavoriteResponse> => {
    const { data } = await api.post("/favorites", payload);
    return data;
  },

  removeFavorite: async (id: string | number): Promise<void> => {
    await api.delete(`/favorites/${id}`);
  }
};