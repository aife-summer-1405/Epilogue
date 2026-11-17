"use server";

import { cookies } from "next/headers";

export async function getAuthUserIdAction(): Promise<string | null> {
  const cookieStore = await cookies();

  const explicitId = cookieStore.get("userId")?.value || cookieStore.get("id")?.value;
  if (explicitId) return explicitId;

  const token = cookieStore.get("accessToken")?.value;
  if (token) {
    try {
      const base64Payload = token.split(".")[1];
      const decoded = JSON.parse(Buffer.from(base64Payload, "base64").toString("utf-8"));
      const extracted = decoded.id || decoded.userId || decoded.sub;
      if (extracted) return String(extracted);
    } catch {
      return null;
    }
  }

  return null;
}