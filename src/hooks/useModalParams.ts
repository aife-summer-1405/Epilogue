"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const useModalParams = (key = "modal") => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const modal = searchParams.get(key);

  const open = (name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, name);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const close = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return { modal, open, close };
};

export default useModalParams;
