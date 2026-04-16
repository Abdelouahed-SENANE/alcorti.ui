// import { toast } from "@/components/ui/toast/use-toast";
import Axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
// import { useTokenStore } from "../store/token-store";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "./paths";

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const lang =
    typeof window !== "undefined" ? localStorage.getItem("lang") || "fr" : "fr";
  if (config.headers) {
    config.headers.Accept = "application/json";
    config.headers["Accept-Language"] = lang;

    config.withCredentials = true;
  }
  return config;
}

export const api$: AxiosInstance = Axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

api$.interceptors.request.use(authRequestInterceptor);
const is401 = (e: unknown): e is AxiosError =>
  !!(e as AxiosError)?.response && (e as AxiosError).response!.status === 401;

// let redirecting = false;

// function redirectToLoginPreservingPath() {
//   if (window.location.pathname.startsWith("/login")) return;
//   if (redirecting) return;
//   redirecting = true;

//   const from = window.location.pathname + window.location.search;
//   window.location.replace(paths.login.route(from));
// }
// let isRedirecting = false;

api$.interceptors.response.use(
  (res) => res,
  (err) => {
    const pathname = window.location.pathname;
    if (err.code === "ERR_NETWORK") {
      toast({
        title: "Server Offline",
        description: "Cannot reach API server.",
        type: "error",
      });
      return Promise.reject(err);
    }

    if (is401(err)) {
      // 2. Define public routes where we should NOT redirect to login
      const publicRoutes = [
        paths.home.root,
        paths.auth.login.root,
        paths.auth.register.root,
      ];

      const isPublicPage = publicRoutes.includes(pathname);

      // 3. Only redirect and show toast if NOT on a public page
      if (!isPublicPage) {
        window.location.replace(paths.auth.login.route(pathname));
      }

      return Promise.reject(err);
    }

    return Promise.reject(err);
  },
);

// api.interceptors.response.use(
//   (response) => {
//     return response.data;
//   },
//   (error) => {
//     const message = error.response?.data?.message || error.message;
//     // useNotifications.getState().addNotification({
//     //   type: 'error',
//     //   title: 'Error',
//     //   message,
//     // });

//     if (error.response?.status === 401) {
//       const searchParams = new URLSearchParams();
//     //   const redirectTo =
//     //     searchParams.get('redirectTo') || window.location.pathname;
//       window.location.href = paths.auth['sign-in'].getLink();
//     }

//     return Promise.reject(error);
//   },
// );
