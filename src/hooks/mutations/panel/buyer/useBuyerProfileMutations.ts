import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateBuyerProfileAction,
  uploadBuyerPictureAction,
  changeBuyerPasswordAction,
} from "@/app/actions/panel/buyer/buyerProfile.actions";
import {
  IUpdateBuyerUserPayload,
  IChangePasswordPayload,
} from "@/core/types/buyerProfile/buyerProfile.types";

export const useUpdateBuyerProfile = (userId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IUpdateBuyerUserPayload) =>
      updateBuyerProfileAction(payload, userId),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["buyer-profile"] });
      }
    },
  });
};

export const useUploadBuyerPicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => uploadBuyerPictureAction(formData),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["buyer-profile"] });
      }
    },
  });
};

export const useChangeBuyerPassword = () => {
  return useMutation({
    mutationFn: (payload: IChangePasswordPayload) =>
      changeBuyerPasswordAction(payload),
  });
};