import { expectTypeOf } from 'expect-type';
import { createSelector } from 'reselect';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createCachedSelector } from '../src/index';
import type { ImplicitAnyStateError } from '../src/types';

beforeEach(() => {
  vi.spyOn(global.console, 'warn').mockImplementation(() => {});
});

describe('createCachedSelector use cases', () => {
  describe('nested cached input selectors', () => {
    it('works', () => {
      type State = { foo: string; bar: number; baz: boolean };

      const nestedSelector = createCachedSelector(
        [(state: State) => state.foo, (state: State) => state.bar],
        (foo, bar) => ({ foo, bar }),
      )((state: State) => state.foo);

      const selector = createCachedSelector(
        // `state` must be annotated: reselect v5 cannot contextually type an
        // inline input selector while inferring the input tuple (see the
        // "unannotated inline input selectors" block below for the bare repro).
        [nestedSelector, (state: State) => state.baz],
        (result1, result2) => {
          expectTypeOf(result1).toEqualTypeOf<{ foo: string; bar: number }>();
          expectTypeOf(result2).toBeBoolean();

          return [result1.foo, result1.bar, result2];
        },
      )((state: State) => state.bar);

      const actual = selector({
        foo: 'aaa',
        bar: 123,
        baz: true,
      });
      expect(actual).toEqual(['aaa', 123, true]);
      expectTypeOf(actual).toEqualTypeOf<(string | number | boolean)[]>();
    });
  });

  // reselect v5 cannot contextually type an inline input selector while it is
  // still inferring the input tuple, so an unannotated `(state) => state.foo`
  // next to an annotated one resolves to `any` and that `any` propagates into
  // the combiner arguments and the result. The old hand-written per-arity
  // `index.d.ts` typed those correctly, so the migration would silently drop
  // type safety. `HasMixedAnyState` turns the mixed case into a compile error
  // instead; the plain-reselect case below shows what it still does upstream.
  describe('unannotated inline input selectors', () => {
    describe('via createCachedSelector', () => {
      it('is a compile error rather than a silent `any`', () => {
        type State = { foo: boolean };

        const factory = createCachedSelector(
          // No annotation on `state` in the second inline input selector.
          [(state: State) => state.foo, (state) => state.foo],
          (input1, input2) => ({ input1, input2 }),
        );

        // The factory degrades to a single-parameter function whose parameter
        // type *is* the diagnostic, so passing a keySelector fails to compile.
        expectTypeOf(factory).parameters.toEqualTypeOf<
          [ImplicitAnyStateError]
        >();

        // @ts-expect-error mixed `any`/typed input selector states
        factory((state: State) => String(state.foo));

        // Runtime is unaffected — only the static type was ever degraded.
        const selector = (
          factory as unknown as (
            keySelector: (state: State) => string,
          ) => (state: State) => { input1: boolean; input2: boolean }
        )((state) => String(state.foo));

        expect(selector({ foo: true })).toEqual({
          input1: true,
          input2: true,
        });
      });
    });

    describe('reselect createSelector', () => {
      it('degrades the inferred result type to `any`', () => {
        type State = { foo: boolean };

        // Same shortcoming reproduced with plain reselect, confirming the
        // limitation originates upstream and not in re-reselect's wrapper.
        const selector = createSelector(
          [(state: State) => state.foo, (state) => state.foo],
          (input1, input2) => {
            expectTypeOf(input1).toBeBoolean();
            // The inferred type has degraded to `any`
            expectTypeOf(input2).toBeAny();

            return { input1, input2 };
          },
        );

        const actual = selector({ foo: true });

        expect(actual).toEqual({ input1: true, input2: true });
        expectTypeOf(actual).toEqualTypeOf<{
          input1: boolean;
          // The inferred type has degraded to `any`
          input2: any;
        }>();
      });
    });
  });

  // re-reselect's signature pattern: the cache dimension exists only to pick a
  // cacheKey, so no input selector declares it. reselect's own
  // `GetParamsFromSelectors` looks at input selectors alone, so a naive port
  // rejects the keySelector, the call, and both cache-inspection methods.
  // Appending the keySelector to the merged selector array restores all four.
  describe('cache dimension declared only by the keySelector', () => {
    type State = { items: Record<string, number>; total: number };
    type Props = { itemId: string };

    const state: State = { items: { a: 1, b: 2 }, total: 42 };
    const props: Props = { itemId: 'a' };

    it('accepts the keySelector and threads its params into the selector', () => {
      // Arrange: input selectors read `state` only; `props` is the dimension.
      const selector = createCachedSelector(
        (state: State) => state.items,
        (state: State) => state.total,
        (items, total) => total,
      )((state: State, props: Props) => props.itemId);

      // Assert: the extra param shows up in the public call signature
      expectTypeOf(selector).parameters.toEqualTypeOf<[State, Props]>();

      // ...and in both cache-inspection methods
      expectTypeOf(selector.getMatchingSelector).parameters.toEqualTypeOf<
        [State, Props]
      >();
      expectTypeOf(selector.removeMatchingSelector).parameters.toEqualTypeOf<
        [State, Props]
      >();

      // Act / Assert: runtime keys on `props.itemId`
      expect(selector(state, props)).toBe(42);
      expect(selector.getMatchingSelector(state, props)).toBeTypeOf('function');
      expect(selector.recomputations()).toBe(1);

      selector(state, { itemId: 'b' });
      expect(selector.recomputations()).toBe(2);

      selector.removeMatchingSelector(state, props);
      expect(selector.getMatchingSelector(state, props)).toBeUndefined();
    });

    it('works through the options object too', () => {
      const selector = createCachedSelector(
        (state: State) => state.total,
        (total) => total,
      )({ keySelector: (state: State, props: Props) => props.itemId });

      expectTypeOf(selector).parameters.toEqualTypeOf<[State, Props]>();
      expect(selector(state, props)).toBe(42);
    });

    it('still rejects arguments no input selector or keySelector declares', () => {
      const selector = createCachedSelector(
        (state: State) => state.total,
        (total) => total,
      )((state: State) => 'key');

      expectTypeOf(selector).parameters.toEqualTypeOf<[State]>();

      // @ts-expect-error nothing declares a second argument
      selector(state, props);
    });

    it('keeps params declared by an input selector precisely typed', () => {
      const selector = createCachedSelector(
        (state: State) => state.items,
        (state: State, id: string) => id,
        (items, id) => items[id],
      )((state, id) => {
        // Contextually typed from the input selectors, not widened to `any`
        expectTypeOf(id).toEqualTypeOf<string>();
        return id;
      });

      expectTypeOf(selector).parameters.toEqualTypeOf<[State, string]>();
      expect(selector(state, 'b')).toBe(2);

      // @ts-expect-error the declared param is a string
      selector(state, 123);
    });
  });

  describe('multiple parametric selectors', () => {
    it('works', () => {
      type State = { foo: string };
      type Props = { bar: number };

      const selector = createCachedSelector(
        (state: State) => state.foo,
        (state: State) => state.foo,
        (state: State) => state.foo,
        (state: State) => state.foo,
        (state: State) => state.foo,
        (state: State) => state.foo,
        (state: State) => state.foo,
        (state: State) => state.foo,
        (state: State) => state.foo,
        (state: State, props: Props) => props.bar,

        (
          input1,
          input2,
          input3,
          input4,
          input5,
          input6,
          input7,
          input8,
          input9,
          input10,
        ) => {
          expectTypeOf(input1).toBeString();
          expectTypeOf(input2).toBeString();
          expectTypeOf(input3).toBeString();
          expectTypeOf(input4).toBeString();
          expectTypeOf(input5).toBeString();
          expectTypeOf(input6).toBeString();
          expectTypeOf(input7).toBeString();
          expectTypeOf(input8).toBeString();
          expectTypeOf(input9).toBeString();
          expectTypeOf(input10).toBeNumber();

          return {
            input1,
            input2,
            input3,
            input4,
            input5,
            input6,
            input7,
            input8,
            input9,
            input10,
          };
        },
      )((state, props) => {
        expectTypeOf(state).toEqualTypeOf<State>();
        expectTypeOf(props).toEqualTypeOf<Props>();

        return props.bar;
      });

      expectTypeOf(selector).parameters.toEqualTypeOf<[State, Props]>();

      const actual = selector({ foo: 'fizz' }, { bar: 42 });
      expect(actual).toEqual({
        input1: 'fizz',
        input2: 'fizz',
        input3: 'fizz',
        input4: 'fizz',
        input5: 'fizz',
        input6: 'fizz',
        input7: 'fizz',
        input8: 'fizz',
        input9: 'fizz',
        input10: 42,
      });

      expectTypeOf(actual).toEqualTypeOf<{
        input1: string;
        input2: string;
        input3: string;
        input4: string;
        input5: string;
        input6: string;
        input7: string;
        input8: string;
        input9: string;
        input10: number;
      }>();
    });
  });

  describe('multiple array selectors', () => {
    it('works', () => {
      type State = { foo: string };
      type Props = { bar: number };

      const selector = createCachedSelector(
        [
          (state: State) => state.foo,
          (state: State) => state.foo,
          (state: State) => state.foo,
          (state: State) => state.foo,
          (state: State) => state.foo,
          (state: State) => state.foo,
          (state: State) => state.foo,
          (state: State) => state.foo,
          (state: State) => state.foo,
          (state: State, props: Props) => props.bar,
        ],

        (
          input1,
          input2,
          input3,
          input4,
          input5,
          input6,
          input7,
          input8,
          input9,
          input10,
        ) => {
          expectTypeOf(input1).toBeString();
          expectTypeOf(input2).toBeString();
          expectTypeOf(input3).toBeString();
          expectTypeOf(input4).toBeString();
          expectTypeOf(input5).toBeString();
          expectTypeOf(input6).toBeString();
          expectTypeOf(input7).toBeString();
          expectTypeOf(input8).toBeString();
          expectTypeOf(input9).toBeString();
          expectTypeOf(input10).toBeNumber();

          return {
            input1,
            input2,
            input3,
            input4,
            input5,
            input6,
            input7,
            input8,
            input9,
            input10,
          };
        },
      )((state, props) => {
        expectTypeOf(state).toEqualTypeOf<State>();
        expectTypeOf(props).toEqualTypeOf<Props>();

        return props.bar;
      });

      expectTypeOf(selector).parameters.toEqualTypeOf<[State, Props]>();

      const actual = selector({ foo: 'fizz' }, { bar: 42 });
      expect(actual).toEqual({
        input1: 'fizz',
        input2: 'fizz',
        input3: 'fizz',
        input4: 'fizz',
        input5: 'fizz',
        input6: 'fizz',
        input7: 'fizz',
        input8: 'fizz',
        input9: 'fizz',
        input10: 42,
      });

      expectTypeOf(actual).toEqualTypeOf<{
        input1: string;
        input2: string;
        input3: string;
        input4: string;
        input5: string;
        input6: string;
        input7: string;
        input8: string;
        input9: string;
        input10: number;
      }>();
    });
  });
});
