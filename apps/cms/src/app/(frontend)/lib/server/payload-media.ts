const DEFAULT_IMAGE = '/images/fitness-hero.jpg';

function getCmsOrigin(): string {
  const origin =
    process.env.PAYLOAD_CMS_URL ||
    process.env.NEXT_PUBLIC_PAYLOAD_CMS_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.SERVER_URL ||
    '';

  return origin.replace(/\/$/, '');
}

export function payloadMediaUrl(media: unknown, fallback = DEFAULT_IMAGE): string {
  if (!media || typeof media !== 'object') return fallback;

  const maybeUrl = (media as { url?: string }).url;
  if (!maybeUrl) return fallback;
  if (maybeUrl.startsWith('http://') || maybeUrl.startsWith('https://')) return maybeUrl;

  const origin = getCmsOrigin();
  return origin ? `${origin}${maybeUrl}` : maybeUrl;
}
