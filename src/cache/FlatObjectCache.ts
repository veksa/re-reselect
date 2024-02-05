import {isStringOrNumber} from './util/isStringOrNumber';
import {ICacheObject} from './cache.interface';

export class FlatObjectCache implements ICacheObject {
  private _cache: Record<string, Function>;

  constructor() {
    this._cache = {};
  }

  set(key: string, selectorFn: Function) {
    this._cache[key] = selectorFn;
  }

  get(key: string) {
    return this._cache[key];
  }

  remove(key: string) {
    delete this._cache[key];
  }

  clear() {
    this._cache = {};
  }

  isValidCacheKey(cacheKey: string) {
    return isStringOrNumber(cacheKey);
  }
}
