"use client";

import { useEffect } from "react";

const DarkModeProvider = () => {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    return () => {};
  }, []);
  return null;
};

export default DarkModeProvider;
