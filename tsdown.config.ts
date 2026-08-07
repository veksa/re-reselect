import { defineConfig } from 'tsdown';

const deps = { neverBundle: ['@veksa/reselect'] };

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/reselectWrapper.ts'],
    format: 'esm',
    outDir: 'dist/es',
    // `.mjs`, not `.js`: the package has no `"type": "module"`, so Node reads a
    // `.js` file as CommonJS and would fail to parse this build. The extension
    // marks it as ESM regardless, which is what lets `exports.import` point here
    // without breaking Node consumers.
    // The declarations stay `.d.ts`: they are condition-agnostic, and a single
    // `types` entry serves both `import` and `require` (the shape reselect uses).
    outExtensions: () => ({ js: '.mjs', dts: '.d.ts' }),
    sourcemap: true,
    deps,
    clean: true,
    unbundle: false,
  },
  {
    entry: ['src/index.ts', 'src/reselectWrapper.ts'],
    format: 'cjs',
    outDir: 'dist/cjs',
    outExtensions: () => ({ js: '.js' }),
    sourcemap: true,
    deps,
    dts: false,
    clean: false,
    unbundle: false,
  },
  {
    entry: ['src/index.ts'],
    format: 'umd',
    outDir: 'dist/umd',
    sourcemap: true,
    deps,
    globalName: 'Re-reselect',
    // Keep the browser global named `reselect`: `@veksa/reselect` is a drop-in
    // fork, so UMD consumers shouldn't have to rename the global they load.
    // Without this rollup guesses `_veksa_reselect` from the scoped name.
    outputOptions: { globals: { '@veksa/reselect': 'reselect' } },
    dts: false,
    clean: false,
  },
]);
