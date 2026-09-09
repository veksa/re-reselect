import type {
  Combiner,
  CreateSelectorFunction,
  CreateSelectorOptions,
  GetParamsFromSelectors,
  GetStateFromSelectors,
  OutputSelector,
  Selector,
  SelectorArray,
} from 'reselect';

import type { ICacheObject } from './cache/types';
import type { HasMixedAnyState, IsAny } from './typeUtils';

/**
 * A function which takes the same arguments as the selector and returns a cacheKey.
 * The cacheKey is used to look up the matching reselect selector in the cache.
 */
export type KeySelector<S> = (state: S, ...args: any[]) => any;

/**
 * keySelector type with parameters inferred from the parent selector's input
 * selectors. Used to give precise types to the user-supplied keySelector
 * callback at call sites.
 */
export type TypedKeySelector<InputSelectors extends SelectorArray> = (
  state: GetStateFromSelectors<InputSelectors>,
  ...params: GetParamsFromSelectors<InputSelectors>
) => unknown;

/**
 * The gate a supplied `keySelector` has to pass — deliberately open at the
 * tail, unlike {@link TypedKeySelector}.
 *
 * A keySelector may declare params the input selectors know nothing about:
 * that is how re-reselect expresses a cache dimension whose only job is to
 * pick a cacheKey, as in `(state, props) => props.itemId` over input selectors
 * that read `state` alone. A closed tuple rejects it ("Target signature
 * provides too few arguments").
 *
 * The `any` tail is only ever a *constraint*. Nothing here reaches the
 * finished selector's types: those come from `Parameters<KeySelectorFn>` of
 * the concrete keySelector that was passed (see {@link CachedSelectorParams}),
 * so the extra params stay exactly as the caller declared them. Leading params
 * are still checked — a keySelector contradicting one an input selector
 * declares is rejected.
 *
 * The tail does mean an *unannotated* extra param is contextually `any`, since
 * there is nothing to infer it from. That is not flagged the way a mixed-`any`
 * input selector list is (see {@link HasMixedAnyState}): the loose
 * {@link KeySelector} shape is a documented escape hatch, so an `any` here can
 * be deliberate. Annotate the param to get it checked.
 *
 * Not exported from the package root: callers never name it.
 */
type KeySelectorConstraint<InputSelectors extends SelectorArray> = (
  state: GetStateFromSelectors<InputSelectors>,
  ...params: [...GetParamsFromSelectors<InputSelectors>, ...any[]]
) => unknown;

/**
 * A `keySelector` that declares exactly the input selectors' params, i.e. adds
 * no cache dimension of its own. Used as the default when the concrete
 * keySelector type is unknown (a `keySelectorCreator`, or a hand-written
 * `OutputCachedSelector<Inputs, Result>`), so merging it back in is a no-op.
 */
export type DefaultKeySelector<InputSelectors extends SelectorArray> = Selector<
  GetStateFromSelectors<InputSelectors>,
  unknown,
  GetParamsFromSelectors<InputSelectors>
>;

/**
 * The arguments the finished selector accepts: the input selectors' params
 * merged with any extra params the `keySelector` declares.
 *
 * Appending the keySelector to the selector array and reusing reselect's own
 * `GetParamsFromSelectors` keeps one merge implementation instead of a
 * hand-rolled one — reselect takes the longest params tuple and intersects it
 * element-wise, which is exactly the desired semantics: the caller has to
 * satisfy the input selectors *and* the keySelector, since both receive the
 * same arguments at runtime.
 */
export type CachedSelectorParams<
  InputSelectors extends SelectorArray,
  KeySelectorFn,
> = KeySelectorFn extends (...args: any[]) => any
  ? GetParamsFromSelectors<[...InputSelectors, KeySelectorFn]>
  : GetParamsFromSelectors<InputSelectors>;

/**
 * A function which receives the selector's inputSelectors/resultFunc/keySelector
 * and returns the keySelector to be used at runtime.
 */
export type KeySelectorCreator<
  InputSelectors extends SelectorArray,
  Result,
> = (selectorInputs: {
  inputSelectors: InputSelectors;
  resultFunc: Combiner<InputSelectors, Result>;
  keySelector?: TypedKeySelector<InputSelectors>;
}) => TypedKeySelector<InputSelectors>;

export type CreateCachedSelectorOptions<
  InputSelectors extends SelectorArray,
  Result,
  KeySelectorFn = DefaultKeySelector<InputSelectors>,
> = {
  keySelector?: KeySelectorFn;
  cacheObject?: ICacheObject;
  selectorCreator?: CreateSelectorFunction<any, any, any>;
  keySelectorCreator?: KeySelectorCreator<InputSelectors, Result>;
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
 * `.keySelector` is exposed using the loose `KeySelector<State>` shape rather
 * than the precise `TypedKeySelector<InputSelectors>` for back-compat with
 * consumers that test the type against `KeySelector<State>`.
 */
export type OutputCachedSelector<
  InputSelectors extends SelectorArray,
  Result,
  KeySelectorFn = DefaultKeySelector<InputSelectors>,
> = Selector<
  GetStateFromSelectors<InputSelectors>,
  Result,
  CachedSelectorParams<InputSelectors, KeySelectorFn>
> &
  // Re-use reselect's own field types, but `Pick` only the ones re-reselect
  // actually attaches at runtime. The call signature is supplied by the
  // `Selector<…>` base above, since it can't be `Pick`ed off `OutputSelector`.
  Pick<
    OutputSelector<InputSelectors, Result>,
    'resultFunc' | 'dependencies' | 'recomputations' | 'resetRecomputations'
  > & {
    // These take the *selector's* arguments, not the input selectors' — they
    // run the keySelector to find the cache entry, so an extra dimension
    // declared only by the keySelector has to be passed here too.
    getMatchingSelector: (
      state: GetStateFromSelectors<InputSelectors>,
      ...params: CachedSelectorParams<InputSelectors, KeySelectorFn>
    ) => OutputSelector<InputSelectors, Result>;
    removeMatchingSelector: (
      state: GetStateFromSelectors<InputSelectors>,
      ...params: CachedSelectorParams<InputSelectors, KeySelectorFn>
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
  KeySelectorFn = DefaultKeySelector<InputSelectors>,
> =
  | KeySelectorFn
  | CreateCachedSelectorOptions<InputSelectors, Result, KeySelectorFn>;

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
 * Generic over the supplied `keySelector` so a cache dimension declared only
 * there — re-reselect's signature pattern — flows into the finished selector's
 * own call signature (see {@link CachedSelectorParams}).
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
    : {
        <KeySelectorFn extends KeySelectorConstraint<InputSelectors>>(
          keySelector: KeySelectorFn,
        ): OutputCachedSelector<InputSelectors, Result, KeySelectorFn>;

        <KeySelectorFn extends KeySelectorConstraint<InputSelectors>>(
          options: CreateCachedSelectorOptions<
            InputSelectors,
            Result,
            KeySelectorFn
          >,
        ): OutputCachedSelector<InputSelectors, Result, KeySelectorFn>;
      };

/**
 * Input selectors spread as individual arguments.
 *
 * Only available while `StateType` is still `any`. Once `withTypes<State>()`
 * has pinned it, reselect's tuple inference cannot both apply the contextual
 * state and infer the input tuple out of a variadic rest, and the combiner
 * arguments collapse to `never` — the call type-checks and produces a useless
 * selector. Dropping these signatures turns that into "No overload matches
 * this call" and points at the array form, which does work.
 */
interface VariadicCachedSelectorSignatures<StateType> {
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
}

/** Input selectors passed as a single array argument. Always available. */
interface ArrayCachedSelectorSignatures<StateType> {
  <InputSelectors extends SelectorArray<StateType>, Result>(
    inputSelectors: [...InputSelectors],
    combiner: Combiner<InputSelectors, Result>,
    createSelectorOptions?: CreateSelectorOptions,
  ): CachedSelectorFactory<InputSelectors, Result>;
}

/**
 * Just the callable signatures of `createCachedSelector`, without `withTypes`.
 * Split out so the runtime implementation can be typed against it directly
 * (TypeScript's `Omit` strips call signatures, so this can't be derived from
 * `CreateCachedSelector` after the fact).
 *
 * Tuple inference replaces the old per-arity overload duplication, mirroring
 * reselect's `CreateSelectorFunction` pattern.
 *
 * `StateType` is the state type shared by all input selectors. It defaults to
 * `any` and is narrowed via `withTypes` to pre-type the selector creator.
 */
export type CreateCachedSelectorImpl<StateType = any> =
  (IsAny<StateType> extends true
    ? VariadicCachedSelectorSignatures<StateType>
    : unknown) &
    ArrayCachedSelectorSignatures<StateType>;

/**
 * The full `createCachedSelector` surface: callable signatures plus the
 * `withTypes` helper for pre-typing the state.
 */
export type CreateCachedSelector<StateType = any> =
  CreateCachedSelectorImpl<StateType> & {
    /**
     * Creates a "pre-typed" version of `createCachedSelector` where the `state`
     * type is predefined.
     *
     * This lets you set the `state` type once, removing the need to specify it
     * on every input selector across all `createCachedSelector` calls.
     *
     * Pre-typed creators accept the array form of input selectors only.
     *
     * @returns A pre-typed `createCachedSelector` with the state type baked in.
     */
    withTypes: <
      OverrideStateType extends StateType,
    >() => CreateCachedSelector<OverrideStateType>;
  };
