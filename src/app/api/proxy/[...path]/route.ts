import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getBackendUrl } from "@/lib/config";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxy(req, resolvedParams.path, "GET");
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxy(req, resolvedParams.path, "POST");
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxy(req, resolvedParams.path, "PATCH");
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxy(req, resolvedParams.path, "DELETE");
}

async function handleProxy(
  req: NextRequest,
  pathSegments: string[],
  method: string
) {
  const BACKEND_URL = getBackendUrl();
  const path = pathSegments.join("/");
  const backendUrl = `${BACKEND_URL}/${path}`;

  let token = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  const { search } = new URL(req.url);
  const targetUrl = search ? `${backendUrl}${search}` : backendUrl;

  let body = null;
  if (["POST", "PATCH", "PUT"].includes(method)) {
    try {
      body = await req.json();
    } catch {
      body = null;
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await axios({
      url: targetUrl,
      method,
      data: body,
      headers,
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    // If token has expired and we have a refresh token, try to refresh it
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

        headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry the original request
        const retryRes = await axios({
          url: targetUrl,
          method,
          data: body,
          headers,
        });

        const nextResponse = NextResponse.json(retryRes.data, {
          status: retryRes.status,
        });

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
        console.error("Token refresh failed:", refreshErr);
        // Clear expired cookies and return 401
        const logoutResponse = NextResponse.json(
          { detail: "Session expired. Please log in again." },
          { status: 401 }
        );
        logoutResponse.cookies.delete("access_token");
        logoutResponse.cookies.delete("refresh_token");
        return logoutResponse;
      }
    }

    const status = error.response?.status || 500;
    const detail =
      error.response?.data?.detail ||
      error.response?.data ||
      error.message ||
      "Proxy request failed";
    return NextResponse.json({ detail }, { status });
  }
}
