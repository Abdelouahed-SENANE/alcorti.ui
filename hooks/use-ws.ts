// import { useEffect, useRef, useState } from 'react';
// import SockJS from 'sockjs-client';
// import { Client, IMessage, StompHeaders } from '@stomp/stompjs';

// type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

// interface UseWebSocketProps {
//   topics: string[];
//   onMessage: (message: IMessage) => void;
//   headers?: StompHeaders;
// }

// export const useWebSocket = ({
//   topics,
//   onMessage,
//   headers = {},
// }: UseWebSocketProps) => {
//   const clientRef = useRef<Client | null>(null);
//   const reconnectAttemptsRef = useRef(0);
//   const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const [status, setStatus] = useState<ConnectionStatus>('connecting');
//   const WS_URL = import.meta.env.VITE_WS_URL
//   const getReconnectDelay = (attempt: number) =>
//     Math.min(1000 * Math.pow(2, attempt), 30000);

//   const connect = () => {
//     setStatus('connecting');

//     const socket = new SockJS(WS_URL);
//     const client = new Client({
//       webSocketFactory: () => socket,
//       connectHeaders: headers,
//       reconnectDelay: 0,
//       onConnect: () => {
//         setStatus('connected');
//         reconnectAttemptsRef.current = 0;

//         topics.forEach((topic) => {
//           client.subscribe(topic, onMessage);
//         });
//       },
//       onStompError: (frame) => {
//         console.error('STOMP Error:', frame);
//         setStatus('error');
//         scheduleReconnect();
//       },
//       onWebSocketClose: () => {
//         setStatus('disconnected');
//         scheduleReconnect();
//       },
//       onWebSocketError: (event) => {
//         console.error('WebSocket Error:', event);
//         setStatus('error');
//         scheduleReconnect();
//       },
//     });

//     client.activate();
//     clientRef.current = client;
//   };

//   const scheduleReconnect = () => {
//     if (reconnectTimeoutRef.current) return;

//     reconnectAttemptsRef.current += 1;
//     const delay = getReconnectDelay(reconnectAttemptsRef.current);

//     reconnectTimeoutRef.current = setTimeout(() => {
//       reconnectTimeoutRef.current = null;
//       connect();
//     }, delay);
//   };

//   const disconnect = () => {
//     reconnectTimeoutRef.current && clearTimeout(reconnectTimeoutRef.current);
//     reconnectTimeoutRef.current = null;

//     clientRef.current?.deactivate();
//     clientRef.current = null;
//     setStatus('disconnected');
//   };

//   useEffect(() => {
//     connect();
//     return () => {
//       disconnect();
//     };
//   }, [...topics]);

//   return {
//     status,
//     disconnect,
//   };
// };
