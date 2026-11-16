import type { ApiResponse, WsEventType, WsMessage } from "@/types/tonde";

/**
 * Configuration de téléchargement de l'application Android TONDE (.APK).
 * Remplacez l'URL par défaut ou définissez `NEXT_PUBLIC_APK_DOWNLOAD_URL`
 * et `NEXT_PUBLIC_APK_RELEASES_URL` dans votre environnement Vercel / .env.
 */
export const APK_CONFIG = {
  downloadUrl:
    process.env.NEXT_PUBLIC_APK_DOWNLOAD_URL ??
    "https://github.com/tonde-sys/tonde-mobile/releases/latest/download/tonde.apk",
  releasesUrl:
    process.env.NEXT_PUBLIC_APK_RELEASES_URL ??
    "https://github.com/tonde-sys/tonde-mobile/releases/latest",
  version: process.env.NEXT_PUBLIC_APK_VERSION ?? "v1.0.0",
  fileSize: "18 Mo",
  minAndroid: "Android 8.0+",
  fileName: "tonde.apk",
} as const;

type EnvironmentName = "development" | "staging" | "production";

const ENV_ENDPOINTS: Record<EnvironmentName, { apiUrl: string; wsUrl: string }> = {
  development: {
    apiUrl: "http://localhost:8000",
    wsUrl: "ws://localhost:8000/ws",
  },
  staging: {
    apiUrl: "https://api-staging.tonde.app",
    wsUrl: "wss://api-staging.tonde.app/ws",
  },
  production: {
    apiUrl: "https://api.tonde.app",
    wsUrl: "wss://api.tonde.app/ws",
  },
};

export function getTondeEnv() {
  const mode = (process.env.NEXT_PUBLIC_TONDE_ENV as EnvironmentName | undefined) ?? "development";
  const defaults = ENV_ENDPOINTS[mode] ?? ENV_ENDPOINTS.development;

  return {
    mode,
    apiUrl: process.env.NEXT_PUBLIC_API_URL ?? defaults.apiUrl,
    wsUrl: process.env.NEXT_PUBLIC_WS_URL ?? defaults.wsUrl,
  };
}

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export async function tondeFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const { apiUrl } = getTondeEnv();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  try {
    const response = await fetch(`${apiUrl}${endpoint}`, {
      ...options,
      headers,
    });
    const json = (await response.json()) as ApiResponse<T>;
    return json;
  } catch {
    return {
      success: false,
      detail: {
        code: "NETWORK_UNAVAILABLE",
        message: "Le serveur TONDE est temporairement injoignable (mode démonstration actif).",
      },
    };
  }
}

export type WsListener = (message: WsMessage) => void;

export class TondeWebSocketClient {
  private socket: WebSocket | null = null;
  private listeners = new Set<WsListener>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  connect(branchCode: string) {
    if (typeof window === "undefined") return;
    this.disconnect();

    const { wsUrl } = getTondeEnv();
    try {
      this.socket = new WebSocket(`${wsUrl}?branch=${encodeURIComponent(branchCode)}`);
      this.socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data as string) as WsMessage;
          this.listeners.forEach((listener) => listener(parsed));
        } catch {
          // Ignore malformed frames
        }
      };
      this.socket.onclose = () => {
        this.reconnectTimer = setTimeout(() => this.connect(branchCode), 5000);
      };
    } catch {
      // Fallback silencieux en mode démo sans backend actif
    }
  }

  subscribe(listener: WsListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  emitLocal(event: WsEventType, payload: unknown) {
    const message: WsMessage = {
      event,
      timestamp: new Date().toISOString(),
      payload,
    };
    this.listeners.forEach((listener) => listener(message));
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socket) {
      this.socket.onclose = null;
      this.socket.close();
      this.socket = null;
    }
  }
}

export const tondeWs = new TondeWebSocketClient();
