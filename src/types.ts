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
 * The input selectors' params, with reselect's `never` for an empty input list
 * normalised to an empty tuple. Spreading `never` into a tuple collapses the
 * whole tuple to `never`, which would drag the keySelector's own params down
 * with it — a selector built from no input selectors at all would end up with
 * arguments nothing can satisfy.
 */
type InputParams<InputSelectors extends SelectorArray> = [
  GetParamsFromSelectors<InputSelectors>,
] extends [never]
  ? []
  : GetParamsFromSelectors<InputSelectors>;


/**
 * The params a supplied `keySelector` is allowed to declare: the ones the
 * input selectors declare, then anything further.
 *
 * A keySelector may take params the input selectors know nothing about — that
 * is how re-reselect expresses a cache dimension whose only job is to pick a
 * cacheKey, as in `(state, props) => props.itemId` over input selectors that
 * read `state` alone. {@link TypedKeySelector}'s closed tuple rejects that
 * ("Target signature provides too few arguments"), so the factory constrains
 * the keySelector's inferred *params tuple* against this instead.
 *
 * Constraining the tuple rather than the function type is what keeps the tail
 * `unknown` instead of `any`: tuple assignability is covariant, so `unknown`
 * accepts a declared `Props` here, while a `...unknown[]` tail in a *function*
 * position would be checked contravariantly and reject it. Consequences:
 *
 * - an extra param the caller annotates keeps exactly that type,
 * - an extra param the caller leaves unannotated is `unknown`, so its uses are
 *   checked instead of silently passing as `any`,
 * - a param contradicting one an input selector declares is still rejected.
 */
type KeySelectorParamsConstraint<InputSelectors extends SelectorArray> = [
  ...InputParams<InputSelectors>,
  ...unknown[],
];

/**
 * The arguments the finished selector accepts: the input selectors' params
 * merged with any extra params the `keySelector` declares.
 *
 * Feeding the keySelector's params back through reselect's own
 * `GetParamsFromSelectors` (as a synthetic trailing selector) keeps one merge
 * implementation instead of a hand-rolled one — reselect takes the longest
 * params tuple and intersects it element-wise, which is exactly the desired
 * semantics: the caller has to satisfy the input selectors *and* the
 * keySelector, since both receive the same arguments at runtime.
 */
export type CachedSelectorParams<
  InputSelectors extends SelectorArray,
  KeySelectorParams extends readonly unknown[],
> = [GetParamsFromSelectors<InputSelectors>] extends [never]
  ? // Nothing to merge against: with no input selectors, the keySelector's own
    // params are the selector's params. Reselect answers `never` for the empty
    // list, and a synthetic selector built on that `never` state would drag
    // them down with it.
    KeySelectorParams
  : GetParamsFromSelectors<
      [
        ...InputSelectors,
        (
          state: GetStateFromSelectors<InputSelectors>,
          ...params: KeySelectorParams
        ) => unknown,
      ]
    >;

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
  KeySelectorParams extends readonly unknown[] =
    InputParams<InputSelectors>,
> = {
  keySelector?: (
    state: GetStateFromSelectors<InputSelectors>,
    ...params: KeySelectorParams
  ) => unknown;
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
  KeySelectorParams extends readonly unknown[] =
    InputParams<InputSelectors>,
> = Selector<
  GetStateFromSelectors<InputSelectors>,
  Result,
  CachedSelectorParams<InputSelectors, KeySelectorParams>
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
      ...params: CachedSelectorParams<InputSelectors, KeySelectorParams>
    ) => OutputSelector<InputSelectors, Result>;
    removeMatchingSelector: (
      state: GetStateFromSelectors<InputSelectors>,
      ...params: CachedSelectorParams<InputSelectors, KeySelectorParams>
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
  KeySelectorParams extends readonly unknown[] =
    InputParams<InputSelectors>,
> =
  | ((
      state: GetStateFromSelectors<InputSelectors>,
      ...params: KeySelectorParams
    ) => unknown)
  | CreateCachedSelectorOptions<InputSelectors, Result, KeySelectorParams>;

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
        // No default on the keySelector form: the constraint then doubles as
        // the contextual type for unannotated params, so a param an input
        // selector declares stays precisely typed and an extra one is
        // `unknown` rather than `any`.
        <KeySelectorParams extends KeySelectorParamsConstraint<InputSelectors>>(
          keySelector: (
            state: GetStateFromSelectors<InputSelectors>,
            ...params: KeySelectorParams
          ) => unknown,
        ): OutputCachedSelector<InputSelectors, Result, KeySelectorParams>;

        // The options form does need a default: `keySelector` is optional
        // there (a `keySelectorCreator` may supply it instead), and with
        // nothing to infer from, falling back to the constraint would leave
        // the selector with an open `...unknown[]` tail. Spelling the default
        // as a variadic tuple lets TypeScript match it against the
        // constraint's variadic prefix while `InputSelectors` is still a type
        // parameter.
        <
          KeySelectorParams extends
            KeySelectorParamsConstraint<InputSelectors> = [
            ...InputParams<InputSelectors>,
          ],
        >(
          options: CreateCachedSelectorOptions<
            InputSelectors,
            Result,
            KeySelectorParams
          >,
        ): OutputCachedSelector<InputSelectors, Result, KeySelectorParams>;
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
