"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";

const LoginToast = () => {
  useEffect(() => {
    if (document.cookie.includes("auth_error=login-required")) {
      toast.error("لطفا ابتدا لاگین کنید", { toastId: "login-required" });
      document.cookie = "auth_error=; max-age=0; path=/";
    }
  }, []);

  return null;
};

export default LoginToast;
