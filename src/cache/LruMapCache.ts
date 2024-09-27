import type {ICacheObject} from './cache.interface';
import {validateCacheSize} from './util/validateCacheSize';

interface ILruMapCacheParams {
  cacheSize: number;
}

export class LruMapCache implements ICacheObject {
  private _cache: Map<string, Function | undefined>;
  private _cacheSize: number;

  constructor(params: ILruMapCacheParams) {
    const {cacheSize} = params;

    validateCacheSize(cacheSize);

    this._cache = new Map();
    this._cacheSize = cacheSize;
  }

  set(key: string, selectorFn: Function) {
    this._cache.set(key, selectorFn);

    if (this._cache.size > this._cacheSize) {
      const earliest = this._cache.keys().next().value;
      if (earliest) {
        this.remove(earliest);
      }
    }
  }

  get(key: string) {
    const value = this._cache.get(key);

    // Register cache hit
    if (this._cache.has(key)) {
      this.remove(key);
      this._cache.set(key, value);
    }

    return value;
  }

  remove(key: string) {
    this._cache.delete(key);
  }

  clear() {
    this._cache.clear();
  }
}
