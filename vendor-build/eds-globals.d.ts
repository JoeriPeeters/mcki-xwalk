// EDS's scripts.js/aem.js zijn plain-JS runtime-bestanden zonder eigen types.
// Blocks importeren ze relatief t.o.v. hun UITEINDELIJKE locatie in blocks/,
// niet t.o.v. hun bron-locatie in src/blocks/ — vandaar deze wildcard-declaratie
// i.p.v. een pad-specifieke import die tsc fysiek zou proberen op te lossen.
declare module 'eds/scripts.js' {
  export function moveInstrumentation(from: Element, to: Element): void;
  export function loadCSS(href: string): Promise<void>;
  export function loadScript(src: string, attrs?: Record<string, string>): Promise<void>;
}
