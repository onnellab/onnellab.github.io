/**
 * An independent fail-closed sentinel, not an HTTP cache implementation.
 * The site disables Astro image processing before this constructor is reached.
 * Never retain, inspect, or include request/response arguments in the error.
 */
export default class DisabledHttpCache {
  constructor() {
    const error = new Error('Astro HTTP image caching is disabled for this static site.');
    error.code = 'ONNELLAB_HTTP_CACHE_DISABLED';
    throw error;
  }
}
