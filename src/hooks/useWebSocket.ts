import { useEffect, useState } from 'react';
import type { AppNotification } from '../types';

export function useWebSocket(onMetric: (amount: number) => void, onNotification: (notification: AppNotification) => void) {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'reconnecting'>('connecting');

  useEffect(() => {
    let reconnectDelay = 1000;
    let reconnectTimer = 0;
    let stopped = false;
    let connected = false;
    const connect = () => {
      if (stopped) return;
      if (!navigator.onLine) {
        connected = false;
        setStatus('reconnecting');
        reconnectTimer = window.setTimeout(connect, reconnectDelay);
        reconnectDelay = Math.min(reconnectDelay * 2, 30000);
        return;
      }
      connected = true;
      setStatus('connected');
      reconnectDelay = 1000;
    };
    const connectedTimer = window.setTimeout(connect, 500);
    const onOffline = () => {
      connected = false;
      setStatus('reconnecting');
      reconnectTimer = window.setTimeout(connect, reconnectDelay);
    };
    const onOnline = () => {
      window.clearTimeout(reconnectTimer);
      connect();
    };
    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
    const updateTimer = window.setInterval(() => {
      if (connected) onMetric(Math.floor(Math.random() * 5) + 1);
    }, 12000);
    const notificationTimer = window.setInterval(() => {
      if (connected) onNotification({
        id: `live-${Date.now()}`,
        title: 'Live metric updated',
        detail: 'Your workspace analytics have refreshed.',
        time: 'Just now',
        read: false
      });
    }, 30000);
    return () => {
      stopped = true;
      window.clearTimeout(connectedTimer);
      window.clearTimeout(reconnectTimer);
      window.clearInterval(updateTimer);
      window.clearInterval(notificationTimer);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
    };
  }, [onMetric, onNotification]);

  return status;
}
