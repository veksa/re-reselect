import { defineConfig } from 'tsdown';

const deps = { neverBundle: ['@veksa/reselect'] };

// Highest target webpack 4's parser still accepts. It only downlevels the
// ES2020 operators (`?.`, `??`); classes and arrows stay, exactly like every
// reselect build. reselect pins its legacy build to `es2017`, but that also
// downlevels object spread — which re-reselect uses and reselect does not —
// for +693 bytes gzip instead of +82, with no extra compatibility.
const target = 'es2019';

// The root `tsconfig.json` spans the whole repo (sources, tests, tooling
// configs) so `npm run type:check` covers everything. The bundler needs the
// narrower `src`-only view instead.
const tsconfig = './tsconfig.build.json';

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
    tsconfig,
    target,
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
    tsconfig,
    target,
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
    tsconfig,
    target,
    globalName: 'Re-reselect',
    // Keep the browser global named `reselect`: `@veksa/reselect` is a drop-in
    // fork, so UMD consumers shouldn't have to rename the global they load.
    // Without this rollup guesses `_veksa_reselect` from the scoped name.
    outputOptions: { globals: { '@veksa/reselect': 'reselect' } },
    dts: false,
    clean: false,
  },
  {
    // Old bundlers (webpack 4) resolve the `module` field and never look at
    // `exports`, so this entry exists only for them: Node always reaches the
    // `.mjs` build through `exports.import`.
    //
    // The `.js` extension is load-bearing. webpack 4 treats `.mjs` as strict
    // ESM and then refuses to re-export named bindings out of reselect's own
    // `.js` ESM build ("Can't reexport the named export 'createSelector' from
    // non EcmaScript module"). reselect ships `reselect.legacy-esm.js` for
    // exactly this reason; this mirrors it.
    entry: { 'index.legacy-esm': 'src/index.ts' },
    format: 'esm',
    outDir: 'dist/es',
    outExtensions: () => ({ js: '.js' }),
    sourcemap: true,
    deps,
    tsconfig,
    target,
    dts: false,
    clean: false,
    unbundle: false,
  },
]);
