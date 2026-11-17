"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useOwnerAuth() {
  const router = useRouter();

  useEffect(() => {
    const isAuth = sessionStorage.getItem("owner_authenticated");
    if (!isAuth) {
      router.replace("/owner/login");
    }
  }, [router]);
}
