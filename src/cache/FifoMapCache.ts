import type {ICacheObject} from './cache.interface';
import {validateCacheSize} from './util/validateCacheSize';

interface IFifoMapCacheParams {
  cacheSize: number;
}

export class FifoMapCache implements ICacheObject {
  private _cache: Map<string, Function>;
  private _cacheSize: number;

  constructor(params: IFifoMapCacheParams) {
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
    return this._cache.get(key);
  }

  remove(key: string) {
    this._cache.delete(key);
  }

  clear() {
    this._cache.clear();
  }
}
