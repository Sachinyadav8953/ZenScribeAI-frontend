export function getBackendUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;
  if (envUrl && envUrl.trim() !== "") {
    return envUrl.trim().replace(/\/+$/, "");
  }
  if (process.env.NODE_ENV === "production" || typeof window !== "undefined" && window.location.hostname.includes("vercel.app")) {
    return "https://zenscribeai-backend.onrender.com";
  }
  return "http://localhost:8000";
}

export function getWsUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_WS_URL;
  if (envUrl && envUrl.trim() !== "") {
    let ws = envUrl.trim().replace(/\/+$/, "");
    if (typeof window !== "undefined" && window.location.protocol === "https:" && ws.startsWith("ws://")) {
      ws = ws.replace("ws://", "wss://");
    }
    return ws;
  }
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    return "wss://zenscribeai-backend.onrender.com";
  }
  if (process.env.NODE_ENV === "production") {
    return "wss://zenscribeai-backend.onrender.com";
  }
  return "ws://localhost:8000";
}
