"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteContactMessageAction,
  getContactMessageByIdAction,
  getContactMessagesAction,
} from "@/app/actions/admin/contactUs.actions";
import type { GetContactMessagesParams } from "@/core/types/contactUs.types";

export const ADMIN_CONTACT_US_QUERY_KEY = "admin-contact-us";

export function useAdminContactMessagesQuery(params: GetContactMessagesParams) {
  return useQuery({
    queryKey: [ADMIN_CONTACT_US_QUERY_KEY, params],
    queryFn: () => getContactMessagesAction(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useAdminContactMessageDetailQuery(id: string | null) {
  return useQuery({
    queryKey: [ADMIN_CONTACT_US_QUERY_KEY, "detail", id],
    queryFn: () => getContactMessageByIdAction(id!),
    enabled: Boolean(id),
  });
}

export function useDeleteContactMessageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteContactMessageAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_CONTACT_US_QUERY_KEY] });
    },
  });
}