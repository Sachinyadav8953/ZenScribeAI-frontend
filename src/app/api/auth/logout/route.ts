import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;

  try {
    if (accessToken) {
      await axios.post(
        `${BACKEND_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    }
  } catch (error) {
    console.error("Backend logout error:", error);
  }

  const response = NextResponse.json({ message: "Logged out successfully" });
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  return response;
}
