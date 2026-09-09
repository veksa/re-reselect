import type { Selector, SelectorArray, SelectorsObject } from '@veksa/reselect';

/**
 * Distributes a union `A | B | C` into an intersection `A & B & C` by exploiting
 * contravariance of function parameters. Building block for {@link LastOf}.
 */
export type UnionToIntersection<Union> = (
  Union extends unknown ? (distributedUnion: Union) => void : never
) extends (mergedIntersection: infer Intersection) => void
  ? Intersection
  : never;

/**
 * Extracts the "last" member of a union. Order is an implementation detail of
 * the compiler's overload resolution, but it is stable, which is all
 * {@link TuplifyUnion} needs to peel members off one at a time.
 */
export type LastOf<T> =
  UnionToIntersection<T extends any ? () => T : never> extends () => infer R
    ? R
    : never;

/**
 * Converts a union `A | B | C` into a tuple `[A, B, C]` by repeatedly pulling
 * off {@link LastOf} and excluding it until the union is `never`.
 */
export type TuplifyUnion<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false,
> = true extends N ? [] : [...TuplifyUnion<Exclude<T, L>>, L];

/**
 * Type-level `Object.values()`: converts a SelectorsObject
 * `{ foo: Selector, bar: Selector }` into the ordered tuple
 * `[Selector, Selector]` that reselect's `MergeParameters` needs to infer
 * state and params. An unordered `Array<T[keyof T]>` collapses the selectors
 * to a union and loses per-position params (second args resolve to `never`),
 * so a real tuple is required. Mirrors reselect's internal
 * `ObjectValuesToTuple` (not exported from the package).
 */
export type SelectorsObjectToTuple<
  T extends SelectorsObject<any>,
  KS extends any[] = TuplifyUnion<keyof T>,
  R extends Selector[] = [],
> = KS extends [infer K, ...infer KT]
  ? SelectorsObjectToTuple<T, KT, [...R, T[K & keyof T]]>
  : R;

/**
 * `true` only for `any`. Relies on `any` being the one type for which
 * `0 extends 1 & T` holds, since `1 & any` is `any`.
 */
export type IsAny<T> = 0 extends 1 & T ? true : false;

/** The `state` parameter of a single input selector. */
type StateOfSelector<S> = S extends (state: infer State, ...args: any[]) => any
  ? State
  : never;

/** `IsAny<state>` for every input selector, as a `true | false` union. */
type AnyStateFlags<InputSelectors extends SelectorArray> =
  InputSelectors[number] extends infer InputSelector
    ? InputSelector extends unknown
      ? IsAny<StateOfSelector<InputSelector>>
      : never
    : never;

/**
 * `true` when some input selectors declare a concrete `state` and others fall
 * back to `any`.
 *
 * reselect v5 cannot contextually type an inline input selector while it is
 * still inferring the input tuple, so an unannotated `(state) => state.foo`
 * sitting next to an annotated one silently resolves to `any` — and that `any`
 * then propagates into the combiner arguments and the selector's result. The
 * old hand-written per-arity overloads typed those selectors correctly, so an
 * upgrade would quietly drop type safety rather than report anything.
 *
 * Flagging the mixed case restores a diagnostic. A uniformly-`any` selector
 * list is left alone: that shape is a deliberate opt-out, not an accident.
 */
export type HasMixedAnyState<InputSelectors extends SelectorArray> =
  true extends AnyStateFlags<InputSelectors>
    ? false extends AnyStateFlags<InputSelectors>
      ? true
      : false
    : false;
