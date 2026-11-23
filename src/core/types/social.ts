export interface SocialMediaLink {
  id: string;
  platform: string;
  url: string;
}

export interface SocialMediaListResponse {
  data: SocialMediaLink[];
  totalCount: number;
}

export interface SocialMediaFilters {
  page: number;
  limit: number;
  sort: string;
  order: "ASC" | "DESC";
  platform: string;
  url: string;
}

export interface SocialMediaMutationPayload {
  platform: string;
  url: string;
}