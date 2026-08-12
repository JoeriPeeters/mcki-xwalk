import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  // 1. laadt p-elements-core → zet
  // CustomElement/Maquette/CustomElementConfig/property op globalThis
  await import('./vendor/p-elements-core.js');

  // 2. fix de naam-mismatch (card.js verwacht 'Property', p-elements-core zet 'property')
  window.Property = window.property;

  // 3. nu pas card.js laden — customElements.define('pggm-card', ...) draait hier
  await import('./vendor/card.js');

  const card = document.createElement('pggm-card');
  card.setAttribute('border', 'true');
  moveInstrumentation(block, card);

  [...block.children].forEach((row) => card.append(...row.children));

  block.replaceChildren(card);
}
