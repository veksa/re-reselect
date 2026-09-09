import type {
  Combiner,
  CreateSelectorFunction,
  CreateSelectorOptions,
  GetParamsFromSelectors,
  GetStateFromSelectors,
  OutputSelector,
  Selector,
  SelectorArray,
} from '@veksa/reselect';

import type { ICacheObject } from './cache/types';
import type { HasMixedAnyState } from './typeUtils';

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
 *
 * This type is reconstructed from a plain reselect `Selector` plus **only** the
 * members re-reselect actually attaches at runtime (see
 * `createCachedSelector.ts`'s `Object.assign`). It intentionally does **not**
 * inherit reselect's full `OutputSelector`: that would advertise members which
 * only exist on the inner, per-cache-key reselect selectors (`memoizedResultFunc`,
 * `lastResult`, `dependencyRecomputations`, `resetDependencyRecomputations`,
 * `memoize`, `argsMemoize`, …) — they are absent on the cached selector at
 * runtime, so surfacing them would type-check and then crash.
 *
 * `getMatchingSelector` returns the full `OutputSelector` because the inner
 * cached selector genuinely is a reselect selector.
 *
 * The call signature carries {@link CachedSelectorParams} while the fields
 * still describe the input selectors alone — `resultFunc` takes the inputs'
 * results, and the keySelector contributes none.
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
  // Re-use reselect's own field types, but `Pick` only the ones re-reselect
  // actually attaches at runtime. The call signature is supplied by the
  // `Selector<…>` base above, since it can't be `Pick`ed off `OutputSelector`.
  Pick<
    OutputSelector<InputSelectors, Result>,
    'resultFunc' | 'dependencies' | 'recomputations' | 'resetRecomputations'
  > & {
    getMatchingSelector: (
      state: GetStateFromSelectors<InputSelectors>,
      ...params: CachedSelectorParams<InputSelectors, KeyParams>
    ) => OutputSelector<InputSelectors, Result>;
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
 * Message surfaced when input selectors mix a concrete `state` with an
 * implicit `any` one. It is the *parameter* type of the returned factory, so
 * the compiler prints the sentence itself at the `(keySelector)` call rather
 * than a bare "not callable".
 */
export type ImplicitAnyStateError =
  '[re-reselect] Some input selectors have an implicitly `any` state while others are typed, so the combiner arguments and the result silently degrade to `any`. Annotate `state` on every input selector, or pre-type them with createCachedSelector.withTypes<State>().';

/**
 * The curried second call of `createCachedSelector(...)`.
 *
 * Degrades to a single-parameter function typed with {@link ImplicitAnyStateError}
 * when {@link HasMixedAnyState} holds, turning what used to be a silent `any`
 * into a compile error that names the fix.
 */
export type CachedSelectorFactory<
  InputSelectors extends SelectorArray,
  Result,
> =
  HasMixedAnyState<InputSelectors> extends true
    ? (error: ImplicitAnyStateError) => never
    : <
        KeyParams extends readonly any[] = GetParamsFromSelectors<InputSelectors>,
      >(
        polymorphicOptions: PolymorphicCachedOptions<
          InputSelectors,
          Result,
          KeyParams
        >,
      ) => OutputCachedSelector<InputSelectors, Result, KeyParams>;

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
  ): CachedSelectorFactory<InputSelectors, Result>;

  <InputSelectors extends SelectorArray<StateType>, Result>(
    ...createSelectorArgs: [
      ...inputSelectors: InputSelectors,
      combiner: Combiner<InputSelectors, Result>,
      createSelectorOptions: CreateSelectorOptions,
    ]
  ): CachedSelectorFactory<InputSelectors, Result>;

  <InputSelectors extends SelectorArray<StateType>, Result>(
    inputSelectors: [...InputSelectors],
    combiner: Combiner<InputSelectors, Result>,
    createSelectorOptions?: CreateSelectorOptions,
  ): CachedSelectorFactory<InputSelectors, Result>;
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
