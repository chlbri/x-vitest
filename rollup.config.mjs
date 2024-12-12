import terser from '@rollup/plugin-terser';
import { globSync } from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'rollup';
import { nodeExternals } from 'rollup-plugin-node-externals';
import tscAlias from 'rollup-plugin-tsc-alias';
import typescript from 'rollup-plugin-typescript2';

const exclude = [
  '**/*.test.ts',
  '**/*.test-d.ts',
  '**/*.fixtures.ts',
  '**/*.fixture.ts',
  '**/fixtures.ts',
  '**/fixtures/**/*',
  '**/fixture.ts',
  'src/tests/**/*',
  'src/config/**/*',
];

const input = Object.fromEntries(
  globSync('src/**/*.ts', {
    ignore: [...exclude, '**/types.ts'],
  }).map(file => [
    // This remove `src/` as well as the file extension from each
    // file, so e.g. src/nested/foo.js becomes nested/foo
    path.relative(
      'src',
      file.slice(0, file.length - path.extname(file).length),
    ),
    // This expands the relative paths to absolute paths, so e.g.
    // src/nested/foo becomes /project/src/nested/foo.js
    fileURLToPath(new URL(file, import.meta.url)),
  ]),
);

export default defineConfig({
  input,

  plugins: [
    tscAlias(),
    typescript({
      tsconfigOverride: {
        exclude,
      },
    }),

    nodeExternals({
      optDeps: false,
      builtinsPrefix: 'strip',
    }),
    terser(),
  ],
  external: ['node:path', 'vitest'],
  output: [
    {
      format: 'cjs',
      sourcemap: true,
      dir: `lib`,
      preserveModulesRoot: 'src',
      preserveModules: true,

      entryFileNames: '[name].cjs',
    },
    {
      format: 'es',
      sourcemap: true,
      dir: `lib`,
      preserveModulesRoot: 'src',
      preserveModules: true,
      entryFileNames: '[name].js',
    },
  ],
});
