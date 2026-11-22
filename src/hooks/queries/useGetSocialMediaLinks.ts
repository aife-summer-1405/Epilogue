import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getSocialMediaLinksAction } from "@/app/actions/admin/socialMedia.actions";
import { IGetSocialMediaLinksParams } from "@/core/types/admin/socialMedia.types";

export const SOCIAL_MEDIA_QUERY_KEY = "admin-social-media-links";

export const useGetSocialMediaLinks = (params: IGetSocialMediaLinksParams) => {
  return useQuery({
    queryKey: [SOCIAL_MEDIA_QUERY_KEY, params],
    queryFn: () => getSocialMediaLinksAction(params),
    placeholderData: keepPreviousData,
  });
};