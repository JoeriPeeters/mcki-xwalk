import { build } from 'esbuild';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

const srcBlocksDir = '../src/blocks';
const outBlocksDir = '../blocks';

// Herschrijft de kale specifier 'eds/scripts.js' naar het echte, relatieve
// pad zoals een blok het t.o.v. zijn eigen locatie in blocks/<naam>/ zou
// gebruiken — en markeert het als external, zodat scripts.js zelf (EDS's
// eigen, al-geladen runtime) niet wordt meegebundeld.
const edsScriptsAliasPlugin = {
  name: 'eds-scripts-alias',
  setup(pluginBuild) {
    pluginBuild.onResolve({ filter: /^eds\/scripts\.js$/ }, () => ({
      path: '../../scripts/scripts.js',
      external: true,
    }));
  },
};

const blockNames = readdirSync(srcBlocksDir).filter((name) => {
  const entry = join(srcBlocksDir, name, `${name}.ts`);
  return existsSync(entry);
});

for (const name of blockNames) {
  await build({
    entryPoints: [join(srcBlocksDir, name, `${name}.ts`)],
    bundle: true,
    format: 'esm',
    target: 'es2020',
    outfile: join(outBlocksDir, name, `${name}.js`),
    sourcemap: true,
    plugins: [edsScriptsAliasPlugin],
  });
  console.log(`Built ${outBlocksDir}/${name}/${name}.js`);
}
