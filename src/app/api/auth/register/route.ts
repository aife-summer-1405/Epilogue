import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";
import api from "@/lib/http/interceptors";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const response = await api.post("/api/auth/register", body);
    return NextResponse.json({ success: true, ...response.data });
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        {
          success: false,
          message: error.response?.data?.message ?? error.message,
        },
        { status: error.response?.status ?? 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
};
