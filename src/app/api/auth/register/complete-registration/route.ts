import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";
import api from "@/lib/http/interceptors";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const response = await api.post("/api/auth/complete-registration", body);
    const user = response.data?.user;
    return NextResponse.json({
      success: true,
      message: response.data?.message,
      user: user && {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
      },
    });
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
