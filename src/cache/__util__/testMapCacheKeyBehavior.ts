import type {ICacheObject} from '../cache.interface';
import {fillCacheWith} from './fillCacheWith';

export function testMapCacheKeyBehavior(makeCacheObject: () => ICacheObject) {
  describe('cacheKey', () => {
    describe('isValidCacheKey method', () => {
      it('doesn\'t not exist', () => {
        const cache = makeCacheObject();
        expect(cache.isValidCacheKey).toBe(undefined);
      });
    });

    it('any kind of value works as cache key', () => {
      const cache = makeCacheObject();
      const entries = new Set([1, {}, 3, [], null]);

      fillCacheWith(cache, entries);

      entries.forEach((entry) => {
        expect(cache.get(entry)).toBe(entry);
      });
    });
  });
}
