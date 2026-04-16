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
  complete: {
    client: {
      root: "/complete/client",
      route: () => "/complete/client",
    },
    shipper: {
      root: "/complete/shipper",
      route: () => "/complete/shipper",
    },
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
    },
  },
};
