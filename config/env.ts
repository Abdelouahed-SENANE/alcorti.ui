export const env = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME,
    version: process.env.NEXT_PUBLIC_APP_VERSION,
    env: process.env.NEXT_PUBLIC_APP_ENV,
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  logging: {
    level: process.env.NEXT_PUBLIC_LOG_LEVEL,
    debug: process.env.NEXT_PUBLIC_DEBUG === "true",
    mode: process.env.NEXT_PUBLIC_MODE,
  },
  auth: {
    provider: process.env.NEXT_PUBLIC_AUTH_PROVIDER,
    redirectURL: process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL,
    tokenStorageKey: process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY,
    refreshTokenStorageKey:
      process.env.NEXT_PUBLIC_REFRESH_TOKEN_STORAGE_KEY,
    enableRememberMe:
      process.env.NEXT_PUBLIC_ENABLE_REMEMBER_ME === "true",
  },
  theme: {
    defaultTheme: process.env.NEXT_PUBLIC_THEME,
    primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR,
  },
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 10000,
    retries: Number(process.env.NEXT_PUBLIC_API_RETRIES) || 2,
  },
  features: {
    analytics: process.env.NEXT_PUBLIC_FEATURE_ANALYTICS === "true",
    cache: process.env.NEXT_PUBLIC_FEATURE_CACHE === "true",
    offline: process.env.NEXT_PUBLIC_FEATURE_OFFLINE === "true",
  },
};
