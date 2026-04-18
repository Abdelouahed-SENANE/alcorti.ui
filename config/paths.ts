export const paths = {
  home: {
    root: "/",
    route: () => "/",
  },
  profile: {
    root: "/profile",
    route: () => "/profile",
  },
  settings: {
    root: "/settings",
    route: () => "/settings",
  },
  auth: {
    root: "/auth",
    login: {
      root: "/auth/login",
      route: (redirectTo: string | null | undefined) =>
        `/auth/login${redirectTo ? `?from=${encodeURIComponent(redirectTo)}` : ""}`,
    },
    register: {
      root: "/auth/register",
      route: (redirectTo: string | null | undefined) =>
        `/auth/register${redirectTo ? `?from=${encodeURIComponent(redirectTo)}` : ""}`,
    },
  },
  admin: {
    root: "/admin",
    dashboard: {
      root: "dashboard",
      route: () => "/admin/dashboard",
    },
    users: {
      root: "users",
      route: () => "/admin/users",
      review: {
        root: "[id]/review",
        route: (id: string) => `/admin/users/${id}/review`,
      },
    },
    vehicles: {
      root: "vehicles",
      route: () => "/admin/vehicles",
    },
  },
};
