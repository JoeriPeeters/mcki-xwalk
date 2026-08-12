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

  const [titleRow, textRow] = block.children;
  const titleText = titleRow?.querySelector('p')?.textContent?.trim();
  const textHTML = textRow?.innerHTML;

  const card = document.createElement('pggm-card');
  card.setAttribute('border', 'true');
  moveInstrumentation(block, card);

  if (titleText) {
    const heading = document.createElement('h2');
    heading.textContent = titleText;
    card.append(heading);
  }

  if (textHTML) {
    const textWrapper = document.createElement('div');
    textWrapper.innerHTML = textHTML;
    card.append(...textWrapper.children);
  }

  block.replaceChildren(card);
}
