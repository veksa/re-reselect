import {createStructuredSelector, SelectorsObject} from '@veksa/reselect';
import {createCachedSelector} from './createCachedSelector';
import {
  $Values,
  OutputCachedSelector,
  OutputParametricCachedSelector,
  ParametricSelector,
  Selector,
} from './selector.interface';

// @ts-ignore
export function createStructuredCachedSelector<
  T extends {
    [key: string]: (state: any) => any;
  },
  S = $Values<{[K in keyof T]: Parameters<T[K]>[0]}>,
  R = {[K in keyof T]: ReturnType<T[K]>},
>(
  selectors: T
): OutputCachedSelector<
  S,
  R,
  (...args: $Values<R>[]) => R,
  Selector<S, $Values<R>>[]
>;

export function createStructuredCachedSelector<
  T extends {
    [key: string]: (state: any, props: any, ...args: any[]) => any;
  },
  S = $Values<{[K in keyof T]: Parameters<T[K]>[0]}>,
  P = Exclude<$Values<{[K in keyof T]: Parameters<T[K]>[1]}>, undefined>,
  R = {[K in keyof T]: ReturnType<T[K]>},
>(
  selectors: T
): OutputParametricCachedSelector<
  S,
  P,
  R,
  (...args: $Values<R>[]) => R,
  ParametricSelector<S, P, $Values<R>>[]
>;

export function createStructuredCachedSelector(selectors: SelectorsObject) {
  // @ts-ignore
  return createStructuredSelector(selectors, createCachedSelector);
}
