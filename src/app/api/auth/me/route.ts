import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (!token) {
    const res = NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
    res.cookies.delete("access_token");
    res.cookies.delete("refresh_token");
    return res;
  }

  try {
    const res = await axios.get(`${BACKEND_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return NextResponse.json(res.data);
  } catch (error: any) {
    // If the access token is expired/invalid, try to refresh it
    if (error.response?.status === 401 && refreshToken) {
      try {
        const refreshRes = await axios.post(
          `${BACKEND_URL}/auth/refresh`,
          {
            refresh_token: refreshToken,
          }
        );

        const newAccessToken = refreshRes.data.access_token;
        const newRefreshToken = refreshRes.data.refresh_token;

        // Retry the original profile request with the new access token
        const retryRes = await axios.get(`${BACKEND_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });

        const nextResponse = NextResponse.json(retryRes.data);

        nextResponse.cookies.set("access_token", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24, // 1 day
        });

        if (newRefreshToken) {
          nextResponse.cookies.set("refresh_token", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
          });
        }

        return nextResponse;
      } catch (refreshErr) {
        console.error("Profile load refresh failed:", refreshErr);
      }
    }

    // If refresh failed or there is no refresh token, clear cookies to prevent redirect loops
    const status = error.response?.status || 500;
    const detail = error.response?.data?.detail || "Failed to fetch user profile";
    const res = NextResponse.json({ detail }, { status });
    
    if (status === 401) {
      res.cookies.delete("access_token");
      res.cookies.delete("refresh_token");
    }
    return res;
  }
}
