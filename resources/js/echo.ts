import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<'pusher'>;
  }
}

let echo: Echo<'pusher'> | null = null;

export function getEcho(token: string): Echo<'pusher'> | null {
  const key = import.meta.env.VITE_PUSHER_APP_KEY as string | undefined;
  if (!key) return null;

  if (echo) return echo;

  window.Pusher = Pusher;

  echo = new Echo({
    broadcaster: 'pusher',
    key,
    cluster: (import.meta.env.VITE_PUSHER_APP_CLUSTER as string | undefined) ?? 'eu',
    forceTLS: true,
    authEndpoint: '/api/broadcasting/auth',
    auth: { headers: { Authorization: `Bearer ${token}` } },
  });

  return echo;
}

export function destroyEcho(): void {
  echo?.disconnect();
  echo = null;
}
