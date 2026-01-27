/**
 * Media utilities for handling file URLs
 */

/**
 * Get the base API URL from environment
 */
function getApiBaseUrl(): string {
  const apiUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
  // Remove /api/v1 suffix if present to get base URL
  return apiUrl.replace(/\/api\/v\d+$/, '');
}

/**
 * Convert a relative file path to a full URL
 * @param path - Relative path from backend (e.g., "lms-files/avatars/123.jpg") or full URL
 * @returns Full URL (e.g., "http://localhost:3000/lms-files/avatars/123.jpg")
 */
export function getMediaUrl(path: string | undefined | null): string | undefined {
  if (!path) return undefined;
  
  // If already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Build full URL
  const baseUrl = getApiBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Get avatar URL with fallback
 */
export function getAvatarUrl(path: string | undefined | null): string | undefined {
  return getMediaUrl(path);
}

/**
 * Get course cover URL with fallback
 */
export function getCoverUrl(path: string | undefined | null): string | undefined {
  return getMediaUrl(path);
}
