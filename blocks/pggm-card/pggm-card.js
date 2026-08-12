import { moveInstrumentation } from '../../scripts/scripts.js';

function loadTokens() {
  if (document.querySelector('link[href*="tokens.css"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('./vendor/tokens.css', import.meta.url);
  document.head.appendChild(link);
}

async function loadPggmCard() {
  await import('./vendor/p-elements-core.js');
  window.Property = window.property;
  await import('./vendor/card.js');
}

export default async function decorate(block) {
  loadTokens();
  await loadPggmCard();

  const card = document.createElement('pggm-card');
  card.setAttribute('border', 'true');
  moveInstrumentation(block, card);
  card.append(...block.children);

  block.replaceChildren(card);
}
