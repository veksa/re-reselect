import fs from "node:fs/promises";
import path from "node:path";
import type { Options } from "tsup";
import { defineConfig } from "tsup";

async function writeCommonJSEntry() {
  await fs.writeFile(
    path.join("dist/cjs/", "index.js"),
    `'use strict'
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./reReselect.production.min.cjs')
} else {
  module.exports = require('./reReselect.development.cjs')
}`
  );
}

export default defineConfig((options): Options[] => {
  const commonOptions: Options = {
    entry: {
      reReselect: "src/index.ts",
    },
    sourcemap: true,
    target: ["esnext"],
    clean: true,
    ...options,
  };

  return [
    {
      ...commonOptions,
      name: "Modern ESM",
      target: ["es2019"],
      format: ["esm"],
      outExtension: () => ({ js: ".mjs" }),
    },
    {
      ...commonOptions,
      name: "CJS Development",
      entry: {
        "reReselect.development": "src/index.ts",
      },
      env: {
        NODE_ENV: "development",
      },
      format: ["cjs"],
      outDir: "./dist/cjs/",
      outExtension: () => ({ js: ".cjs" }),
    },
    {
      ...commonOptions,
      name: "CJS production",
      entry: {
        "reReselect.production.min": "src/index.ts",
      },
      env: {
        NODE_ENV: "production",
      },
      format: ["cjs"],
      outDir: "./dist/cjs/",
      outExtension: () => ({ js: ".cjs" }),
      minify: true,
      onSuccess: async () => {
        await writeCommonJSEntry();
      },
    },
    {
      ...commonOptions,
      name: "CJS Type Definitions",
      format: ["cjs"],
      dts: { only: true },
    },
  ];
});
