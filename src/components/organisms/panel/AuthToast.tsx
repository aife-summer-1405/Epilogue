"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";

const AuthError = () => {
  useEffect(() => {
    if (document.cookie.includes("auth_error=access_denied")) {
      toast.error("شما به این بخش دسترسی ندارید", {
        toastId: "access_denied",
      });
      document.cookie = "auth_error=; max-age=0; path=/";
    }
  }, []);

  return null;
};

export default AuthError;
