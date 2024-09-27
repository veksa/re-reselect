import type {createSelector} from '@veksa/reselect';
import type {ICacheObject} from './cache/cache.interface';

export type $Values<T> = T[keyof T];

export type Selector<S, R> = (state: S) => R;
export type ParametricSelector<S, P, R> = (
  state: S,
  props: P,
  ...args: any[]
) => R;

export type KeySelector<S> = (state: S, ...args: any[]) => any;
export type ParametricKeySelector<S, P> = (
  state: S,
  props: P,
  ...args: any[]
) => any;

export type OutputSelector<S, R, C, D> = Selector<S, R> & {
  resultFunc: C;
  dependencies: D;
  recomputations: () => number;
  resetRecomputations: () => number;
};
export type OutputParametricSelector<S, P, R, C, D> = ParametricSelector<
  S,
  P,
  R
> & {
  resultFunc: C;
  dependencies: D;
  recomputations: () => number;
  resetRecomputations: () => number;
};

export type CreateSelectorInstance = Omit<typeof createSelector, 'clearCache'>;

type Options<S, C, D> = {
  selectorCreator?: CreateSelectorInstance;
  cacheObject?: ICacheObject;
  keySelector?: KeySelector<S>;
  keySelectorCreator?: KeySelectorCreator<S, C, D>;
};

type ParametricOptions<S, P, C, D> = {
  selectorCreator?: CreateSelectorInstance;
  cacheObject?: ICacheObject;
  keySelector?: ParametricKeySelector<S, P>;
  keySelectorCreator?: ParametricKeySelectorCreator<S, P, C, D>;
};

export type OutputCachedSelector<S, R, C, D> = (
  options: KeySelector<S> | Options<S, C, D>,
) => OutputSelector<S, R, C, D> & {
  getMatchingSelector: (state: S, ...args: any[]) => OutputSelector<S, R, C, D>;
  removeMatchingSelector: (state: S, ...args: any[]) => void;
  clearCache: () => void;
  cache: ICacheObject;
  keySelector: KeySelector<S>;
};

export type OutputParametricCachedSelector<S, P, R, C, D> = (
  options: ParametricKeySelector<S, P> | ParametricOptions<S, P, C, D>,
) => OutputParametricSelector<S, P, R, C, D> & {
  getMatchingSelector: (
    state: S,
    props: P,
    ...args: any[]
  ) => OutputParametricSelector<S, P, R, C, D>;
  removeMatchingSelector: (state: S, props: P, ...args: any[]) => void;
  clearCache: () => void;
  cache: ICacheObject;
  keySelector: ParametricKeySelector<S, P>;
};

/*
 * Key selector creators
 */
export type KeySelectorCreator<S, C, D> = (selectorInputs: {
  inputSelectors: D;
  resultFunc: C;
  keySelector: KeySelector<S>;
}) => KeySelector<S>;

export type ParametricKeySelectorCreator<S, P, C, D> = (selectorInputs: {
  inputSelectors: D;
  resultFunc: C;
  keySelector: ParametricKeySelector<S, P>;
}) => ParametricKeySelector<S, P>;
