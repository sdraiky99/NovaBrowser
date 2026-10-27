'use strict';

const LABELS = Object.freeze({ cam: 'cámara', mic: 'micrófono', geo: 'ubicación', notif: 'notificaciones' });

function normalizeHttpOrigin(raw) {
  try {
    const url = new URL(String(raw || ''));
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return '';
    return url.origin.toLowerCase();
  } catch { return ''; }
}

function isHttpOrigin(raw) {
  const value = String(raw || '');
  return !!value && normalizeHttpOrigin(value) === value.toLowerCase();
}

function permissionKeysForRequest(permission, details = {}) {
  if (permission === 'media') {
    const types = new Set(Array.isArray(details.mediaTypes) ? details.mediaTypes : []);
    const keys = [];
    if (types.has('video')) keys.push('cam');
    if (types.has('audio')) keys.push('mic');
    return keys;
  }
  if (permission === 'geolocation') return ['geo'];
  if (permission === 'notifications') return ['notif'];
  return [];
}

function permissionDecision(keys, host, sitePermissions = {}, globalPermissions = {}) {
  if (!Array.isArray(keys) || !keys.length || !host) return 'block';
  const resolved = keys.map(key => sitePermissions?.[host]?.[key] || globalPermissions?.[key] || 'ask');
  if (resolved.includes('block')) return 'block';
  if (resolved.every(value => value === 'allow')) return 'allow';
  return 'ask';
}

function permissionRequestLabel(keys) {
  const labels = [...new Set((keys || []).map(key => LABELS[key]).filter(Boolean))];
  if (!labels.length) return 'un permiso';
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} y ${labels[1]}`;
  return `${labels.slice(0, -1).join(', ')} y ${labels[labels.length - 1]}`;
}

module.exports = { normalizeHttpOrigin, isHttpOrigin, permissionKeysForRequest, permissionDecision, permissionRequestLabel };
