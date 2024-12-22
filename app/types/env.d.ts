interface Env {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  SESSION_SECRET: string;
  PUBLIC_URL: string;
  PRODUCTION_URL: string;
  NODE_ENV: string;
}

declare module '@remix-run/cloudflare' {
  interface AppLoadContext {
    env: Env;
  }
}
