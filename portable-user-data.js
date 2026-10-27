'use strict';

const fsDefault = require('node:fs');
const pathDefault = require('node:path');

const SKIP_NAMES = new Set([
  'Cache', 'Code Cache', 'GPUCache', 'DawnCache', 'GrShaderCache', 'ShaderCache',
  'Crashpad', 'blob_storage', 'SingletonLock', 'SingletonCookie', 'SingletonSocket',
  'lockfile', 'LOCK'
]);

function probeWritable(dir, fs = fsDefault, pid = process.pid) {
  fs.mkdirSync(dir, { recursive: true });
  const testFile = (pathDefault.join(dir, `.nova-portable-write-test-${pid}-${Date.now()}`));
  let fd;
  try {
    fd = fs.openSync(testFile, 'wx');
    fs.writeSync(fd, 'ok');
    fs.closeSync(fd);
    fd = undefined;
    fs.unlinkSync(testFile);
    return true;
  } catch (error) {
    if (fd !== undefined) { try { fs.closeSync(fd); } catch {} }
    try { fs.unlinkSync(testFile); } catch {}
    throw error;
  }
}

function folderHasEntries(dir, fs = fsDefault) {
  try { return fs.readdirSync(dir).length > 0; }
  catch (error) { if (error && error.code === 'ENOENT') return false; throw error; }
}

function copyProfileTree(source, destination, fs = fsDefault, path = pathDefault) {
  if (!source || !fs.existsSync(source) || path.resolve(source) === path.resolve(destination)) return false;
  const srcRoot = path.resolve(source);
  const dstRoot = path.resolve(destination);
  const destinationRelative = path.relative(srcRoot, dstRoot);
  const destinationInsideSource = !!destinationRelative &&
    !destinationRelative.startsWith('..' + path.sep) && destinationRelative !== '..' &&
    !path.isAbsolute(destinationRelative);
  const options = {
    recursive: true,
    force: false,
    errorOnExist: false,
    filter: entry => {
      if (SKIP_NAMES.has(path.basename(entry))) return false;
      // Avoid attempting to copy a profile directory into its own descendant.
      const rel = path.relative(path.resolve(entry), dstRoot);
      const entryIsDestinationOrAncestor = rel === '' || (!!rel && rel !== '..' &&
        !rel.startsWith('..' + path.sep) && !path.isAbsolute(rel));
      return !(destinationInsideSource && entryIsDestinationOrAncestor);
    }
  };
  if (destinationInsideSource) {
    for (const name of fs.readdirSync(srcRoot)) {
      if (SKIP_NAMES.has(name)) continue;
      const srcEntry = path.join(srcRoot, name);
      const rel = path.relative(path.resolve(srcEntry), dstRoot);
      const entryContainsDestination = rel === '' || (!!rel && rel !== '..' &&
        !rel.startsWith('..' + path.sep) && !path.isAbsolute(rel));
      if (entryContainsDestination) continue;
      fs.cpSync(srcEntry, path.join(dstRoot, name), options);
    }
  } else {
    fs.cpSync(srcRoot, dstRoot, options);
  }
  return true;
}

function clearDirectoryContents(dir, fs = fsDefault, path = pathDefault) {
  try {
    for (const entry of fs.readdirSync(dir)) fs.rmSync(path.join(dir, entry), { recursive: true, force: true });
  } catch {}
}

/**
 * Configure storage before any BrowserWindow or persistent session is created.
 * In portable builds data lives next to the launcher in `User Data`; if the
 * directory cannot be written, Nova keeps using Electron's normal userData.
 * Portable and Setup profiles are independent by default. Importing the installed
 * profile is opt-in via NOVA_IMPORT_EXISTING_PROFILE=1. Chromium cache/lock files
 * are deliberately not copied.
 */
function configurePortableUserData(app, env = process.env, deps = {}) {
  const fs = deps.fs || fsDefault;
  const path = deps.path || pathDefault;
  const logger = deps.logger || console;
  const defaultUserData = app.getPath('userData');
  let defaultSessionData = defaultUserData;
  try { defaultSessionData = app.getPath('sessionData'); } catch {}
  const isPortable = !!env.PORTABLE_EXECUTABLE_FILE;
  const fallback = {
    isPortable,
    active: false,
    path: defaultUserData,
    fallbackPath: defaultUserData,
    requestedPath: '',
    migrated: false,
    reason: isPortable ? 'No se pudo configurar el perfil portable.' : ''
  };
  if (!isPortable) return fallback;

  const executableDir = env.PORTABLE_EXECUTABLE_DIR || path.dirname(env.PORTABLE_EXECUTABLE_FILE);
  if (!executableDir) return { ...fallback, reason: 'No se pudo determinar la carpeta del ejecutable.' };
  const target = path.join(executableDir, 'User Data');
  fallback.requestedPath = target;
  const wasEmpty = (() => { try { return !folderHasEntries(target, fs); } catch { return false; } })();
  try {
    probeWritable(target, fs);
    let migrated = false;
    if (wasEmpty && env.NOVA_IMPORT_EXISTING_PROFILE === '1') {
      try {
        migrated = copyProfileTree(defaultUserData, target, fs, path) || migrated;
        if (defaultSessionData && path.resolve(defaultSessionData) !== path.resolve(defaultUserData)) {
          migrated = copyProfileTree(defaultSessionData, target, fs, path) || migrated;
        }
      } catch (error) {
        // Never boot a partially migrated profile: empty it and safely use the
        // original profile. The next portable launch can retry migration.
        clearDirectoryContents(target, fs, path);
        throw new Error(`No se pudo importar el perfil existente: ${error.message}`);
      }
    }
    app.setPath('userData', target);
    try { app.setPath('sessionData', target); }
    catch (error) {
      try { app.setPath('userData', defaultUserData); } catch {}
      try { app.setPath('sessionData', defaultSessionData); } catch {}
      throw error;
    }
    logger.info?.(`[Nova] Perfil portable ${target}${migrated ? ' (datos anteriores migrados)' : ''}`);
    return {
      isPortable: true, active: true, path: target, fallbackPath: defaultUserData,
      requestedPath: target, migrated, reason: ''
    };
  } catch (error) {
    try { app.setPath('userData', defaultUserData); } catch {}
    try { app.setPath('sessionData', defaultSessionData); } catch {}
    logger.warn?.(`[Nova] No se pudo usar el perfil portable; se mantiene el perfil de Windows: ${error.message}`);
    return { ...fallback, reason: error.message || 'La carpeta portable no permite escribir.' };
  }
}

module.exports = { configurePortableUserData, probeWritable, copyProfileTree };
