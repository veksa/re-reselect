---
're-reselect': patch
---

Stop publishing the internal `reselectWrapper` module.

It existed only so tests could spy on reselect's `createSelector`, but it was
listed as a bundle entry, so it shipped as four extra files (`dist/cjs`,
`dist/es`, plus declarations) that no `exports` condition could reach. Dropping
it also removes an inconsistency where the ESM build emitted it as a separate
chunk while the CJS build inlined it, and it fixes a missing sourcemap for the
ESM copy. The library now imports `reselect` directly and the tests observe
selector instantiation through the public `selectorCreator` option.

No importable API changes: the module was never reachable from the package root.
