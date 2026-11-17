import { getAuthUserIdAction } from "@/app/actions/getAuthStatus";
import { toast } from "react-toastify";

export const checkAuthAndExecute = async (
  onAuthorized: (userId: string) => void | Promise<void>
): Promise<boolean> => {
  const userId = await getAuthUserIdAction();

  if (!userId) {
    toast.warn("ابتدا ثبت نام کنید", {
      position: "top-right",
      autoClose: 2500,
    });

    setTimeout(() => {
      window.location.href = "/auth/login";
    }, 2500);

    return false;
  }

  await onAuthorized(userId);
  return true;
};