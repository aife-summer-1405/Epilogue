export interface ISocialMediaLink {
  id: string;
  platform: string;
  url: string;
}

export interface IGetSocialMediaLinksParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
  platform?: string;
  url?: string;
}

export interface IGetSocialMediaLinksResponse {
  data: ISocialMediaLink[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface ICreateSocialMediaPayload {
  platform: string;
  url: string;
}

export interface IUpdateSocialMediaPayload {
  id: string | number;
  platform: string;
  url: string;
}