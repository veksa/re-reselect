import {isStringOrNumber} from './util/isStringOrNumber';
import type {ICacheObject} from './cache.interface';
import {validateCacheSize} from './util/validateCacheSize';

interface ILruObjectCacheParams {
  cacheSize: number;
}

export class LruObjectCache implements ICacheObject {
  private _cache: Record<string, Function>;
  private _cacheOrdering: string[];
  private _cacheSize: number;

  constructor(params: ILruObjectCacheParams) {
    const {cacheSize} = params;

    validateCacheSize(cacheSize);

    this._cache = {};
    this._cacheOrdering = [];
    this._cacheSize = cacheSize;
  }

  set(key: string, selectorFn: Function) {
    this._cache[key] = selectorFn;
    this._registerCacheHit(key);

    if (this._cacheOrdering.length > this._cacheSize) {
      const earliest = this._cacheOrdering[0];
      this.remove(earliest);
    }
  }

  get(key: string) {
    this._registerCacheHit(key);
    return this._cache[key];
  }

  remove(key: string) {
    this._deleteCacheHit(key);
    delete this._cache[key];
  }

  clear() {
    this._cache = {};
    this._cacheOrdering = [];
  }

  _registerCacheHit(key: string) {
    this._deleteCacheHit(key);
    this._cacheOrdering.push(key);
  }

  _deleteCacheHit(key: string) {
    const index = this._cacheOrdering.indexOf(key);
    if (index > -1) {
      this._cacheOrdering.splice(index, 1);
    }
  }

  isValidCacheKey(cacheKey: string) {
    return isStringOrNumber(cacheKey);
  }
}
