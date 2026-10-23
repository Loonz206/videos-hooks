import store from 'store';
import { logger } from './logger';

const SESSION_CACHE = 'SESSION_CACHE';
const twoWeeks = 1000 * 60 * 60 * 24 * 14;

interface SessionCacheItem {
  id: string;
  expiry: number;
  value: unknown;
}

interface SessionCache {
  data: Record<string, SessionCacheItem>;
  nextCleanup: number;
}

const currentTime = () => {
  return Date.now();
};

const getSessionCache = () => {
  let sessionCache: SessionCache = {
    data: {},
    nextCleanup: new Date().getTime() + twoWeeks,
  };

  try {
    const data = store.get(SESSION_CACHE) as string | undefined;

    if (data) {
      sessionCache = JSON.parse(data);
    }
  } catch (error) {
    logger.error({
      event: 'cache.session.read_failed',
      message: 'Failed to read session cache',
      error,
    });
  }

  return sessionCache;
};

const setDataToCache = (id: string, value: unknown) => {
  const sessionCache = getSessionCache();
  const data = sessionCache.data;

  const item: SessionCacheItem = {
    id,
    expiry: new Date().getTime() + twoWeeks,
    value,
  };

  data[id] = item;

  try {
    store.set(SESSION_CACHE, JSON.stringify(sessionCache));
  } catch (error) {
    logger.error({
      event: 'cache.session.write_failed',
      message: 'Failed to set session cache',
      error,
    });
    cleanUpStorage(data);
  }
};

const cleanUpStorage = (data: Record<string, SessionCacheItem>) => {
  let isDeleted;
  let oldest: number | undefined;
  let oldestKey: string | undefined;

  // if 14 days have been passed, it removes the cache
  for (const key in data) {
    logger.debug({
      event: 'cache.session.cleanup_scan',
      context: { key },
    });
    const expiry = data[key].expiry;
    if (expiry && expiry <= currentTime()) {
      delete data[key];
      isDeleted = true;
    }

    // finding the oldest cache in case none of them are expired
    if (!oldest || oldest > expiry) {
      oldest = expiry;
      oldestKey = key;
    }
  }

  // remove the oldest cache if there is no more space in local storage (5 MB)
  if (!isDeleted && oldestKey) {
    delete data[oldestKey];
  }

  store.set(
    SESSION_CACHE,
    JSON.stringify({
      data,
      nextCleanup: currentTime() + twoWeeks,
    }),
  );
};

export { setDataToCache, getSessionCache, cleanUpStorage };
