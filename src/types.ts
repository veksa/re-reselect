import type {
  Combiner,
  CreateSelectorFunction,
  CreateSelectorOptions,
  ExtractMemoizerFields,
  GetParamsFromSelectors,
  GetStateFromSelectors,
  OutputSelectorFields,
  Selector,
  SelectorArray,
  weakMapMemoize,
} from '@veksa/reselect';

import type { ICacheObject } from './cache/types';

/**
 * A function which takes the same arguments as the selector and returns a cacheKey.
 * The cacheKey is used to look up the matching reselect selector in the cache.
 */
export type KeySelector<S> = (state: S, ...args: any[]) => any;

/**
 * keySelector type with parameters inferred from the parent selector's input selectors.
 * Used to give precise types to the user-supplied keySelector callback at call sites.
 *
 * `KeyParams` defaults to the input selectors' parameters, so an inline callback
 * that annotates nothing still gets them contextually. A keySelector that
 * declares its own arguments overrides that default: choosing the cache
 * instance is its job, and what it keys on need not be anything an input
 * selector reads.
 */
export type TypedKeySelector<
  InputSelectors extends SelectorArray,
  KeyParams extends readonly any[] = GetParamsFromSelectors<InputSelectors>,
> = (
  state: GetStateFromSelectors<InputSelectors>,
  ...params: KeyParams
) => unknown;

/**
 * Two argument lists, intersected position by position, keeping whichever runs
 * longer — the same rule reselect applies across input selectors.
 *
 * Either side can be something other than a tuple: `GetParamsFromSelectors`
 * yields `never` for an empty input list and `any[]` for an unbounded one, and
 * neither may leak into the merged result, or the selector ends up with
 * arguments nothing can satisfy.
 */
type MergeArgs<Left extends readonly any[], Right extends readonly any[]> = [
  Left,
] extends [never]
  ? Right
  : [Right] extends [never]
    ? Left
    : Left extends readonly [infer LeftHead, ...infer LeftTail]
      ? Right extends readonly [infer RightHead, ...infer RightTail]
        ? [LeftHead & RightHead, ...MergeArgs<LeftTail, RightTail>]
        : Left
      : Right;

/**
 * The arguments a cached selector accepts: the ones its input selectors declare
 * plus the ones its keySelector declares.
 */
export type CachedSelectorParams<
  InputSelectors extends SelectorArray,
  KeyParams extends readonly any[],
> = MergeArgs<GetParamsFromSelectors<InputSelectors>, KeyParams>;

/**
 * A function which receives the selector's inputSelectors/resultFunc/keySelector
 * and returns the keySelector to be used at runtime.
 */
export type KeySelectorCreator<
  InputSelectors extends SelectorArray,
  Result,
  KeyParams extends readonly any[] = GetParamsFromSelectors<InputSelectors>,
> = (selectorInputs: {
  inputSelectors: InputSelectors;
  resultFunc: Combiner<InputSelectors, Result>;
  keySelector?: TypedKeySelector<InputSelectors, KeyParams>;
}) => TypedKeySelector<InputSelectors, KeyParams>;

export type CreateCachedSelectorOptions<
  InputSelectors extends SelectorArray,
  Result,
  KeyParams extends readonly any[] = GetParamsFromSelectors<InputSelectors>,
> = {
  keySelector?: TypedKeySelector<InputSelectors, KeyParams>;
  cacheObject?: ICacheObject;
  selectorCreator?: CreateSelectorFunction<any, any, any>;
  keySelectorCreator?: KeySelectorCreator<InputSelectors, Result, KeyParams>;
};

/**
 * The selector instance returned by `createCachedSelector(...)(...)`.
 * Extends reselect's OutputSelector with cache-management methods.
 *
 * Rebuilt from reselect's parts rather than reusing `OutputSelector` whole,
 * because the call signature has to carry {@link CachedSelectorParams} while
 * the fields still describe the input selectors alone — `resultFunc` takes the
 * inputs' results, and the keySelector contributes none.
 *
 * `.keySelector` is exposed using the loose `KeySelector<State>` shape rather
 * than the precise `TypedKeySelector<InputSelectors>` for back-compat with
 * consumers that test the type against `KeySelector<State>`.
 */
export type OutputCachedSelector<
  InputSelectors extends SelectorArray,
  Result,
  KeyParams extends readonly any[] = GetParamsFromSelectors<InputSelectors>,
> = Selector<
  GetStateFromSelectors<InputSelectors>,
  Result,
  CachedSelectorParams<InputSelectors, KeyParams>
> &
  ExtractMemoizerFields<typeof weakMapMemoize> &
  OutputSelectorFields<InputSelectors, Result> & {
    getMatchingSelector: (
      state: GetStateFromSelectors<InputSelectors>,
      ...params: CachedSelectorParams<InputSelectors, KeyParams>
    ) => Selector<
      GetStateFromSelectors<InputSelectors>,
      Result,
      CachedSelectorParams<InputSelectors, KeyParams>
    >;
    removeMatchingSelector: (
      state: GetStateFromSelectors<InputSelectors>,
      ...params: CachedSelectorParams<InputSelectors, KeyParams>
    ) => void;
    clearCache: () => void;
    cache: ICacheObject;
    keySelector: KeySelector<GetStateFromSelectors<InputSelectors>>;
  };

/**
 * The curried second-call argument: a `keySelector` function or an options object.
 */
export type PolymorphicCachedOptions<
  InputSelectors extends SelectorArray,
  Result,
  KeyParams extends readonly any[] = GetParamsFromSelectors<InputSelectors>,
> =
  | TypedKeySelector<InputSelectors, KeyParams>
  | CreateCachedSelectorOptions<InputSelectors, Result, KeyParams>;

/**
 * Just the callable signatures of `createCachedSelector`, without `withTypes`.
 * Split out so the runtime implementation can be typed against it directly
 * (TypeScript's `Omit` strips call signatures, so this can't be derived from
 * `CreateCachedSelector` after the fact).
 *
 * Three overloads (variadic, variadic+options, array+options) using tuple
 * inference instead of per-arity overload duplication, mirroring reselect's
 * `CreateSelectorFunction` pattern.
 *
 * `StateType` is the state type shared by all input selectors. It defaults to
 * `any` and is narrowed via `withTypes` to pre-type the selector creator.
 *
 * The curried call is generic in `KeyParams` so a keySelector that declares its
 * own arguments widens the resulting selector instead of being rejected.
 */
export interface CreateCachedSelectorImpl<StateType = any> {
  <InputSelectors extends SelectorArray<StateType>, Result>(
    ...createSelectorArgs: [
      ...inputSelectors: InputSelectors,
      combiner: Combiner<InputSelectors, Result>,
    ]
  ): <
    KeyParams extends readonly any[] = GetParamsFromSelectors<InputSelectors>,
  >(
    polymorphicOptions: PolymorphicCachedOptions<
      InputSelectors,
      Result,
      KeyParams
    >,
  ) => OutputCachedSelector<InputSelectors, Result, KeyParams>;

  <InputSelectors extends SelectorArray<StateType>, Result>(
    ...createSelectorArgs: [
      ...inputSelectors: InputSelectors,
      combiner: Combiner<InputSelectors, Result>,
      createSelectorOptions: CreateSelectorOptions,
    ]
  ): <
    KeyParams extends readonly any[] = GetParamsFromSelectors<InputSelectors>,
  >(
    polymorphicOptions: PolymorphicCachedOptions<
      InputSelectors,
      Result,
      KeyParams
    >,
  ) => OutputCachedSelector<InputSelectors, Result, KeyParams>;

  <InputSelectors extends SelectorArray<StateType>, Result>(
    inputSelectors: [...InputSelectors],
    combiner: Combiner<InputSelectors, Result>,
    createSelectorOptions?: CreateSelectorOptions,
  ): <
    KeyParams extends readonly any[] = GetParamsFromSelectors<InputSelectors>,
  >(
    polymorphicOptions: PolymorphicCachedOptions<
      InputSelectors,
      Result,
      KeyParams
    >,
  ) => OutputCachedSelector<InputSelectors, Result, KeyParams>;
}

/**
 * The full `createCachedSelector` surface: callable signatures plus the
 * `withTypes` helper for pre-typing the state.
 */
export interface CreateCachedSelector<
  StateType = any,
> extends CreateCachedSelectorImpl<StateType> {
  /**
   * Creates a "pre-typed" version of `createCachedSelector` where the `state`
   * type is predefined.
   *
   * This lets you set the `state` type once, removing the need to specify it
   * on every input selector across all `createCachedSelector` calls.
   *
   * @returns A pre-typed `createCachedSelector` with the state type baked in.
   */
  withTypes: <
    OverrideStateType extends StateType,
  >() => CreateCachedSelector<OverrideStateType>;
}
