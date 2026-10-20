"use server";

import { signIn } from "@/auth";

export async function oauthSignInAction(provider: "google" | "github") {
  await signIn(provider, { redirectTo: "/" });
}
