import esbuild from 'esbuild';
import { globSync } from 'glob';

const entries = globSync('src/blocks/**/*.ts');

await esbuild.build({
  entryPoints: entries,
  outdir: 'blocks',
  outbase: 'src/blocks',
  format: 'esm',
  bundle: false,
  sourcemap: true,
  target: 'es2022',
});

console.log(`Gebouwd: ${entries.length} bestand(en)`);
