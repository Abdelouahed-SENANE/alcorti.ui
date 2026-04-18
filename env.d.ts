declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_APP_NAME: string;
    readonly NEXT_PUBLIC_APP_VERSION: string;
    readonly NEXT_PUBLIC_APP_ENV: "development" | "staging" | "production";
    readonly NEXT_PUBLIC_APP_URL: string;

    readonly NEXT_PUBLIC_API_URL: string;
    readonly NEXT_PUBLIC_GRAPHQL_URL: string;
    readonly NEXT_PUBLIC_WS_URL: string;
    readonly NEXT_PUBLIC_API_TIMEOUT: string;
    readonly NEXT_PUBLIC_API_RETRIES: string;
    readonly NEXT_PUBLIC_STORAGE_URL: string;

    readonly NEXT_PUBLIC_AUTH_PROVIDER:
      | "local"
      | "keycloak"
      | "firebase"
      | "oidc";
    readonly NEXT_PUBLIC_AUTH_REDIRECT_URL: string;
    readonly NEXT_PUBLIC_TOKEN_STORAGE_KEY: string;
    readonly NEXT_PUBLIC_REFRESH_TOKEN_STORAGE_KEY: string;
    readonly NEXT_PUBLIC_ENABLE_REMEMBER_ME: string;

    readonly NEXT_PUBLIC_FEATURE_ANALYTICS: string;
    readonly NEXT_PUBLIC_FEATURE_CACHE: string;
    readonly NEXT_PUBLIC_FEATURE_OFFLINE: string;
    readonly NEXT_PUBLIC_FEATURE_BETA_UI: string;

    readonly NEXT_PUBLIC_LOG_LEVEL: "debug" | "info" | "warn" | "error";
    readonly NEXT_PUBLIC_DEBUG: string;
    readonly NEXT_PUBLIC_MODE: "development" | "staging" | "production";

    readonly NEXT_PUBLIC_THEME: "light" | "dark";
    readonly NEXT_PUBLIC_PRIMARY_COLOR: string;
    readonly NEXT_PUBLIC_DEFAULT_LANGUAGE: "fr" | "ar" | "en";
    readonly NEXT_PUBLIC_SUPPORTED_LANGUAGES: string;
    readonly NEXT_PUBLIC_DATE_FORMAT: string;

    readonly NEXT_PUBLIC_STORAGE_PREFIX: string;
    readonly NEXT_PUBLIC_CACHE_TTL: string;
    readonly NEXT_PUBLIC_USE_INDEXEDDB: string;

    readonly NEXT_PUBLIC_COMMIT_SHA: string;
    readonly NEXT_PUBLIC_BUILD_DATE: string;
    readonly NEXT_PUBLIC_RELEASE_CHANNEL: "stable" | "beta" | "canary";
  }
}
