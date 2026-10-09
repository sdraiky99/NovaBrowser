'use strict';

const DEFAULT_SEARCH = 'https://www.google.com/search?q=';
const SEARCH_PROVIDERS = new Set([
  'https://www.google.com/search?q=',
  'https://duckduckgo.com/?q=',
  'https://www.bing.com/search?q=',
  'https://search.brave.com/search?q='
]);
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'file:']);

function parseAllowedUrl(value) {
  try {
    const parsed = new URL(value);
    return ALLOWED_PROTOCOLS.has(parsed.protocol) ? parsed.href : '';
  } catch {
    return '';
  }
}

function resolveNavigation(raw, searchProvider = DEFAULT_SEARCH) {
  const value = String(raw ?? '').trim();
  if (!value) return '';

  // Honor explicit web and local-file URLs, but never execute custom schemes.
  if (/^(?:https?|file):\/\//i.test(value)) {
    const explicit = parseAllowedUrl(value);
    if (explicit) return explicit;
  }

  const localHost = /^(?:localhost|127(?:\.\d{1,3}){3}|\[::1\])(?::\d{1,5})?(?:[/?#].*)?$/i;
  const ipAddress = /^(?:\d{1,3}\.){3}\d{1,3}(?::\d{1,5})?(?:[/?#].*)?$/;
  const domain = /^[a-z\d](?:[a-z\d-]*[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]*[a-z\d])?)+(?:\:\d{1,5})?(?:[/?#].*)?$/i;

  let candidate = '';
  if (localHost.test(value) || ipAddress.test(value)) candidate = `http://${value}`;
  else if (domain.test(value)) candidate = `https://${value}`;
  if (candidate) {
    const resolved = parseAllowedUrl(candidate);
    if (resolved) return resolved;
  }

  const provider = SEARCH_PROVIDERS.has(searchProvider) ? searchProvider : DEFAULT_SEARCH;
  return `${provider}${encodeURIComponent(value)}`;
}

module.exports = { resolveNavigation, DEFAULT_SEARCH, SEARCH_PROVIDERS };
