import {isStringOrNumber} from './util/isStringOrNumber';
import {ICacheObject} from './cache.interface';
import {validateCacheSize} from './util/validateCacheSize';

interface IFifoObjectCacheParams {
  cacheSize: number;
}

export class FifoObjectCache implements ICacheObject {
  private _cache: Record<string, Function>;
  private _cacheOrdering: string[];
  private _cacheSize: number;

  constructor(params: IFifoObjectCacheParams) {
    const {cacheSize} = params;

    validateCacheSize(cacheSize);

    this._cache = {};
    this._cacheOrdering = [];
    this._cacheSize = cacheSize;
  }

  set(key: string, selectorFn: Function) {
    this._cache[key] = selectorFn;
    this._cacheOrdering.push(key);

    if (this._cacheOrdering.length > this._cacheSize) {
      const earliest = this._cacheOrdering[0];
      this.remove(earliest);
    }
  }

  get(key: string) {
    return this._cache[key];
  }

  remove(key: string) {
    const index = this._cacheOrdering.indexOf(key);

    if (index > -1) {
      this._cacheOrdering.splice(index, 1);
    }
    delete this._cache[key];
  }

  clear() {
    this._cache = {};
    this._cacheOrdering = [];
  }

  isValidCacheKey(cacheKey: string) {
    return isStringOrNumber(cacheKey);
  }
}
