// Kale specifier i.p.v. een relatief pad: een esbuild-plugin (zie
// build-blocks.mjs) herschrijft dit naar het juiste, relatieve EDS-pad
// t.o.v. de uiteindelijke blocks/-locatie. TypeScript resolvet dit via
// de "paths"-mapping in tsconfig.json naar eds-globals.d.ts.
import { moveInstrumentation } from 'eds/scripts.js';

interface FancyCardAttributes {
  variant?: 'default' | 'highlight' | 'warning';
}

class FancyCard extends HTMLElement implements FancyCardAttributes {
  static get observedAttributes(): string[] {
    return ['variant'];
  }

  get variant(): FancyCardAttributes['variant'] {
    return (this.getAttribute('variant') as FancyCardAttributes['variant']) || 'default';
  }

  set variant(value: FancyCardAttributes['variant']) {
    if (value) this.setAttribute('variant', value);
    else this.removeAttribute('variant');
  }

  connectedCallback(): void {
    if (this.shadowRoot) return;
    const shadow = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `
      :host { display: block; border-radius: 12px; padding: 1.5rem; border: 1px solid #e2e2e2; background: #fff; font-family: system-ui, sans-serif; }
      :host([variant="highlight"]) { border-color: #6a5acd; background: #f5f3ff; }
      :host([variant="warning"]) { border-color: #d97706; background: #fffbeb; }
      ::slotted(h2) { margin-top: 0; }
    `;
    shadow.append(style, document.createElement('slot'));
  }
}

if (!customElements.get('fancy-card')) {
  customElements.define('fancy-card', FancyCard);
}

interface TypescriptCardModel {
  title: string;
  text: string;
  variant: FancyCardAttributes['variant'];
}

function readModel(block: HTMLElement): TypescriptCardModel {
  const [titleRow, textRow, variantRow] = [...block.children] as HTMLElement[];
  return {
    title: titleRow?.querySelector('p')?.textContent?.trim() || '',
    text: textRow?.innerHTML || '',
    variant: (variantRow?.textContent?.trim().toLowerCase() as FancyCardAttributes['variant']) || 'default',
  };
}

export default function decorate(block: HTMLElement): void {
  const { title, text, variant } = readModel(block);

  const card = document.createElement('fancy-card') as FancyCard;
  card.variant = variant;
  if (title) {
    const heading = document.createElement('h2');
    heading.textContent = title;
    card.append(heading);
  }
  if (text) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = text;
    card.append(...wrapper.children);
  }

  moveInstrumentation(block, card);
  block.replaceChildren(card);
}
