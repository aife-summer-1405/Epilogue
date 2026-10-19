"use client";

import { useEffect } from "react";

const DarkModeProvider = () => {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => {};
  }, []);
  return null;
};

export default DarkModeProvider;
