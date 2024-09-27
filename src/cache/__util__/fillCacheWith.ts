import type {ICacheObject} from '../cache.interface';

export function fillCacheWith(
  cache: ICacheObject,
  entries: unknown[] | Set<unknown> = [],
) {
  entries.forEach((entry) => cache.set(entry, entry));
  return cache;
}
