import type {ICacheObject} from '../cache.interface';
import {fillCacheWith} from './fillCacheWith';

export function testBasicBehavior(makeCacheObject: () => ICacheObject) {
  describe('Cache basic behavior', () => {
    it('returns cached value', () => {
      const cache = makeCacheObject();
      const actual = () => {
      };

      cache.set('foo', actual);
      const expected = cache.get('foo');

      expect(actual).toBe(expected);
    });

    it('removes a single item', () => {
      const cache = makeCacheObject();
      const entries = [1, 2, 3, 4, 5];
      fillCacheWith(cache, entries);

      cache.remove(3);

      expect(cache.get(3)).toBe(undefined);
      [1, 2, 4, 5].forEach((entry) => {
        expect(cache.get(entry)).toBe(entry);
      });
    });

    it('clears the cache', () => {
      const cache = makeCacheObject();
      const entries = [1, 2, 3, 4, 5];
      fillCacheWith(cache, entries);

      cache.clear();

      [1, 2, 3, 4, 5].forEach((entry) => {
        expect(cache.get(entry)).toBe(undefined);
      });
    });
  });
}
