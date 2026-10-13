/**
 * Utility functions to resolve the publicly accessible URL for event QR codes and guest links.
 */

declare const __LOCAL_NETWORK_IP__: string | undefined;

export function getPublicBaseUrl(): string {
  // 1. Check if user configured a custom domain or URL override
  try {
    const customUrl = localStorage.getItem('wm_custom_public_url');
    if (customUrl && customUrl.trim()) {
      return customUrl.trim().replace(/\/+$/, '');
    }
  } catch {
    // Ignore storage errors
  }

  // 2. Check window.location in current browser
  if (typeof window !== 'undefined' && window.location) {
    // If the browser is accessing via localhost or 127.0.0.1, but we have a LAN IP,
    // use the LAN IP so that mobile devices scanning the QR code can reach the server over Wi-Fi.
    if (
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
      typeof __LOCAL_NETWORK_IP__ !== 'undefined' &&
      __LOCAL_NETWORK_IP__
    ) {
      const port = window.location.port ? `:${window.location.port}` : '';
      return `${window.location.protocol}//${__LOCAL_NETWORK_IP__}${port}`;
    }

    // Return the actual live origin where the server is currently running
    return window.location.origin;
  }

  return '';
}

export function getEventShareableUrl(
  event: { id: string; brideName?: string; groomName?: string; date?: string; location?: string },
  useHash = true
): string {
  const base = getPublicBaseUrl();
  const params = new URLSearchParams();
  if (event.brideName) params.set('b', event.brideName);
  if (event.groomName) params.set('g', event.groomName);
  if (event.date) params.set('d', event.date);
  if (event.location) params.set('l', event.location);

  const queryStr = params.toString() ? `?${params.toString()}` : '';

  if (useHash) {
    return `${base}/#/event/${event.id}${queryStr}`;
  }
  return `${base}/event/${event.id}${queryStr}`;
}

export function saveCustomBaseUrl(url: string | null): void {
  try {
    if (!url || !url.trim()) {
      localStorage.removeItem('wm_custom_public_url');
    } else {
      localStorage.setItem('wm_custom_public_url', url.trim().replace(/\/+$/, ''));
    }
  } catch (err) {
    console.error('Failed to save custom base URL:', err);
  }
}
