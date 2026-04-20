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
  client: {
    root: "/client",
    route: () => "/client",
    orders: {
      root: "/client/orders",
      route: () => "/client/orders",
      histories: {
        root: "/client/orders/histories",
        route: () => "/client/orders/histories",
      },
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
    locations: {
      root: "locations",
      route: () => "/admin/locations",
    },
  },
};
