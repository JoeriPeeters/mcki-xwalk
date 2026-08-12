import { moveInstrumentation } from '../../scripts/scripts.js';
import './media-viewer-component.js';

export default function decorate(block) {
  const greeting = block.querySelector('p')?.textContent?.trim() || 'Hello Web component !';

  const viewer = document.createElement('media-viewer');
  viewer.dataset.greeting = greeting; // → wordt data-greeting="..." in de DOM
  moveInstrumentation(block, viewer);

  block.replaceChildren(viewer);
}
