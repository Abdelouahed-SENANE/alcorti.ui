import { api$ } from "@/config/axios";
import { ApiResponse } from "@/types/api";
import { 
  NotificationListResponse, 
  NotificationCheckResponse 
} from "../notification.type";
import { 
  useMutation, 
  useQuery, 
  useQueryClient,
  InfiniteData,
  useInfiniteQuery,
  UseQueryOptions
} from "@tanstack/react-query";

// ============================================
// Query Keys
// ============================================
export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
  check: () => [...notificationKeys.all, "check"] as const,
  infinite: () => [...notificationKeys.all, "infinite"] as const,
};

// ============================================
// API Functions
// ============================================

/**
 * Lightweight check - returns only unread count.
 * Used for frequent polling.
 */
export const checkNotifications = async (): Promise<ApiResponse<NotificationCheckResponse>> => {
  const res = await api$.get<ApiResponse<NotificationCheckResponse>>(
    "/notifications/check"
  );
  return res.data;
};

/**
 * Full list - returns paginated notifications.
 * Used when user opens the bell dropdown or notifications page.
 */
export const getNotifications = async (
  cursor?: string,
  limit: number = 15
): Promise<ApiResponse<NotificationListResponse>> => {
  const params = new URLSearchParams();
  params.append("limit", limit.toString());
  if (cursor) params.append("cursor", cursor);

  const res = await api$.get<ApiResponse<NotificationListResponse>>(
    `/notifications?${params.toString()}`
  );
  return res.data;
};

/**
 * Mark a single notification as read.
 */
export const markAsRead = async (id: string): Promise<ApiResponse<void>> => {
  const res = await api$.patch<ApiResponse<void>>(`/notifications/${id}/read`);
  return res.data;
};

/**
 * Mark all notifications as read.
 */
export const markAllAsRead = async (): Promise<ApiResponse<void>> => {
  const res = await api$.patch<ApiResponse<void>>("/notifications/read-all");
  return res.data;
};

// ============================================
// Hooks
// ============================================

/**
 * Polling hook - lightweight check for unread count.
 * Use this in your layout/header where the bell badge lives.
 */
export const useNotificationCheck = () => {
  return useQuery({
    queryKey: notificationKeys.check(),
    queryFn: checkNotifications,
    refetchInterval: 10000,           // poll every 10 seconds
    refetchIntervalInBackground: false, // pause when tab is hidden ⚡
    refetchOnWindowFocus: true,       // refetch when user returns to tab
    staleTime: 5000,                  // consider data fresh for 5s
  });
};

/**
 * Full notifications list - use when user opens dropdown or page.
 * Only fetches when component mounts (not constantly polling).
 */
export const useNotifications = (
  limit: number = 15,
  options?: Partial<UseQueryOptions<ApiResponse<NotificationListResponse>>>
) => {
  return useQuery<ApiResponse<NotificationListResponse>>({
    queryKey: [...notificationKeys.list(), limit],
    queryFn: () => getNotifications(undefined, limit),
    staleTime: 30000, // consider fresh for 30s
    ...options,
  });
};

/**
 * Infinite scroll for notifications page.
 * Use this on a dedicated /notifications page.
 */
export const useInfiniteNotifications = (limit: number = 15) => {
  return useInfiniteQuery({
    queryKey: notificationKeys.infinite(),
    queryFn: ({ pageParam }) => getNotifications(pageParam, limit),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => 
      lastPage.data?.has_more ? lastPage.data?.next_cursor : undefined,
    staleTime: 30000,
  });
};

/**
 * Mark single notification as read with optimistic update.
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    
    // Optimistic update - update UI immediately
    onMutate: async (notificationId) => {
      // Cancel any in-flight queries to avoid race conditions
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      // Snapshot previous values
      const previousCheck = queryClient.getQueryData<ApiResponse<NotificationCheckResponse>>(
        notificationKeys.check()
      );

      if (previousCheck) {
        queryClient.setQueryData<ApiResponse<NotificationCheckResponse>>(
          notificationKeys.check(),
          {
            ...previousCheck,
            data: {
              ...previousCheck?.data,
              unread_count: Math.max(0, previousCheck?.data?.unread_count! - 1 ),
            },
          }
        );
      }

      return { previousCheck };
    },

    // Roll back on error
    onError: (err, variables, context) => {
      if (context?.previousCheck) {
        queryClient.setQueryData(notificationKeys.check(), context.previousCheck);
      }
    },

    // Always refetch to sync with server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

/**
 * Mark all as read with optimistic update.
 */
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      const previousCheck = queryClient.getQueryData<ApiResponse<NotificationCheckResponse>>(
        notificationKeys.check()
      );

      // Optimistically zero out the count
      if (previousCheck) {
        queryClient.setQueryData<ApiResponse<NotificationCheckResponse>>(
          notificationKeys.check(),
          {
            ...previousCheck,
            data: {
              ...previousCheck?.data,
              unread_count: 0,
            },
          }
        );
      }

      return { previousCheck };
    },

    onError: (err, variables, context) => {
      if (context?.previousCheck) {
        queryClient.setQueryData(notificationKeys.check(), context.previousCheck);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};