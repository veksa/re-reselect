import {createSelector, type CreateSelectorOptions} from '@veksa/reselect';
import {FlatObjectCache} from './cache/FlatObjectCache';
import type {
  OutputCachedSelector,
  OutputParametricCachedSelector,
  ParametricSelector,
  Selector,
} from './selector.interface';

const defaultCacheCreator = FlatObjectCache;
const defaultCacheKeyValidator = () => true;

function parseReselectArgs(reselectArgs: Function[]) {
  const args = [...reselectArgs];
  const lastArgument = args[args.length - 1];

  let resultFunc: Function;
  let createSelectorOptions: Function | undefined;

  // Last argument is resultFunc
  if (typeof lastArgument === 'function') {
    resultFunc = args.pop() as Function;
  } else {
    // Last argument is createSelectorOptions object
    createSelectorOptions = args.pop();
    resultFunc = args.pop() as Function;
  }

  const inputSelectors: Function[] = Array.isArray(args[0])
    ? args[0]
    : [...args];

  return {
    inputSelectors,
    resultFunc,
    createSelectorOptions,
  };
}

export function createCachedSelector<S, R1, T>(
  selector: Selector<S, R1>,
  combiner: (res: R1) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<S, T, (res: R1) => T, [Selector<S, R1>]>;

export function createCachedSelector<S, P, R1, T>(
  selector: ParametricSelector<S, P, R1>,
  combiner: (res: R1) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S,
  P,
  T,
  (res: R1) => T,
  [ParametricSelector<S, P, R1>]
>;

export function createCachedSelector<S, R1, R2, T>(
  selector1: Selector<S, R1>,
  selector2: Selector<S, R2>,
  combiner: (res1: R1, res2: R2) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S,
  T,
  (res1: R1, res2: R2) => T,
  [Selector<S, R1>, Selector<S, R2>]
>;
export function createCachedSelector<S, P, R1, R2, T>(
  selector1: ParametricSelector<S, P, R1>,
  selector2: ParametricSelector<S, P, R2>,
  combiner: (res1: R1, res2: R2) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S,
  P,
  T,
  (res1: R1, res2: R2) => T,
  [ParametricSelector<S, P, R1>, ParametricSelector<S, P, R2>]
>;

export function createCachedSelector<S, R1, R2, R3, T>(
  selector1: Selector<S, R1>,
  selector2: Selector<S, R2>,
  selector3: Selector<S, R3>,
  combiner: (res1: R1, res2: R2, res3: R3) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S,
  T,
  (res1: R1, res2: R2, res3: R3) => T,
  [Selector<S, R1>, Selector<S, R2>, Selector<S, R3>]
>;
export function createCachedSelector<S, P, R1, R2, R3, T>(
  selector1: ParametricSelector<S, P, R1>,
  selector2: ParametricSelector<S, P, R2>,
  selector3: ParametricSelector<S, P, R3>,
  combiner: (res1: R1, res2: R2, res3: R3) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S,
  P,
  T,
  (res1: R1, res2: R2, res3: R3) => T,
  [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>
  ]
>;

export function createCachedSelector<S, R1, R2, R3, R4, T>(
  selector1: Selector<S, R1>,
  selector2: Selector<S, R2>,
  selector3: Selector<S, R3>,
  selector4: Selector<S, R4>,
  combiner: (res1: R1, res2: R2, res3: R3, res4: R4) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4) => T,
  [Selector<S, R1>, Selector<S, R2>, Selector<S, R3>, Selector<S, R4>]
>;
export function createCachedSelector<S, P, R1, R2, R3, R4, T>(
  selector1: ParametricSelector<S, P, R1>,
  selector2: ParametricSelector<S, P, R2>,
  selector3: ParametricSelector<S, P, R3>,
  selector4: ParametricSelector<S, P, R4>,
  combiner: (res1: R1, res2: R2, res3: R3, res4: R4) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S,
  P,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4) => T,
  [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>
  ]
>;

export function createCachedSelector<S, R1, R2, R3, R4, R5, T>(
  selector1: Selector<S, R1>,
  selector2: Selector<S, R2>,
  selector3: Selector<S, R3>,
  selector4: Selector<S, R4>,
  selector5: Selector<S, R5>,
  combiner: (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5) => T,
  [
    Selector<S, R1>,
    Selector<S, R2>,
    Selector<S, R3>,
    Selector<S, R4>,
    Selector<S, R5>
  ]
>;
export function createCachedSelector<S, P, R1, R2, R3, R4, R5, T>(
  selector1: ParametricSelector<S, P, R1>,
  selector2: ParametricSelector<S, P, R2>,
  selector3: ParametricSelector<S, P, R3>,
  selector4: ParametricSelector<S, P, R4>,
  selector5: ParametricSelector<S, P, R5>,
  combiner: (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S,
  P,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5) => T,
  [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>,
    ParametricSelector<S, P, R5>
  ]
>;

export function createCachedSelector<S, R1, R2, R3, R4, R5, R6, T>(
  selector1: Selector<S, R1>,
  selector2: Selector<S, R2>,
  selector3: Selector<S, R3>,
  selector4: Selector<S, R4>,
  selector5: Selector<S, R5>,
  selector6: Selector<S, R6>,
  combiner: (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6) => T,
  [
    Selector<S, R1>,
    Selector<S, R2>,
    Selector<S, R3>,
    Selector<S, R4>,
    Selector<S, R5>,
    Selector<S, R6>
  ]
>;
export function createCachedSelector<S, P, R1, R2, R3, R4, R5, R6, T>(
  selector1: ParametricSelector<S, P, R1>,
  selector2: ParametricSelector<S, P, R2>,
  selector3: ParametricSelector<S, P, R3>,
  selector4: ParametricSelector<S, P, R4>,
  selector5: ParametricSelector<S, P, R5>,
  selector6: ParametricSelector<S, P, R6>,
  combiner: (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S,
  P,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6) => T,
  [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>,
    ParametricSelector<S, P, R5>,
    ParametricSelector<S, P, R6>
  ]
>;

export function createCachedSelector<S, R1, R2, R3, R4, R5, R6, R7, T>(
  selector1: Selector<S, R1>,
  selector2: Selector<S, R2>,
  selector3: Selector<S, R3>,
  selector4: Selector<S, R4>,
  selector5: Selector<S, R5>,
  selector6: Selector<S, R6>,
  selector7: Selector<S, R7>,
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6, res7: R7) => T,
  [
    Selector<S, R1>,
    Selector<S, R2>,
    Selector<S, R3>,
    Selector<S, R4>,
    Selector<S, R5>,
    Selector<S, R6>,
    Selector<S, R7>
  ]
>;
export function createCachedSelector<S, P, R1, R2, R3, R4, R5, R6, R7, T>(
  selector1: ParametricSelector<S, P, R1>,
  selector2: ParametricSelector<S, P, R2>,
  selector3: ParametricSelector<S, P, R3>,
  selector4: ParametricSelector<S, P, R4>,
  selector5: ParametricSelector<S, P, R5>,
  selector6: ParametricSelector<S, P, R6>,
  selector7: ParametricSelector<S, P, R7>,
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S,
  P,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6, res7: R7) => T,
  [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>,
    ParametricSelector<S, P, R5>,
    ParametricSelector<S, P, R6>,
    ParametricSelector<S, P, R7>
  ]
>;

export function createCachedSelector<S, R1, R2, R3, R4, R5, R6, R7, R8, T>(
  selector1: Selector<S, R1>,
  selector2: Selector<S, R2>,
  selector3: Selector<S, R3>,
  selector4: Selector<S, R4>,
  selector5: Selector<S, R5>,
  selector6: Selector<S, R6>,
  selector7: Selector<S, R7>,
  selector8: Selector<S, R8>,
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
  ) => T,
  [
    Selector<S, R1>,
    Selector<S, R2>,
    Selector<S, R3>,
    Selector<S, R4>,
    Selector<S, R5>,
    Selector<S, R6>,
    Selector<S, R7>,
    Selector<S, R8>
  ]
>;
export function createCachedSelector<S, P, R1, R2, R3, R4, R5, R6, R7, R8, T>(
  selector1: ParametricSelector<S, P, R1>,
  selector2: ParametricSelector<S, P, R2>,
  selector3: ParametricSelector<S, P, R3>,
  selector4: ParametricSelector<S, P, R4>,
  selector5: ParametricSelector<S, P, R5>,
  selector6: ParametricSelector<S, P, R6>,
  selector7: ParametricSelector<S, P, R7>,
  selector8: ParametricSelector<S, P, R8>,
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S,
  P,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
  ) => T,
  [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>,
    ParametricSelector<S, P, R5>,
    ParametricSelector<S, P, R6>,
    ParametricSelector<S, P, R7>,
    ParametricSelector<S, P, R8>
  ]
>;

export function createCachedSelector<S, R1, R2, R3, R4, R5, R6, R7, R8, R9, T>(
  selector1: Selector<S, R1>,
  selector2: Selector<S, R2>,
  selector3: Selector<S, R3>,
  selector4: Selector<S, R4>,
  selector5: Selector<S, R5>,
  selector6: Selector<S, R6>,
  selector7: Selector<S, R7>,
  selector8: Selector<S, R8>,
  selector9: Selector<S, R9>,
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
  ) => T,
  [
    Selector<S, R1>,
    Selector<S, R2>,
    Selector<S, R3>,
    Selector<S, R4>,
    Selector<S, R5>,
    Selector<S, R6>,
    Selector<S, R7>,
    Selector<S, R8>,
    Selector<S, R9>
  ]
>;
export function createCachedSelector<
  S,
  P,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  T
>(
  selector1: ParametricSelector<S, P, R1>,
  selector2: ParametricSelector<S, P, R2>,
  selector3: ParametricSelector<S, P, R3>,
  selector4: ParametricSelector<S, P, R4>,
  selector5: ParametricSelector<S, P, R5>,
  selector6: ParametricSelector<S, P, R6>,
  selector7: ParametricSelector<S, P, R7>,
  selector8: ParametricSelector<S, P, R8>,
  selector9: ParametricSelector<S, P, R9>,
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S,
  P,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
  ) => T,
  [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>,
    ParametricSelector<S, P, R5>,
    ParametricSelector<S, P, R6>,
    ParametricSelector<S, P, R7>,
    ParametricSelector<S, P, R8>,
    ParametricSelector<S, P, R9>
  ]
>;

export function createCachedSelector<
  S,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  R10,
  T
>(
  selector1: Selector<S, R1>,
  selector2: Selector<S, R2>,
  selector3: Selector<S, R3>,
  selector4: Selector<S, R4>,
  selector5: Selector<S, R5>,
  selector6: Selector<S, R6>,
  selector7: Selector<S, R7>,
  selector8: Selector<S, R8>,
  selector9: Selector<S, R9>,
  selector10: Selector<S, R10>,
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
  ) => T,
  [
    Selector<S, R1>,
    Selector<S, R2>,
    Selector<S, R3>,
    Selector<S, R4>,
    Selector<S, R5>,
    Selector<S, R6>,
    Selector<S, R7>,
    Selector<S, R8>,
    Selector<S, R9>,
    Selector<S, R10>
  ]
>;
export function createCachedSelector<
  S,
  P,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  R10,
  T
>(
  selector1: ParametricSelector<S, P, R1>,
  selector2: ParametricSelector<S, P, R2>,
  selector3: ParametricSelector<S, P, R3>,
  selector4: ParametricSelector<S, P, R4>,
  selector5: ParametricSelector<S, P, R5>,
  selector6: ParametricSelector<S, P, R6>,
  selector7: ParametricSelector<S, P, R7>,
  selector8: ParametricSelector<S, P, R8>,
  selector9: ParametricSelector<S, P, R9>,
  selector10: ParametricSelector<S, P, R10>,
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S,
  P,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
  ) => T,
  [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>,
    ParametricSelector<S, P, R5>,
    ParametricSelector<S, P, R6>,
    ParametricSelector<S, P, R7>,
    ParametricSelector<S, P, R8>,
    ParametricSelector<S, P, R9>,
    ParametricSelector<S, P, R10>
  ]
>;

export function createCachedSelector<
  S,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  R10,
  R11,
  T
>(
  selector1: Selector<S, R1>,
  selector2: Selector<S, R2>,
  selector3: Selector<S, R3>,
  selector4: Selector<S, R4>,
  selector5: Selector<S, R5>,
  selector6: Selector<S, R6>,
  selector7: Selector<S, R7>,
  selector8: Selector<S, R8>,
  selector9: Selector<S, R9>,
  selector10: Selector<S, R10>,
  selector11: Selector<S, R11>,
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
  ) => T,
  [
    Selector<S, R1>,
    Selector<S, R2>,
    Selector<S, R3>,
    Selector<S, R4>,
    Selector<S, R5>,
    Selector<S, R6>,
    Selector<S, R7>,
    Selector<S, R8>,
    Selector<S, R9>,
    Selector<S, R10>,
    Selector<S, R11>
  ]
>;
export function createCachedSelector<
  S,
  P,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  R10,
  R11,
  T
>(
  selector1: ParametricSelector<S, P, R1>,
  selector2: ParametricSelector<S, P, R2>,
  selector3: ParametricSelector<S, P, R3>,
  selector4: ParametricSelector<S, P, R4>,
  selector5: ParametricSelector<S, P, R5>,
  selector6: ParametricSelector<S, P, R6>,
  selector7: ParametricSelector<S, P, R7>,
  selector8: ParametricSelector<S, P, R8>,
  selector9: ParametricSelector<S, P, R9>,
  selector10: ParametricSelector<S, P, R10>,
  selector11: ParametricSelector<S, P, R11>,
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S,
  P,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
  ) => T,
  [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>,
    ParametricSelector<S, P, R5>,
    ParametricSelector<S, P, R6>,
    ParametricSelector<S, P, R7>,
    ParametricSelector<S, P, R8>,
    ParametricSelector<S, P, R9>,
    ParametricSelector<S, P, R10>,
    ParametricSelector<S, P, R11>
  ]
>;

export function createCachedSelector<
  S,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  R10,
  R11,
  R12,
  T
>(
  selector1: Selector<S, R1>,
  selector2: Selector<S, R2>,
  selector3: Selector<S, R3>,
  selector4: Selector<S, R4>,
  selector5: Selector<S, R5>,
  selector6: Selector<S, R6>,
  selector7: Selector<S, R7>,
  selector8: Selector<S, R8>,
  selector9: Selector<S, R9>,
  selector10: Selector<S, R10>,
  selector11: Selector<S, R11>,
  selector12: Selector<S, R12>,
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
    res12: R12,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
    res12: R12,
  ) => T,
  [
    Selector<S, R1>,
    Selector<S, R2>,
    Selector<S, R3>,
    Selector<S, R4>,
    Selector<S, R5>,
    Selector<S, R6>,
    Selector<S, R7>,
    Selector<S, R8>,
    Selector<S, R9>,
    Selector<S, R10>,
    Selector<S, R11>,
    Selector<S, R12>
  ]
>;
export function createCachedSelector<
  S,
  P,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  R10,
  R11,
  R12,
  T
>(
  selector1: ParametricSelector<S, P, R1>,
  selector2: ParametricSelector<S, P, R2>,
  selector3: ParametricSelector<S, P, R3>,
  selector4: ParametricSelector<S, P, R4>,
  selector5: ParametricSelector<S, P, R5>,
  selector6: ParametricSelector<S, P, R6>,
  selector7: ParametricSelector<S, P, R7>,
  selector8: ParametricSelector<S, P, R8>,
  selector9: ParametricSelector<S, P, R9>,
  selector10: ParametricSelector<S, P, R10>,
  selector11: ParametricSelector<S, P, R11>,
  selector12: ParametricSelector<S, P, R12>,
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
    res12: R12,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S,
  P,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
    res12: R12,
  ) => T,
  [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>,
    ParametricSelector<S, P, R5>,
    ParametricSelector<S, P, R6>,
    ParametricSelector<S, P, R7>,
    ParametricSelector<S, P, R8>,
    ParametricSelector<S, P, R9>,
    ParametricSelector<S, P, R10>,
    ParametricSelector<S, P, R11>,
    ParametricSelector<S, P, R12>
  ]
>;

// @ts-ignore
export function createCachedSelector<S, R1, T>(
  selectors: [Selector<S, R1>],
  combiner: (res: R1) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<S, T, (res: R1) => T, [Selector<S, R1>]>;
export function createCachedSelector<S, P, R1, T>(
  selectors: [ParametricSelector<S, P, R1>],
  combiner: (res: R1) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S,
  P,
  T,
  (res: R1) => T,
  [ParametricSelector<S, P, R1>]
>;

export function createCachedSelector<S, R1, R2, T>(
  selectors: [Selector<S, R1>, Selector<S, R2>],
  combiner: (res1: R1, res2: R2) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S,
  T,
  (res1: R1, res2: R2) => T,
  [Selector<S, R1>, Selector<S, R2>]
>;
export function createCachedSelector<S, P, R1, R2, T>(
  selectors: [ParametricSelector<S, P, R1>, ParametricSelector<S, P, R2>],
  combiner: (res1: R1, res2: R2) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S,
  P,
  T,
  (res1: R1, res2: R2) => T,
  [ParametricSelector<S, P, R1>, ParametricSelector<S, P, R2>]
>;

export function createCachedSelector<S, R1, R2, R3, T>(
  selectors: [Selector<S, R1>, Selector<S, R2>, Selector<S, R3>],
  combiner: (res1: R1, res2: R2, res3: R3) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S,
  T,
  (res1: R1, res2: R2, res3: R3) => T,
  [Selector<S, R1>, Selector<S, R2>, Selector<S, R3>]
>;
export function createCachedSelector<S, P, R1, R2, R3, T>(
  selectors: [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>
  ],
  combiner: (res1: R1, res2: R2, res3: R3) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S,
  P,
  T,
  (res1: R1, res2: R2, res3: R3) => T,
  [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>
  ]
>;

export function createCachedSelector<S, R1, R2, R3, R4, T>(
  selectors: [
    Selector<S, R1>,
    Selector<S, R2>,
    Selector<S, R3>,
    Selector<S, R4>
  ],
  combiner: (res1: R1, res2: R2, res3: R3, res4: R4) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4) => T,
  [Selector<S, R1>, Selector<S, R2>, Selector<S, R3>, Selector<S, R4>]
>;
export function createCachedSelector<S, P, R1, R2, R3, R4, T>(
  selectors: [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>
  ],
  combiner: (res1: R1, res2: R2, res3: R3, res4: R4) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S,
  P,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4) => T,
  [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>
  ]
>;

export function createCachedSelector<S, R1, R2, R3, R4, R5, T>(
  selectors: [
    Selector<S, R1>,
    Selector<S, R2>,
    Selector<S, R3>,
    Selector<S, R4>,
    Selector<S, R5>
  ],
  combiner: (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5) => T,
  [
    Selector<S, R1>,
    Selector<S, R2>,
    Selector<S, R3>,
    Selector<S, R4>,
    Selector<S, R5>
  ]
>;
export function createCachedSelector<S, P, R1, R2, R3, R4, R5, T>(
  selectors: [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>,
    ParametricSelector<S, P, R5>
  ],
  combiner: (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S,
  P,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5) => T,
  [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>,
    ParametricSelector<S, P, R5>
  ]
>;

export function createCachedSelector<S, R1, R2, R3, R4, R5, R6, T>(
  selectors: [
    Selector<S, R1>,
    Selector<S, R2>,
    Selector<S, R3>,
    Selector<S, R4>,
    Selector<S, R5>,
    Selector<S, R6>
  ],
  combiner: (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6) => T,
  [
    Selector<S, R1>,
    Selector<S, R2>,
    Selector<S, R3>,
    Selector<S, R4>,
    Selector<S, R5>,
    Selector<S, R6>
  ]
>;
export function createCachedSelector<S, P, R1, R2, R3, R4, R5, R6, T>(
  selectors: [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>,
    ParametricSelector<S, P, R5>,
    ParametricSelector<S, P, R6>
  ],
  combiner: (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S,
  P,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6) => T,
  [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>,
    ParametricSelector<S, P, R5>,
    ParametricSelector<S, P, R6>
  ]
>;

export function createCachedSelector<S, R1, R2, R3, R4, R5, R6, R7, T>(
  selectors: [
    Selector<S, R1>,
    Selector<S, R2>,
    Selector<S, R3>,
    Selector<S, R4>,
    Selector<S, R5>,
    Selector<S, R6>,
    Selector<S, R7>
  ],
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6, res7: R7) => T,
  [
    Selector<S, R1>,
    Selector<S, R2>,
    Selector<S, R3>,
    Selector<S, R4>,
    Selector<S, R5>,
    Selector<S, R6>,
    Selector<S, R7>
  ]
>;
export function createCachedSelector<S, P, R1, R2, R3, R4, R5, R6, R7, T>(
  selectors: [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>,
    ParametricSelector<S, P, R5>,
    ParametricSelector<S, P, R6>,
    ParametricSelector<S, P, R7>
  ],
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S,
  P,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6, res7: R7) => T,
  [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>,
    ParametricSelector<S, P, R5>,
    ParametricSelector<S, P, R6>,
    ParametricSelector<S, P, R7>
  ]
>;

export function createCachedSelector<S, R1, R2, R3, R4, R5, R6, R7, R8, T>(
  selectors: [
    Selector<S, R1>,
    Selector<S, R2>,
    Selector<S, R3>,
    Selector<S, R4>,
    Selector<S, R5>,
    Selector<S, R6>,
    Selector<S, R7>,
    Selector<S, R8>
  ],
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
  ) => T,
  [
    Selector<S, R1>,
    Selector<S, R2>,
    Selector<S, R3>,
    Selector<S, R4>,
    Selector<S, R5>,
    Selector<S, R6>,
    Selector<S, R7>,
    Selector<S, R8>
  ]
>;
export function createCachedSelector<S, P, R1, R2, R3, R4, R5, R6, R7, R8, T>(
  selectors: [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>,
    ParametricSelector<S, P, R5>,
    ParametricSelector<S, P, R6>,
    ParametricSelector<S, P, R7>,
    ParametricSelector<S, P, R8>
  ],
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S,
  P,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
  ) => T,
  [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>,
    ParametricSelector<S, P, R5>,
    ParametricSelector<S, P, R6>,
    ParametricSelector<S, P, R7>,
    ParametricSelector<S, P, R8>
  ]
>;

export function createCachedSelector<S, R1, R2, R3, R4, R5, R6, R7, R8, R9, T>(
  selectors: [
    Selector<S, R1>,
    Selector<S, R2>,
    Selector<S, R3>,
    Selector<S, R4>,
    Selector<S, R5>,
    Selector<S, R6>,
    Selector<S, R7>,
    Selector<S, R8>,
    Selector<S, R9>
  ],
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
  ) => T,
  [
    Selector<S, R1>,
    Selector<S, R2>,
    Selector<S, R3>,
    Selector<S, R4>,
    Selector<S, R5>,
    Selector<S, R6>,
    Selector<S, R7>,
    Selector<S, R8>,
    Selector<S, R9>
  ]
>;
export function createCachedSelector<
  S,
  P,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  T
>(
  selectors: [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>,
    ParametricSelector<S, P, R5>,
    ParametricSelector<S, P, R6>,
    ParametricSelector<S, P, R7>,
    ParametricSelector<S, P, R8>,
    ParametricSelector<S, P, R9>
  ],
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S,
  P,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
  ) => T,
  [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>,
    ParametricSelector<S, P, R5>,
    ParametricSelector<S, P, R6>,
    ParametricSelector<S, P, R7>,
    ParametricSelector<S, P, R8>,
    ParametricSelector<S, P, R9>
  ]
>;

export function createCachedSelector<
  S,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  R10,
  T
>(
  selectors: [
    Selector<S, R1>,
    Selector<S, R2>,
    Selector<S, R3>,
    Selector<S, R4>,
    Selector<S, R5>,
    Selector<S, R6>,
    Selector<S, R7>,
    Selector<S, R8>,
    Selector<S, R9>,
    Selector<S, R10>
  ],
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
  ) => T,
  [
    Selector<S, R1>,
    Selector<S, R2>,
    Selector<S, R3>,
    Selector<S, R4>,
    Selector<S, R5>,
    Selector<S, R6>,
    Selector<S, R7>,
    Selector<S, R8>,
    Selector<S, R9>,
    Selector<S, R10>
  ]
>;
export function createCachedSelector<
  S,
  P,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  R10,
  T
>(
  selectors: [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>,
    ParametricSelector<S, P, R5>,
    ParametricSelector<S, P, R6>,
    ParametricSelector<S, P, R7>,
    ParametricSelector<S, P, R8>,
    ParametricSelector<S, P, R9>,
    ParametricSelector<S, P, R10>
  ],
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S,
  P,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
  ) => T,
  [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>,
    ParametricSelector<S, P, R5>,
    ParametricSelector<S, P, R6>,
    ParametricSelector<S, P, R7>,
    ParametricSelector<S, P, R8>,
    ParametricSelector<S, P, R9>,
    ParametricSelector<S, P, R10>
  ]
>;

export function createCachedSelector<
  S,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  R10,
  R11,
  T
>(
  selectors: [
    Selector<S, R1>,
    Selector<S, R2>,
    Selector<S, R3>,
    Selector<S, R4>,
    Selector<S, R5>,
    Selector<S, R6>,
    Selector<S, R7>,
    Selector<S, R8>,
    Selector<S, R9>,
    Selector<S, R10>,
    Selector<S, R11>
  ],
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
  ) => T,
  [
    Selector<S, R1>,
    Selector<S, R2>,
    Selector<S, R3>,
    Selector<S, R4>,
    Selector<S, R5>,
    Selector<S, R6>,
    Selector<S, R7>,
    Selector<S, R8>,
    Selector<S, R9>,
    Selector<S, R10>,
    Selector<S, R11>
  ]
>;
export function createCachedSelector<
  S,
  P,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  R10,
  R11,
  T
>(
  selectors: [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>,
    ParametricSelector<S, P, R5>,
    ParametricSelector<S, P, R6>,
    ParametricSelector<S, P, R7>,
    ParametricSelector<S, P, R8>,
    ParametricSelector<S, P, R9>,
    ParametricSelector<S, P, R10>,
    ParametricSelector<S, P, R11>
  ],
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S,
  P,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
  ) => T,
  [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>,
    ParametricSelector<S, P, R5>,
    ParametricSelector<S, P, R6>,
    ParametricSelector<S, P, R7>,
    ParametricSelector<S, P, R8>,
    ParametricSelector<S, P, R9>,
    ParametricSelector<S, P, R10>,
    ParametricSelector<S, P, R11>
  ]
>;

export function createCachedSelector<
  S,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  R10,
  R11,
  R12,
  T
>(
  selectors: [
    Selector<S, R1>,
    Selector<S, R2>,
    Selector<S, R3>,
    Selector<S, R4>,
    Selector<S, R5>,
    Selector<S, R6>,
    Selector<S, R7>,
    Selector<S, R8>,
    Selector<S, R9>,
    Selector<S, R10>,
    Selector<S, R11>,
    Selector<S, R12>
  ],
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
    res12: R12,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
    res12: R12,
  ) => T,
  [
    Selector<S, R1>,
    Selector<S, R2>,
    Selector<S, R3>,
    Selector<S, R4>,
    Selector<S, R5>,
    Selector<S, R6>,
    Selector<S, R7>,
    Selector<S, R8>,
    Selector<S, R9>,
    Selector<S, R10>,
    Selector<S, R11>,
    Selector<S, R12>
  ]
>;
export function createCachedSelector<
  S,
  P,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  R10,
  R11,
  R12,
  T
>(
  selectors: [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>,
    ParametricSelector<S, P, R5>,
    ParametricSelector<S, P, R6>,
    ParametricSelector<S, P, R7>,
    ParametricSelector<S, P, R8>,
    ParametricSelector<S, P, R9>,
    ParametricSelector<S, P, R10>,
    ParametricSelector<S, P, R11>,
    ParametricSelector<S, P, R12>
  ],
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
    res12: R12,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S,
  P,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
    res12: R12,
  ) => T,
  [
    ParametricSelector<S, P, R1>,
    ParametricSelector<S, P, R2>,
    ParametricSelector<S, P, R3>,
    ParametricSelector<S, P, R4>,
    ParametricSelector<S, P, R5>,
    ParametricSelector<S, P, R6>,
    ParametricSelector<S, P, R7>,
    ParametricSelector<S, P, R8>,
    ParametricSelector<S, P, R9>,
    ParametricSelector<S, P, R10>,
    ParametricSelector<S, P, R11>,
    ParametricSelector<S, P, R12>
  ]
>;

export function createCachedSelector<S1, R1, T>(
  selector: Selector<S1, R1>,
  combiner: (res: R1) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<S1, T, (res: R1) => T, [Selector<S1, R1>]>;
export function createCachedSelector<S1, P1, R1, T>(
  selector: ParametricSelector<S1, P1, R1>,
  combiner: (res: R1) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S1,
  P1,
  T,
  (res: R1) => T,
  [ParametricSelector<S1, P1, R1>]
>;

export function createCachedSelector<S1, S2, R1, R2, T>(
  selector1: Selector<S1, R1>,
  selector2: Selector<S2, R2>,
  combiner: (res1: R1, res2: R2) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S1 & S2,
  T,
  (res1: R1, res2: R2) => T,
  [Selector<S1, R1>, Selector<S2, R2>]
>;
export function createCachedSelector<S1, S2, P1, P2, R1, R2, T>(
  selector1: ParametricSelector<S1, P1, R1>,
  selector2: ParametricSelector<S2, P2, R2>,
  combiner: (res1: R1, res2: R2) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S1 & S2,
  P1 & P2,
  T,
  (res1: R1, res2: R2) => T,
  [ParametricSelector<S1, P1, R1>, ParametricSelector<S2, P2, R2>]
>;

export function createCachedSelector<S1, S2, S3, R1, R2, R3, T>(
  selector1: Selector<S1, R1>,
  selector2: Selector<S2, R2>,
  selector3: Selector<S3, R3>,
  combiner: (res1: R1, res2: R2, res3: R3) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S1 & S2 & S3,
  T,
  (res1: R1, res2: R2, res3: R3) => T,
  [Selector<S1, R1>, Selector<S2, R2>, Selector<S3, R3>]
>;
export function createCachedSelector<S1, S2, S3, P1, P2, P3, R1, R2, R3, T>(
  selector1: ParametricSelector<S1, P1, R1>,
  selector2: ParametricSelector<S2, P2, R2>,
  selector3: ParametricSelector<S3, P3, R3>,
  combiner: (res1: R1, res2: R2, res3: R3) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S1 & S2 & S3,
  P1 & P2 & P3,
  T,
  (res1: R1, res2: R2, res3: R3) => T,
  [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>
  ]
>;

export function createCachedSelector<S1, S2, S3, S4, R1, R2, R3, R4, T>(
  selector1: Selector<S1, R1>,
  selector2: Selector<S2, R2>,
  selector3: Selector<S3, R3>,
  selector4: Selector<S4, R4>,
  combiner: (res1: R1, res2: R2, res3: R3, res4: R4) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S1 & S2 & S3 & S4,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4) => T,
  [Selector<S1, R1>, Selector<S2, R2>, Selector<S3, R3>, Selector<S4, R4>]
>;
export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  P1,
  P2,
  P3,
  P4,
  R1,
  R2,
  R3,
  R4,
  T
>(
  selector1: ParametricSelector<S1, P1, R1>,
  selector2: ParametricSelector<S2, P2, R2>,
  selector3: ParametricSelector<S3, P3, R3>,
  selector4: ParametricSelector<S4, P4, R4>,
  combiner: (res1: R1, res2: R2, res3: R3, res4: R4) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S1 & S2 & S3 & S4,
  P1 & P2 & P3 & P4,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4) => T,
  [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>
  ]
>;

export function createCachedSelector<S1, S2, S3, S4, S5, R1, R2, R3, R4, R5, T>(
  selector1: Selector<S1, R1>,
  selector2: Selector<S2, R2>,
  selector3: Selector<S3, R3>,
  selector4: Selector<S4, R4>,
  selector5: Selector<S5, R5>,
  combiner: (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S1 & S2 & S3 & S4 & S5,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5) => T,
  [
    Selector<S1, R1>,
    Selector<S2, R2>,
    Selector<S3, R3>,
    Selector<S4, R4>,
    Selector<S5, R5>
  ]
>;
export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  P1,
  P2,
  P3,
  P4,
  P5,
  R1,
  R2,
  R3,
  R4,
  R5,
  T
>(
  selector1: ParametricSelector<S1, P1, R1>,
  selector2: ParametricSelector<S2, P2, R2>,
  selector3: ParametricSelector<S3, P3, R3>,
  selector4: ParametricSelector<S4, P4, R4>,
  selector5: ParametricSelector<S5, P5, R5>,
  combiner: (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S1 & S2 & S3 & S4 & S5,
  P1 & P2 & P3 & P4 & P5,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5) => T,
  [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>,
    ParametricSelector<S5, P5, R5>
  ]
>;

export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  T
>(
  selector1: Selector<S1, R1>,
  selector2: Selector<S2, R2>,
  selector3: Selector<S3, R3>,
  selector4: Selector<S4, R4>,
  selector5: Selector<S5, R5>,
  selector6: Selector<S6, R6>,
  combiner: (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6) => T,
  [
    Selector<S1, R1>,
    Selector<S2, R2>,
    Selector<S3, R3>,
    Selector<S4, R4>,
    Selector<S5, R5>,
    Selector<S6, R6>
  ]
>;
export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  T
>(
  selector1: ParametricSelector<S1, P1, R1>,
  selector2: ParametricSelector<S2, P2, R2>,
  selector3: ParametricSelector<S3, P3, R3>,
  selector4: ParametricSelector<S4, P4, R4>,
  selector5: ParametricSelector<S5, P5, R5>,
  selector6: ParametricSelector<S6, P6, R6>,
  combiner: (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6,
  P1 & P2 & P3 & P4 & P5 & P6,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6) => T,
  [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>,
    ParametricSelector<S5, P5, R5>,
    ParametricSelector<S6, P6, R6>
  ]
>;

export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  T
>(
  selector1: Selector<S1, R1>,
  selector2: Selector<S2, R2>,
  selector3: Selector<S3, R3>,
  selector4: Selector<S4, R4>,
  selector5: Selector<S5, R5>,
  selector6: Selector<S6, R6>,
  selector7: Selector<S7, R7>,
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6 & S7,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6, res7: R7) => T,
  [
    Selector<S1, R1>,
    Selector<S2, R2>,
    Selector<S3, R3>,
    Selector<S4, R4>,
    Selector<S5, R5>,
    Selector<S6, R6>,
    Selector<S7, R7>
  ]
>;
export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  T
>(
  selector1: ParametricSelector<S1, P1, R1>,
  selector2: ParametricSelector<S2, P2, R2>,
  selector3: ParametricSelector<S3, P3, R3>,
  selector4: ParametricSelector<S4, P4, R4>,
  selector5: ParametricSelector<S5, P5, R5>,
  selector6: ParametricSelector<S6, P6, R6>,
  selector7: ParametricSelector<S7, P7, R7>,
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6 & S7,
  P1 & P2 & P3 & P4 & P5 & P6 & P7,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6, res7: R7) => T,
  [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>,
    ParametricSelector<S5, P5, R5>,
    ParametricSelector<S6, P6, R6>,
    ParametricSelector<S7, P7, R7>
  ]
>;

export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  T
>(
  selector1: Selector<S1, R1>,
  selector2: Selector<S2, R2>,
  selector3: Selector<S3, R3>,
  selector4: Selector<S4, R4>,
  selector5: Selector<S5, R5>,
  selector6: Selector<S6, R6>,
  selector7: Selector<S7, R7>,
  selector8: Selector<S8, R8>,
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
  ) => T,
  [
    Selector<S1, R1>,
    Selector<S2, R2>,
    Selector<S3, R3>,
    Selector<S4, R4>,
    Selector<S5, R5>,
    Selector<S6, R6>,
    Selector<S7, R7>,
    Selector<S8, R8>
  ]
>;
export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7,
  P8,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  T
>(
  selector1: ParametricSelector<S1, P1, R1>,
  selector2: ParametricSelector<S2, P2, R2>,
  selector3: ParametricSelector<S3, P3, R3>,
  selector4: ParametricSelector<S4, P4, R4>,
  selector5: ParametricSelector<S5, P5, R5>,
  selector6: ParametricSelector<S6, P6, R6>,
  selector7: ParametricSelector<S7, P7, R7>,
  selector8: ParametricSelector<S8, P8, R8>,
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8,
  P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
  ) => T,
  [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>,
    ParametricSelector<S5, P5, R5>,
    ParametricSelector<S6, P6, R6>,
    ParametricSelector<S7, P7, R7>,
    ParametricSelector<S8, P8, R8>
  ]
>;

export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  T
>(
  selector1: Selector<S1, R1>,
  selector2: Selector<S2, R2>,
  selector3: Selector<S3, R3>,
  selector4: Selector<S4, R4>,
  selector5: Selector<S5, R5>,
  selector6: Selector<S6, R6>,
  selector7: Selector<S7, R7>,
  selector8: Selector<S8, R8>,
  selector9: Selector<S9, R9>,
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
  ) => T,
  [
    Selector<S1, R1>,
    Selector<S2, R2>,
    Selector<S3, R3>,
    Selector<S4, R4>,
    Selector<S5, R5>,
    Selector<S6, R6>,
    Selector<S7, R7>,
    Selector<S8, R8>,
    Selector<S9, R9>
  ]
>;
export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7,
  P8,
  P9,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  T
>(
  selector1: ParametricSelector<S1, P1, R1>,
  selector2: ParametricSelector<S2, P2, R2>,
  selector3: ParametricSelector<S3, P3, R3>,
  selector4: ParametricSelector<S4, P4, R4>,
  selector5: ParametricSelector<S5, P5, R5>,
  selector6: ParametricSelector<S6, P6, R6>,
  selector7: ParametricSelector<S7, P7, R7>,
  selector8: ParametricSelector<S8, P8, R8>,
  selector9: ParametricSelector<S9, P9, R9>,
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9,
  P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8 & P9,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
  ) => T,
  [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>,
    ParametricSelector<S5, P5, R5>,
    ParametricSelector<S6, P6, R6>,
    ParametricSelector<S7, P7, R7>,
    ParametricSelector<S8, P8, R8>,
    ParametricSelector<S9, P9, R9>
  ]
>;

export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  S10,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  R10,
  T
>(
  selector1: Selector<S1, R1>,
  selector2: Selector<S2, R2>,
  selector3: Selector<S3, R3>,
  selector4: Selector<S4, R4>,
  selector5: Selector<S5, R5>,
  selector6: Selector<S6, R6>,
  selector7: Selector<S7, R7>,
  selector8: Selector<S8, R8>,
  selector9: Selector<S9, R9>,
  selector10: Selector<S10, R10>,
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9 & S10,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
  ) => T,
  [
    Selector<S1, R1>,
    Selector<S2, R2>,
    Selector<S3, R3>,
    Selector<S4, R4>,
    Selector<S5, R5>,
    Selector<S6, R6>,
    Selector<S7, R7>,
    Selector<S8, R8>,
    Selector<S9, R9>,
    Selector<S10, R10>
  ]
>;
export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  S10,
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7,
  P8,
  P9,
  P10,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  R10,
  T
>(
  selector1: ParametricSelector<S1, P1, R1>,
  selector2: ParametricSelector<S2, P2, R2>,
  selector3: ParametricSelector<S3, P3, R3>,
  selector4: ParametricSelector<S4, P4, R4>,
  selector5: ParametricSelector<S5, P5, R5>,
  selector6: ParametricSelector<S6, P6, R6>,
  selector7: ParametricSelector<S7, P7, R7>,
  selector8: ParametricSelector<S8, P8, R8>,
  selector9: ParametricSelector<S9, P9, R9>,
  selector10: ParametricSelector<S10, P10, R10>,
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9 & S10,
  P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8 & P9 & P10,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
  ) => T,
  [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>,
    ParametricSelector<S5, P5, R5>,
    ParametricSelector<S6, P6, R6>,
    ParametricSelector<S7, P7, R7>,
    ParametricSelector<S8, P8, R8>,
    ParametricSelector<S9, P9, R9>,
    ParametricSelector<S10, P10, R10>
  ]
>;

export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  S10,
  S11,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  R10,
  R11,
  T
>(
  selector1: Selector<S1, R1>,
  selector2: Selector<S2, R2>,
  selector3: Selector<S3, R3>,
  selector4: Selector<S4, R4>,
  selector5: Selector<S5, R5>,
  selector6: Selector<S6, R6>,
  selector7: Selector<S7, R7>,
  selector8: Selector<S8, R8>,
  selector9: Selector<S9, R9>,
  selector10: Selector<S10, R10>,
  selector11: Selector<S11, R11>,
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9 & S10 & S11,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
  ) => T,
  [
    Selector<S1, R1>,
    Selector<S2, R2>,
    Selector<S3, R3>,
    Selector<S4, R4>,
    Selector<S5, R5>,
    Selector<S6, R6>,
    Selector<S7, R7>,
    Selector<S8, R8>,
    Selector<S9, R9>,
    Selector<S10, R10>,
    Selector<S11, R11>
  ]
>;
export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  S10,
  S11,
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7,
  P8,
  P9,
  P10,
  P11,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  R10,
  R11,
  T
>(
  selector1: ParametricSelector<S1, P1, R1>,
  selector2: ParametricSelector<S2, P2, R2>,
  selector3: ParametricSelector<S3, P3, R3>,
  selector4: ParametricSelector<S4, P4, R4>,
  selector5: ParametricSelector<S5, P5, R5>,
  selector6: ParametricSelector<S6, P6, R6>,
  selector7: ParametricSelector<S7, P7, R7>,
  selector8: ParametricSelector<S8, P8, R8>,
  selector9: ParametricSelector<S9, P9, R9>,
  selector10: ParametricSelector<S10, P10, R10>,
  selector11: ParametricSelector<S11, P11, R11>,
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9 & S10 & S11,
  P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8 & P9 & P10 & P11,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
  ) => T,
  [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>,
    ParametricSelector<S5, P5, R5>,
    ParametricSelector<S6, P6, R6>,
    ParametricSelector<S7, P7, R7>,
    ParametricSelector<S8, P8, R8>,
    ParametricSelector<S9, P9, R9>,
    ParametricSelector<S10, P10, R10>,
    ParametricSelector<S11, P11, R11>
  ]
>;

export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  S10,
  S11,
  S12,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  R10,
  R11,
  R12,
  T
>(
  selector1: Selector<S1, R1>,
  selector2: Selector<S2, R2>,
  selector3: Selector<S3, R3>,
  selector4: Selector<S4, R4>,
  selector5: Selector<S5, R5>,
  selector6: Selector<S6, R6>,
  selector7: Selector<S7, R7>,
  selector8: Selector<S8, R8>,
  selector9: Selector<S9, R9>,
  selector10: Selector<S10, R10>,
  selector11: Selector<S11, R11>,
  selector12: Selector<S12, R12>,
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
    res12: R12,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9 & S10 & S11 & S12,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
    res12: R12,
  ) => T,
  [
    Selector<S1, R1>,
    Selector<S2, R2>,
    Selector<S3, R3>,
    Selector<S4, R4>,
    Selector<S5, R5>,
    Selector<S6, R6>,
    Selector<S7, R7>,
    Selector<S8, R8>,
    Selector<S9, R9>,
    Selector<S10, R10>,
    Selector<S11, R11>,
    Selector<S12, R12>
  ]
>;
export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  S10,
  S11,
  S12,
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7,
  P8,
  P9,
  P10,
  P11,
  P12,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  R10,
  R11,
  R12,
  T
>(
  selector1: ParametricSelector<S1, P1, R1>,
  selector2: ParametricSelector<S2, P2, R2>,
  selector3: ParametricSelector<S3, P3, R3>,
  selector4: ParametricSelector<S4, P4, R4>,
  selector5: ParametricSelector<S5, P5, R5>,
  selector6: ParametricSelector<S6, P6, R6>,
  selector7: ParametricSelector<S7, P7, R7>,
  selector8: ParametricSelector<S8, P8, R8>,
  selector9: ParametricSelector<S9, P9, R9>,
  selector10: ParametricSelector<S10, P10, R10>,
  selector11: ParametricSelector<S11, P11, R11>,
  selector12: ParametricSelector<S12, P12, R12>,
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
    res12: R12,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9 & S10 & S11 & S12,
  P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8 & P9 & P10 & P11 & P12,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
    res12: R12,
  ) => T,
  [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>,
    ParametricSelector<S5, P5, R5>,
    ParametricSelector<S6, P6, R6>,
    ParametricSelector<S7, P7, R7>,
    ParametricSelector<S8, P8, R8>,
    ParametricSelector<S9, P9, R9>,
    ParametricSelector<S10, P10, R10>,
    ParametricSelector<S11, P11, R11>,
    ParametricSelector<S12, P12, R12>
  ]
>;

export function createCachedSelector<S1, R1, T>(
  selectors: [Selector<S1, R1>],
  combiner: (res: R1) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<S1, T, (res: R1) => T, [Selector<S1, R1>]>;
export function createCachedSelector<S1, P1, R1, T>(
  selectors: [ParametricSelector<S1, P1, R1>],
  combiner: (res: R1) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S1,
  P1,
  T,
  (res: R1) => T,
  [ParametricSelector<S1, P1, R1>]
>;

export function createCachedSelector<S1, S2, R1, R2, T>(
  selectors: [Selector<S1, R1>, Selector<S2, R2>],
  combiner: (res1: R1, res2: R2) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S1 & S2,
  T,
  (res1: R1, res2: R2) => T,
  [Selector<S1, R1>, Selector<S2, R2>]
>;
export function createCachedSelector<S1, S2, P1, P2, R1, R2, T>(
  selectors: [ParametricSelector<S1, P1, R1>, ParametricSelector<S2, P2, R2>],
  combiner: (res1: R1, res2: R2) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S1 & S2,
  P1 & P2,
  T,
  (res1: R1, res2: R2) => T,
  [ParametricSelector<S1, P1, R1>, ParametricSelector<S2, P2, R2>]
>;

export function createCachedSelector<S1, S2, S3, R1, R2, R3, T>(
  selectors: [Selector<S1, R1>, Selector<S2, R2>, Selector<S3, R3>],
  combiner: (res1: R1, res2: R2, res3: R3) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S1 & S2 & S3,
  T,
  (res1: R1, res2: R2, res3: R3) => T,
  [Selector<S1, R1>, Selector<S2, R2>, Selector<S3, R3>]
>;
export function createCachedSelector<S1, S2, S3, P1, P2, P3, R1, R2, R3, T>(
  selectors: [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>
  ],
  combiner: (res1: R1, res2: R2, res3: R3) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S1 & S2 & S3,
  P1 & P2 & P3,
  T,
  (res1: R1, res2: R2, res3: R3) => T,
  [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>
  ]
>;

export function createCachedSelector<S1, S2, S3, S4, R1, R2, R3, R4, T>(
  selectors: [
    Selector<S1, R1>,
    Selector<S2, R2>,
    Selector<S3, R3>,
    Selector<S4, R4>
  ],
  combiner: (res1: R1, res2: R2, res3: R3, res4: R4) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S1 & S2 & S3 & S4,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4) => T,
  [Selector<S1, R1>, Selector<S2, R2>, Selector<S3, R3>, Selector<S4, R4>]
>;
export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  P1,
  P2,
  P3,
  P4,
  R1,
  R2,
  R3,
  R4,
  T
>(
  selectors: [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>
  ],
  combiner: (res1: R1, res2: R2, res3: R3, res4: R4) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S1 & S2 & S3 & S4,
  P1 & P2 & P3 & P4,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4) => T,
  [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>
  ]
>;

export function createCachedSelector<S1, S2, S3, S4, S5, R1, R2, R3, R4, R5, T>(
  selectors: [
    Selector<S1, R1>,
    Selector<S2, R2>,
    Selector<S3, R3>,
    Selector<S4, R4>,
    Selector<S5, R5>
  ],
  combiner: (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S1 & S2 & S3 & S4 & S5,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5) => T,
  [
    Selector<S1, R1>,
    Selector<S2, R2>,
    Selector<S3, R3>,
    Selector<S4, R4>,
    Selector<S5, R5>
  ]
>;
export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  P1,
  P2,
  P3,
  P4,
  P5,
  R1,
  R2,
  R3,
  R4,
  R5,
  T
>(
  selectors: [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>,
    ParametricSelector<S5, P5, R5>
  ],
  combiner: (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S1 & S2 & S3 & S4 & S5,
  P1 & P2 & P3 & P4 & P5,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5) => T,
  [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>,
    ParametricSelector<S5, P5, R5>
  ]
>;

export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  T
>(
  selectors: [
    Selector<S1, R1>,
    Selector<S2, R2>,
    Selector<S3, R3>,
    Selector<S4, R4>,
    Selector<S5, R5>,
    Selector<S6, R6>
  ],
  combiner: (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6) => T,
  [
    Selector<S1, R1>,
    Selector<S2, R2>,
    Selector<S3, R3>,
    Selector<S4, R4>,
    Selector<S5, R5>,
    Selector<S6, R6>
  ]
>;
export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  T
>(
  selectors: [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>,
    ParametricSelector<S5, P5, R5>,
    ParametricSelector<S6, P6, R6>
  ],
  combiner: (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6,
  P1 & P2 & P3 & P4 & P5 & P6,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6) => T,
  [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>,
    ParametricSelector<S5, P5, R5>,
    ParametricSelector<S6, P6, R6>
  ]
>;

export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  T
>(
  selectors: [
    Selector<S1, R1>,
    Selector<S2, R2>,
    Selector<S3, R3>,
    Selector<S4, R4>,
    Selector<S5, R5>,
    Selector<S6, R6>,
    Selector<S7, R7>
  ],
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6 & S7,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6, res7: R7) => T,
  [
    Selector<S1, R1>,
    Selector<S2, R2>,
    Selector<S3, R3>,
    Selector<S4, R4>,
    Selector<S5, R5>,
    Selector<S6, R6>,
    Selector<S7, R7>
  ]
>;
export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  T
>(
  selectors: [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>,
    ParametricSelector<S5, P5, R5>,
    ParametricSelector<S6, P6, R6>,
    ParametricSelector<S7, P7, R7>
  ],
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6 & S7,
  P1 & P2 & P3 & P4 & P5 & P6 & P7,
  T,
  (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6, res7: R7) => T,
  [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>,
    ParametricSelector<S5, P5, R5>,
    ParametricSelector<S6, P6, R6>,
    ParametricSelector<S7, P7, R7>
  ]
>;

export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  T
>(
  selectors: [
    Selector<S1, R1>,
    Selector<S2, R2>,
    Selector<S3, R3>,
    Selector<S4, R4>,
    Selector<S5, R5>,
    Selector<S6, R6>,
    Selector<S7, R7>,
    Selector<S8, R8>
  ],
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
  ) => T,
  [
    Selector<S1, R1>,
    Selector<S2, R2>,
    Selector<S3, R3>,
    Selector<S4, R4>,
    Selector<S5, R5>,
    Selector<S6, R6>,
    Selector<S7, R7>,
    Selector<S8, R8>
  ]
>;
export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7,
  P8,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  T
>(
  selectors: [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>,
    ParametricSelector<S5, P5, R5>,
    ParametricSelector<S6, P6, R6>,
    ParametricSelector<S7, P7, R7>,
    ParametricSelector<S8, P8, R8>
  ],
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8,
  P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
  ) => T,
  [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>,
    ParametricSelector<S5, P5, R5>,
    ParametricSelector<S6, P6, R6>,
    ParametricSelector<S7, P7, R7>,
    ParametricSelector<S8, P8, R8>
  ]
>;

export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  T
>(
  selectors: [
    Selector<S1, R1>,
    Selector<S2, R2>,
    Selector<S3, R3>,
    Selector<S4, R4>,
    Selector<S5, R5>,
    Selector<S6, R6>,
    Selector<S7, R7>,
    Selector<S8, R8>,
    Selector<S9, R9>
  ],
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
  ) => T,
  [
    Selector<S1, R1>,
    Selector<S2, R2>,
    Selector<S3, R3>,
    Selector<S4, R4>,
    Selector<S5, R5>,
    Selector<S6, R6>,
    Selector<S7, R7>,
    Selector<S8, R8>,
    Selector<S9, R9>
  ]
>;
export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7,
  P8,
  P9,
  P,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  T
>(
  selectors: [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>,
    ParametricSelector<S5, P5, R5>,
    ParametricSelector<S6, P6, R6>,
    ParametricSelector<S7, P7, R7>,
    ParametricSelector<S8, P8, R8>,
    ParametricSelector<S9, P9, R9>
  ],
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9,
  P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8 & P9,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
  ) => T,
  [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>,
    ParametricSelector<S5, P5, R5>,
    ParametricSelector<S6, P6, R6>,
    ParametricSelector<S7, P7, R7>,
    ParametricSelector<S8, P8, R8>,
    ParametricSelector<S9, P9, R9>
  ]
>;

export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  S10,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  R10,
  T
>(
  selectors: [
    Selector<S1, R1>,
    Selector<S2, R2>,
    Selector<S3, R3>,
    Selector<S4, R4>,
    Selector<S5, R5>,
    Selector<S6, R6>,
    Selector<S7, R7>,
    Selector<S8, R8>,
    Selector<S9, R9>,
    Selector<S10, R10>
  ],
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9 & S10,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
  ) => T,
  [
    Selector<S1, R1>,
    Selector<S2, R2>,
    Selector<S3, R3>,
    Selector<S4, R4>,
    Selector<S5, R5>,
    Selector<S6, R6>,
    Selector<S7, R7>,
    Selector<S8, R8>,
    Selector<S9, R9>,
    Selector<S10, R10>
  ]
>;
export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  S10,
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7,
  P8,
  P9,
  P10,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  R10,
  T
>(
  selectors: [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>,
    ParametricSelector<S5, P5, R5>,
    ParametricSelector<S6, P6, R6>,
    ParametricSelector<S7, P7, R7>,
    ParametricSelector<S8, P8, R8>,
    ParametricSelector<S9, P9, R9>,
    ParametricSelector<S10, P10, R10>
  ],
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9 & S10,
  P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8 & P9 & P10,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
  ) => T,
  [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>,
    ParametricSelector<S5, P5, R5>,
    ParametricSelector<S6, P6, R6>,
    ParametricSelector<S7, P7, R7>,
    ParametricSelector<S8, P8, R8>,
    ParametricSelector<S9, P9, R9>,
    ParametricSelector<S10, P10, R10>
  ]
>;

export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  S10,
  S11,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  R10,
  R11,
  T
>(
  selectors: [
    Selector<S1, R1>,
    Selector<S2, R2>,
    Selector<S3, R3>,
    Selector<S4, R4>,
    Selector<S5, R5>,
    Selector<S6, R6>,
    Selector<S7, R7>,
    Selector<S8, R8>,
    Selector<S9, R9>,
    Selector<S10, R10>,
    Selector<S11, R11>
  ],
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9 & S10 & S11,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
  ) => T,
  [
    Selector<S1, R1>,
    Selector<S2, R2>,
    Selector<S3, R3>,
    Selector<S4, R4>,
    Selector<S5, R5>,
    Selector<S6, R6>,
    Selector<S7, R7>,
    Selector<S8, R8>,
    Selector<S9, R9>,
    Selector<S10, R10>,
    Selector<S11, R11>
  ]
>;
export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  S10,
  S11,
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7,
  P8,
  P9,
  P10,
  P11,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  R10,
  R11,
  T
>(
  selectors: [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>,
    ParametricSelector<S5, P5, R5>,
    ParametricSelector<S6, P6, R6>,
    ParametricSelector<S7, P7, R7>,
    ParametricSelector<S8, P8, R8>,
    ParametricSelector<S9, P9, R9>,
    ParametricSelector<S10, P10, R10>,
    ParametricSelector<S11, P11, R11>
  ],
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9 & S10 & S11,
  P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8 & P9 & P10 & P11,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
  ) => T,
  [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>,
    ParametricSelector<S5, P5, R5>,
    ParametricSelector<S6, P6, R6>,
    ParametricSelector<S7, P7, R7>,
    ParametricSelector<S8, P8, R8>,
    ParametricSelector<S9, P9, R9>,
    ParametricSelector<S10, P10, R10>,
    ParametricSelector<S11, P11, R11>
  ]
>;

export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  S10,
  S11,
  S12,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  R10,
  R11,
  R12,
  T
>(
  selectors: [
    Selector<S1, R1>,
    Selector<S2, R2>,
    Selector<S3, R3>,
    Selector<S4, R4>,
    Selector<S5, R5>,
    Selector<S6, R6>,
    Selector<S7, R7>,
    Selector<S8, R8>,
    Selector<S9, R9>,
    Selector<S10, R10>,
    Selector<S11, R11>,
    Selector<S12, R12>
  ],
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
    res12: R12,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9 & S10 & S11 & S12,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
    res12: R12,
  ) => T,
  [
    Selector<S1, R1>,
    Selector<S2, R2>,
    Selector<S3, R3>,
    Selector<S4, R4>,
    Selector<S5, R5>,
    Selector<S6, R6>,
    Selector<S7, R7>,
    Selector<S8, R8>,
    Selector<S9, R9>,
    Selector<S10, R10>,
    Selector<S11, R11>,
    Selector<S12, R12>
  ]
>;
export function createCachedSelector<
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  S10,
  S11,
  S12,
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7,
  P8,
  P9,
  P10,
  P11,
  P12,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  R10,
  R11,
  R12,
  T
>(
  selectors: [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>,
    ParametricSelector<S5, P5, R5>,
    ParametricSelector<S6, P6, R6>,
    ParametricSelector<S7, P7, R7>,
    ParametricSelector<S8, P8, R8>,
    ParametricSelector<S9, P9, R9>,
    ParametricSelector<S10, P10, R10>,
    ParametricSelector<S11, P11, R11>,
    ParametricSelector<S12, P12, R12>
  ],
  combiner: (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
    res12: R12,
  ) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9 & S10 & S11 & S12,
  P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8 & P9 & P10 & P11 & P12,
  T,
  (
    res1: R1,
    res2: R2,
    res3: R3,
    res4: R4,
    res5: R5,
    res6: R6,
    res7: R7,
    res8: R8,
    res9: R9,
    res10: R10,
    res11: R11,
    res12: R12,
  ) => T,
  [
    ParametricSelector<S1, P1, R1>,
    ParametricSelector<S2, P2, R2>,
    ParametricSelector<S3, P3, R3>,
    ParametricSelector<S4, P4, R4>,
    ParametricSelector<S5, P5, R5>,
    ParametricSelector<S6, P6, R6>,
    ParametricSelector<S7, P7, R7>,
    ParametricSelector<S8, P8, R8>,
    ParametricSelector<S9, P9, R9>,
    ParametricSelector<S10, P10, R10>,
    ParametricSelector<S11, P11, R11>,
    ParametricSelector<S12, P12, R12>
  ]
>;

export function createCachedSelector<S, R, T>(
  selectors: Selector<S, R>[],
  combiner: (...res: R[]) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputCachedSelector<S, T, (...res: R[]) => T, Selector<S, R>[]>;
export function createCachedSelector<S, P, R, T>(
  selectors: ParametricSelector<S, P, R>[],
  combiner: (...res: R[]) => T,
  createSelectorOptions?: CreateSelectorOptions,
): OutputParametricCachedSelector<
  S,
  P,
  T,
  (...res: R[]) => T,
  ParametricSelector<S, P, R>[]
>;

export function createCachedSelector(...funcs: any) {
  const {inputSelectors, resultFunc, createSelectorOptions} =
    parseReselectArgs(funcs);

  return (polymorphicOptions: any) => {
    const options =
      typeof polymorphicOptions === 'function'
        ? {keySelector: polymorphicOptions}
        : Object.assign({}, polymorphicOptions);

    // https://github.com/reduxjs/reselect/blob/v4.0.0/src/index.js#L54
    let recomputations = 0;

    const resultFuncWithRecomputations = (...args: Function[]) => {
      recomputations++;
      return resultFunc(...args);
    };

    // Patch reselect call arguments with a custom resultFunc
    const patchedReselectArgs: (Function | Function[])[] = [
      inputSelectors,
      resultFuncWithRecomputations,
    ];
    if (createSelectorOptions) {
      patchedReselectArgs.push(createSelectorOptions);
    }

    const cache = options.cacheObject || new defaultCacheCreator();
    const selectorCreator = options.selectorCreator || createSelector;
    const isValidCacheKey = cache.isValidCacheKey || defaultCacheKeyValidator;

    if (options.keySelectorCreator) {
      options.keySelector = options.keySelectorCreator({
        keySelector: options.keySelector,
        inputSelectors,
        resultFunc,
      });
    }

    // User receives this function
    const selector = function(...args: Function[]) {
      const cacheKey = options.keySelector(...args);

      if (isValidCacheKey(cacheKey)) {
        let cacheResponse = cache.get(cacheKey);

        if (cacheResponse === undefined) {
          cacheResponse = selectorCreator(...patchedReselectArgs);
          cache.set(cacheKey, cacheResponse);
        }

        return cacheResponse(...args);
      }
      console.warn(
        `[re-reselect] Invalid cache key "${cacheKey}" has been returned by keySelector function.`,
      );
      return undefined;
    };

    // Further selector methods
    selector.getMatchingSelector = (...args: Function[]) => {
      const cacheKey = options.keySelector(...args);
      // @NOTE It might update cache hit count in LRU-like caches
      return cache.get(cacheKey);
    };

    selector.removeMatchingSelector = (...args: Function[]) => {
      const cacheKey = options.keySelector(...args);
      cache.remove(cacheKey);
    };

    selector.clearCache = () => {
      cache.clear();
    };

    selector.resultFunc = resultFunc;

    selector.dependencies = inputSelectors;

    selector.cache = cache;

    selector.recomputations = () => recomputations;

    selector.resetRecomputations = () => (recomputations = 0);

    selector.keySelector = options.keySelector;

    return selector;
  };
}
