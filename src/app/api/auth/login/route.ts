import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const { license_number, password } = await req.json();

    // Call backend login with license_number
    const loginRes = await axios.post(`${BACKEND_URL}/auth/login`, {
      license_number,
      password,
    });

    const { access_token, refresh_token } = loginRes.data;

    // Call backend /auth/me to get user details
    const meRes = await axios.get(`${BACKEND_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const user = meRes.data;

    const response = NextResponse.json({ user, token: access_token });

    // Set httpOnly cookies
    response.cookies.set("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    response.cookies.set("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Login API route error:", error.response?.data || error.message);
    const status = error.response?.status || 500;
    const detail = error.response?.data?.detail || "Authentication failed";
    return NextResponse.json({ detail }, { status });
  }
}
