
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

interface AuthContext {
  headers: HeadersInit;
  role: string | null;
  token: string;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );

    const json = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function extractRoleFromToken(token: string): string | null {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  const rawRole =
    payload.role ??
    payload.userRole ??
    (Array.isArray(payload.roles) ? payload.roles[0] : null);

  return typeof rawRole === "string" ? rawRole.toLowerCase() : null;
}

async function getAuthContext(): Promise<AuthContext> {
  const cookieStore = await cookies();

  const token =
    cookieStore.get("accessToken")?.value ||
    cookieStore.get("token")?.value ||
    cookieStore.get("auth_token")?.value ||
    "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const cookieRole =
    cookieStore.get("role")?.value?.toLowerCase() || null;

  const tokenRole = token ? extractRoleFromToken(token) : null;

  const role = tokenRole || cookieRole;

  return { headers, role, token };
}

function buildUrl(path: string) {
  return BASE_URL ? `${BASE_URL}${path}` : path;
}

export async function canAnswerPropertyQA() {
  const { role, token } = await getAuthContext();

  return Boolean(
    token && role && ["seller", "admin"].includes(role)
  );
}

export async function getPropertyQAs(houseId: string | number) {
  const { headers } = await getAuthContext();

  const res = await fetch(buildUrl(`/property-QA/${houseId}`), {
    method: "GET",
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(errText || "خطا در دریافت پرسش و پاسخ‌ها");
  }

  return res.json();
}

export async function createQuestionAction(payload: {
  houseId: string | number;
  question: string;
}) {
  const { headers, token } = await getAuthContext();

  if (!token) {
    throw new Error("برای ثبت سوال ابتدا وارد حساب کاربری شوید");
  }

  const res = await fetch(buildUrl("/property-QA/question"), {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(errText || "خطا در ارسال سوال");
  }

  return res.json();
}

export async function createAnswerAction(payload: {
  questionId: string | number;
  answer: string;
}) {
  const { headers, role, token } = await getAuthContext();

  if (!token) {
    throw new Error("برای ثبت پاسخ ابتدا وارد حساب کاربری شوید");
  }

  const allowedRoles = ["seller", "admin"];

  if (!role || !allowedRoles.includes(role)) {
    throw new Error("فقط فروشنده یا مدیر امکان ثبت پاسخ دارد");
  }

  const res = await fetch(buildUrl("/property-QA/answer"), {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(errText || "خطا در ارسال پاسخ");
  }

  revalidatePath("/panel");

  return res.json();
}
