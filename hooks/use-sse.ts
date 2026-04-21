import { useEffect, useRef, useState, useCallback } from "react";

interface UseEventSourceOptions {
  eventName?: string;          // specific SSE event to listen for, defaults to 'message'
  withCredentials?: boolean;   // if credentials are sent
  parseJson?: boolean;         // parse event.data as JSON by default true
  onError?: (error: any) => void;
  onOpen?: () => void;
  onClose?: () => void;
  retryDelayMax?: number;      // max retry delay in ms
  retryDelayInitial?: number;  // initial retry delay in ms
}

/**
 * useEventSource - reusable hook for SSE streaming
 * @param url The SSE endpoint URL
 * @param options Optional configs for event name, retry, etc.
 * @returns { data, error, connected } state
 */
export function useEventSource<T = any>(
  url: string,
  options: UseEventSourceOptions = {}
) {
  const {
    eventName = "message",
    withCredentials = true,
    parseJson = true,
    onError,
    onOpen,
    onClose,
    retryDelayMax = 30000,
    retryDelayInitial = 1000,
  } = options;

  const [connected, setConnected] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);

  const retryRef = useRef(0);
  const esRef = useRef<EventSource | null>(null);
  const closedRef = useRef(false);

  const connect = useCallback(() => {
    if (closedRef.current) return;

    try {
      const es = new EventSource(url, { withCredentials });
      esRef.current = es;

      es.onopen = () => {
        retryRef.current = 0;
        setConnected(true);
        setError(null);
        if (onOpen) onOpen();
      };

      es.addEventListener(eventName, (e: MessageEvent) => {
        if (!e.data) return;
        try {
          const parsed = parseJson ? JSON.parse(e.data) : (e.data as unknown as T);
          setData(parsed);
        } catch (err) {
          console.error("useEventSource JSON parse error:", err, e.data);
          setError(err);
          if (onError) onError(err);
        }
      });

      es.onerror = (err) => {
        console.error("useEventSource error", err);
        setError(err);
        setConnected(false);
        es.close();

        if (onError) onError(err);

        // Exponential backoff reconnect
        const delay = Math.min(retryDelayMax, retryDelayInitial * 2 ** retryRef.current++);
        setTimeout(() => {
          if (!closedRef.current) connect();
        }, delay);
      };
    } catch (err) {
      setError(err);
      setConnected(false);
      if (onError) onError(err);
    }
  }, [url, withCredentials, eventName, parseJson, onError, onOpen, retryDelayInitial, retryDelayMax]);

  useEffect(() => {
    closedRef.current = false;
    connect();

    return () => {
      closedRef.current = true;
      esRef.current?.close();
      setConnected(false);
      if (onClose) onClose();
    };
  }, [connect, onClose]);

  return { data, error, connected };
}
