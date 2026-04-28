export const paths = {
  home: {
    root: "/",
    route: () => "/",
  },
  profile: {
    root: "/profile",
    route: () => "/profile",
    onboarding: {
      root: "/profile/onboarding",
      route: () => "/profile/onboarding",
    },
    banned: {
      root: "/profile/banned",
      route: () => "/profile/banned",
    },
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
    shipments: {
      root: "shipments",
      route: () => "/client/shipments",
      orders: {
        root: "orders",
        route: () => "/client/shipments/orders",
        new: {
          root: "new",
          route: () => "/client/shipments/orders/new",
        },
      },
      old: {
        root: "older",
        route: () => "/client/shipments/older",
      },
    },
  },

  shipper: {
    root: "/shipper",
    route: () => "/shipper",
    shipments: {
      root: "shipments",
      route: () => "/shipper/shipments",
      orders: {
        root: "orders",
        route: () => "/shipper/shipments/orders",
        booking: {
          root: "booking",
          route: () => "/shipper/shipments/orders/booking",
        },
      },
      offers: {
        root: "offers",
        route: () => "/shipper/shipments/offers",
        ongoing: {
          root: "ongoing",
          route: () => "/shipper/shipments/offers/ongoing",
        },
        past: {
          root: "past",
          route: () => "/shipper/shipments/offers/past",
        },
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

    shipments: {
      root: "shipments",
      route: () => "/admin/shipments",
      orders: {
        root: "orders",
        route: () => "/admin/shipments/orders",
      },
      categories: {
        root: "categories",
        route: () => "/admin/shipments/categories",
      },
    },
  },
};
