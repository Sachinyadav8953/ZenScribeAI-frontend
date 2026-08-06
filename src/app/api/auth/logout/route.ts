import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;

  try {
    if (accessToken) {
      await axios.post(
        "http://localhost:8000/auth/logout",
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
