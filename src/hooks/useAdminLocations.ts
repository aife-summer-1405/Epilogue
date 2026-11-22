"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLocationAction,
  deleteLocationAction,
  getLocationsAction,
  updateLocationAction,
} from "@/app/actions/admin/location.actions";
import type {
  GetLocationsParams,
  LocationPayload,
} from "@/core/types/location.types";

export const ADMIN_LOCATIONS_QUERY_KEY = "admin-locations";

export function useAdminLocationsQuery(params: GetLocationsParams) {
  return useQuery({
    queryKey: [ADMIN_LOCATIONS_QUERY_KEY, params],
    queryFn: () => getLocationsAction(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateLocationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LocationPayload) => createLocationAction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_LOCATIONS_QUERY_KEY] });
    },
  });
}

export function useUpdateLocationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: LocationPayload }) =>
      updateLocationAction(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_LOCATIONS_QUERY_KEY] });
    },
  });
}

export function useDeleteLocationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteLocationAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_LOCATIONS_QUERY_KEY] });
    },
  });
}