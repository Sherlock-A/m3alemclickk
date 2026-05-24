import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

type PushState = 'unsupported' | 'denied' | 'subscribed' | 'unsubscribed' | 'loading';

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw     = window.atob(base64);
  const arr     = new Uint8Array([...raw].map((c) => c.charCodeAt(0)));
  return arr.buffer as ArrayBuffer;
}

export function usePushNotifications(token: string | null) {
  const [state, setState] = useState<PushState>('loading');

  useEffect(() => {
    if (!('PushManager' in window) || !('serviceWorker' in navigator)) {
      setState('unsupported');
      return;
    }
    if (Notification.permission === 'denied') {
      setState('denied');
      return;
    }
    navigator.serviceWorker.ready.then(async (reg) => {
      const sub = await reg.pushManager.getSubscription();
      setState(sub ? 'subscribed' : 'unsubscribed');
    }).catch(() => setState('unsubscribed'));
  }, []);

  const subscribe = useCallback(async () => {
    if (!token) return;
    setState('loading');
    try {
      const { data } = await axios.get<{ publicKey: string }>('/api/push/vapid-public-key');
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly:      true,
        applicationServerKey: urlBase64ToUint8Array(data.publicKey),
      });
      const json = sub.toJSON() as {
        endpoint: string;
        keys: { p256dh: string; auth: string };
        expirationTime?: number | null;
      };
      await axios.post('/api/push/subscribe', {
        endpoint:         json.endpoint,
        keys:             json.keys,
        content_encoding: 'aesgcm',
      }, { headers: { Authorization: `Bearer ${token}` } });

      setState('subscribed');
    } catch {
      setState(Notification.permission === 'denied' ? 'denied' : 'unsubscribed');
    }
  }, [token]);

  const unsubscribe = useCallback(async () => {
    if (!token) return;
    setState('loading');
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await axios.post('/api/push/unsubscribe',
          { endpoint: sub.endpoint },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await sub.unsubscribe();
      }
      setState('unsubscribed');
    } catch {
      setState('unsubscribed');
    }
  }, [token]);

  return { state, subscribe, unsubscribe };
}
