import { useEffect, useState } from "react";

export const useCountdown = (seconds: number) => {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    if (left <= 0) return;
    const id = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return { left, label: `${mm}:${ss}`, reset: () => setLeft(seconds) };
};
