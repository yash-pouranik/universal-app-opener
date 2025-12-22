import { DeepLinkHandler } from '../types';

/**
 * Extract YouTube video ID from various URL formats
 * Supports:
 * - Standard: youtube.com/watch?v=VIDEO_ID
 * - Shortened: youtu.be/VIDEO_ID
 * - Shorts: youtube.com/shorts/VIDEO_ID
 * - Embed: youtube.com/embed/VIDEO_ID
 * - Mobile: m.youtube.com/watch?v=VIDEO_ID
 * - Live: youtube.com/live/VIDEO_ID
 */
function extractYouTubeVideoId(url: string): string | null {
  // Standard watch URL (with query params)
  const watchMatch = url.match(
    /(?:youtube\.com|m\.youtube\.com)\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})(?:&|$)/,
  );
  if (watchMatch) return watchMatch[1];

  // Shortened URL (youtu.be)
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})(?:[?&#]|$)/);
  if (shortMatch) return shortMatch[1];

  // Shorts URL
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})(?:[?&#]|$)/);
  if (shortsMatch) return shortsMatch[1];

  // Embed URL
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})(?:[?&#]|$)/);
  if (embedMatch) return embedMatch[1];

  // Live URL
  const liveMatch = url.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})(?:[?&#]|$)/);
  if (liveMatch) return liveMatch[1];

  return null;
}

/**
 * Extract timestamp from YouTube URL (e.g., ?t=123 or &t=123s)
 */
function extractTimestamp(url: string): string | null {
  // Match t= parameter (supports both seconds: t=123 and formatted: t=1m23s)
  const tMatch = url.match(/[?&]t=([0-9]+[smh]?|[0-9hms]+)/);
  if (tMatch) return tMatch[1];

  // Match start= parameter (alternative timestamp format)
  const startMatch = url.match(/[?&]start=([0-9]+)/);
  if (startMatch) return startMatch[1];

  return null;
}

export const youtubeHandler: DeepLinkHandler = {
  match: (url) => {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) return null;

    // Return a synthetic match array with the video ID
    return [url, videoId] as RegExpMatchArray;
  },

  build: (webUrl, match) => {
    const videoId = match[1];
    const timestamp = extractTimestamp(webUrl);

    // Build deep link with optional timestamp
    let iosDeepLink = `vnd.youtube://watch?v=${videoId}`;
    let androidDeepLink = `intent://watch?v=${videoId}`;

    if (timestamp) {
      // Convert timestamp to seconds if needed (e.g., "1m23s" -> 83)
      const timestampParam = timestamp.match(/^\d+$/) ? `&t=${timestamp}s` : `&t=${timestamp}`;
      iosDeepLink += timestampParam;
      androidDeepLink += timestampParam;
    }

    androidDeepLink += '#Intent;scheme=vnd.youtube;package=com.google.android.youtube;end';

    return {
      webUrl,
      ios: iosDeepLink,
      android: androidDeepLink,
      platform: 'youtube',
    };
  },
};
