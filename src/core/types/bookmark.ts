export interface SocialBookmarkHouse {
  id: number | string;
  title: string;
  address: string;
  photos: string[];
  rate?: string;
  price?: string;
  discounted_price?: string | null;
  tags?: string[];
  capacity?: number;
  rooms?: number;
  bathrooms?: number;
  parking?: number;
  sellerId?: number | string;
}

export interface SocialBookmark {
  id: number | string;
  userId?: string;
  houseId: number | string;
  note: string;
  created_at?: string;
  updated_at?: string;
  house?: SocialBookmarkHouse;
}

export interface BookmarkResponse {
  bookmark: SocialBookmark;
  shareUrl?: string;
}

export interface CreateBookmarkPayload {
  houseId: number | string;
  note: string;
}

export interface UpdateBookmarkPayload {
  id: number | string;
  houseId?: number | string;
  note: string;
}