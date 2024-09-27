import type {ICacheObject} from './cache.interface';

export class FlatMapCache implements ICacheObject {
  private _cache: Map<string, Function>;

  constructor() {
    this._cache = new Map();
  }

  set(key: string, selectorFn: Function) {
    this._cache.set(key, selectorFn);
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
