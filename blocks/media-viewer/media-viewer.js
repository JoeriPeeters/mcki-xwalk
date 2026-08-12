import { moveInstrumentation } from '../../scripts/scripts.js';
import './media-viewer-component.js';

export default function decorate(block) {
  const greetingEl = block.querySelector('[data-aue-prop="greeting"]');
  const greeting = greetingEl?.textContent?.trim() || 'Hello Web component !';

  const viewer = document.createElement('media-viewer');
  viewer.setAttribute('greeting', greeting);
  moveInstrumentation(block, viewer);

  block.replaceChildren(viewer);
}
