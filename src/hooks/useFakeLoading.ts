"use client";

import { useEffect, useState } from "react";

const useFakeLoading = (trigger: unknown = true, delay = 1500) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (!trigger) return;
    const timer = setTimeout(() => setIsLoading(false), delay);
    return () => clearTimeout(timer);
  }, [trigger, delay]);

  return isLoading;
};

export default useFakeLoading;
