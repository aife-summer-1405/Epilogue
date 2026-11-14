import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  markNotificationAsReadAction,
  markAllNotificationsAsReadAction,
} from "@/app/actions/panel/buyer/notifications.actions";
import { NOTIFICATIONS_QUERY_KEY } from "@/hooks/queries/useGetNotifications";

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => markNotificationAsReadAction(id),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "خطا در بروزرسانی وضعیت اعلان");
        return;
      }
      toast.success("اعلان به عنوان خوانده‌شده علامت‌گذاری شد.");
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
    },
    onError: () => {
      toast.error("خطا در برقراری ارتباط با سرور");
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsAsReadAction(),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "خطا در علامت‌گذاری تمامی اعلان‌ها");
        return;
      }
      toast.success("تمامی اعلان‌ها به عنوان خوانده‌شده علامت‌گذاری شدند.");
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
    },
    onError: () => {
      toast.error("خطا در برقراری ارتباط با سرور");
    },
  });
};
